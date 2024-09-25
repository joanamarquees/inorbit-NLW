import dayjs from 'dayjs'
import { db } from '../db/index'
import { completedGoals, goals } from '../db/schema'
import { lte, and, gte, eq, sql, desc } from 'drizzle-orm'
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export async function getWeekSummary() {
  const firstDayOfWeek = dayjs().startOf('isoWeek').toDate()
  const lastDayOfWeek = dayjs().endOf('isoWeek').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createdAt,
    })
    .from(goals)
    .where(lte(goals.createdAt, lastDayOfWeek))
  )

  const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
    db.select({
      id: completedGoals.goalId,
      title: goals.title,
      completedAt: completedGoals.createdAt,
      completedAtDate: sql /*sql*/`
      DATE(${completedGoals.createdAt})
      `.as('completedAtDate')
      // here we use sql instead of goals.createdAt because we want the date of its conclusion without the time
    })
    .from(completedGoals)
    .orderBy(desc(completedGoals.createdAt))
    .innerJoin(goals, eq(goals.id, completedGoals.goalId))
    .where(and(
      gte(goals.createdAt, firstDayOfWeek),
      lte(goals.createdAt, lastDayOfWeek)
    ))
  )

  const goalsCompletedByDate = db.$with('goals_completed_by_date').as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedAtDate,
      completed: sql /*sql*/ `
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id', ${goalsCompletedInWeek.id},
            'title', ${goalsCompletedInWeek.title},
            'completedAt', ${goalsCompletedInWeek.completedAt}
          )
        )
      `.as('completed')
    })
    .from(goalsCompletedInWeek)
    .groupBy(goalsCompletedInWeek.completedAtDate)
    .orderBy(desc(goalsCompletedInWeek.completedAtDate))
  )

  type GoalsPerDay = Record<string, {
    id: string
    title: string
    completedAt: string
  }[]> // [] means that it is an array of {} objects

  const result = await
    db.with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByDate)
    .select({
      completed:
        sql /*sql*/`(SELECT COUNT(*) from ${goalsCompletedInWeek})`
        .mapWith(Number),
      total:
        sql/*sql*/`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) from ${goalsCreatedUpToWeek})`
        .mapWith(Number),
      goalsPerDay: sql/*sql*/ <GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByDate.completedAtDate},
          ${goalsCompletedByDate.completed}
        )
        `
    })
    .from(goalsCompletedByDate)

  return {
    summary: result[0],
  }
}