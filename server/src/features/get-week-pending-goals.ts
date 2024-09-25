import dayjs from "dayjs"
import { db } from '../db/index'
import { completedGoals, goals } from "../db/schema"
import{ asc,  lte, count, eq, sql } from "drizzle-orm"
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf('isoWeek').toDate()

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db.select({
      id: goals.id,
      title: goals.title,
      desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
      createdAt: goals.createdAt,
    })
    .from(goals)
    .where(lte(goals.createdAt, lastDayOfWeek)),
  )

  const completedGoalsCount = db.$with('completed_goals_count').as(
    db.select({
      goalId: goals.id,
      count: count(completedGoals.id).as('count'),
    })
    .from(completedGoals)
    .innerJoin(goals, eq(goals.id, completedGoals.goalId))
    .groupBy(goals.id)
  )

  const pendingGoals = await db.with(goalsCreatedUpToWeek, completedGoalsCount)
  .select({
    id: goalsCreatedUpToWeek.id,
    title: goalsCreatedUpToWeek.title,
    desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
    completedGoalsCount: sql`COALESCE(${completedGoalsCount.count}, 0)`.mapWith(Number),
  })
  .from(goalsCreatedUpToWeek)
  .orderBy(asc(goalsCreatedUpToWeek.createdAt))
  .leftJoin(
    completedGoalsCount,
    eq(goalsCreatedUpToWeek.id, completedGoalsCount.goalId)
  )

  return {
    pendingGoals,
  }
} 