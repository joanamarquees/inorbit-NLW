import { client, db } from '.'
import { completedGoals, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(completedGoals) // we need to delete the completed goals first because they have foreign key constraints
  await db.delete(goals)

  const result = await db.insert(goals).values([
    { title: 'wake up early', desiredWeeklyFrequency: 5 },
    { title: 'go to the gym', desiredWeeklyFrequency: 3 },
    { title: 'read a book', desiredWeeklyFrequency: 2 },
  ]).returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(completedGoals).values([
    { goalId: result[1].id, createdAt: startOfWeek.toDate() },
    { goalId: result[2].id, createdAt: startOfWeek.add(1, 'day').toDate()},
  ])
}

seed().finally( () => {
  client.end()
})