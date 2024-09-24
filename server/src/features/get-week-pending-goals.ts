import dayjs from "dayjs"
import { db } from '../db'
import { completedGoals, goals } from "../db/schema"
import{ and,  lte, gte, count, eq, sql } from "drizzle-orm"

export async function getWeekPendingGoals() {
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
    .where(lte(goals.createdAt, lastDayOfWeek)),
  )

  const completedGoalsCount = db.$with('completed_goals_count').as(
    db.select({
      goalId: completedGoals.goalId,
      count: count(completedGoals.goalId),
    })
    .from(completedGoals)
    .where(and(
      gte(goals.createdAt, firstDayOfWeek),
      lte(goals.createdAt, lastDayOfWeek)
    ))
    .groupBy(completedGoals.goalId),
  )

  const pendingGoals = await db.with(goalsCreatedUpToWeek, completedGoalsCount)
  .select({
    id: goalsCreatedUpToWeek.id,
    title: goalsCreatedUpToWeek.title,
    desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
    completedGoalsCount: sql`
      COALESCE(${completedGoalsCount.count}, 0)
    `.mapWith(Number),
  })
  .from(goalsCreatedUpToWeek)
  .leftJoin(completedGoalsCount, eq(completedGoalsCount.goalId, goalsCreatedUpToWeek.id),
  )

  return {
    pendingGoals,
  }
} 