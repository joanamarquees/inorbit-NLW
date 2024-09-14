import dayjs from 'dayjs'
import { db } from '../db'
import { completedGoals, goals } from '../db/schema'
import { lte, and, gte, eq, sql } from 'drizzle-orm'

export async function getWeekSummary() {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

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

  const goalsCompletedInWeek = db.$with('goals-completed-in-week').as(
    db.select({
      id: completedGoals.id,
      title: goals.title,
      completedAt: completedGoals.createdAt,
      completedAtDate: sql`
      DATE(${completedGoals.createdAt})
      `.as('completedAtDate'),
      // here we use sql instead of goals.createdAt because we want the date of its conclusion without the time
    })
    .from(completedGoals)
    .innerJoin(goals, eq(goals.id, completedGoals.goalId))
    .where(and(
      gte(goals.createdAt, firstDayOfWeek),
      lte(goals.createdAt, lastDayOfWeek)
    ))
  )

  const goalsCompletedByDate = db.$with('goals-completed-by-date').as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedAtDate,
      completed: sql`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'idi, ${goalsCompletedInWeek.id},
            'title', ${goalsCompletedInWeek.title},
            'completedAt', ${goalsCompletedInWeek.completedAt}
          )
        )
      `.as('completed'),
    })
    .from(goalsCompletedInWeek)
    .groupBy(goalsCompletedInWeek.completedAtDate)
  )

  const result = await db
    .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByDate)
    .select({
      completed: sql`(SELECT COUNT(*) from ${goalsCompletedInWeek})`
      .mapWith(Number),
      total: sql`(SELECT SUM(${goalsCreatedUpToWeek.desiredWeeklyFrequency}) from ${goalsCreatedUpToWeek})`
      .mapWith(Number),
      goalsPerDay: sql`
        JSON_OBJECT_AGG(
          ${goalsCompletedByDate.completedAtDate},
          ${goalsCompletedByDate.completed}
        )
        `

    })
    .from(goalsCompletedByDate)

  return {
    summary: result,
  }
}