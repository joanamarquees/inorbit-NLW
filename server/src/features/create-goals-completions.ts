import{ and,  lte, gte, count, eq, sql } from "drizzle-orm"
import { db } from '../db'
import { completedGoals, goals } from '../db/schema'
import dayjs from 'dayjs'
import { error } from "console"


interface MarkGoalCompletedRequest {
  goalId: string
}

export async function markGoalCompleted ({
  goalId
}: MarkGoalCompletedRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  const completedGoalsCount = db.$with('completed_goals_count').as(
    db.select({
      goalId: completedGoals.goalId,
      count: count(completedGoals.goalId),
    })
    .from(completedGoals)
    .where(and(
      gte(goals.createdAt, firstDayOfWeek),
      lte(goals.createdAt, lastDayOfWeek),
      eq(goals.id, goalId)
    ))
    .groupBy(completedGoals.goalId)
  )

  const result = await db
  .with(completedGoalsCount)
  .select({
    desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    completedCount: sql`
      COALESCE(${completedGoalsCount.count}, 0)
    `.mapWith(Number),
  })
  .from(goals)
  .leftJoin(completedGoalsCount, eq(completedGoalsCount.goalId, goals.id))
  .where(eq(goals.id, goalId))
  .limit(1)

  const { completedCount, desiredWeeklyFrequency } = result[0]

  if ( completedCount >= desiredWeeklyFrequency) {
    throw new Error('Goal already completed this week')
  }

  const insertResult = await db.insert(completedGoals).values({ goalId }).returning()
  const completedGoal = insertResult[0]

  return {
    completedGoal,
  }
}