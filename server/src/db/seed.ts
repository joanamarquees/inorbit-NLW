import { client, db } from '.'
import { completedGoals, goals } from './schema'
import dayjs from 'dayjs'
import { execSync } from 'child_process'

async function runMigrations() {
  console.log('Running migrations...')
  execSync('npx drizzle-kit generate', { stdio: 'inherit' })
}

async function seed() {
  // Run migrations to ensure the database schema is up to date
  await runMigrations()

  // Delete existing data
  await db.delete(completedGoals) // we need to delete the completed goals first because they have foreign key constraints
  await db.delete(goals)

  // Insert new goals
  const goalsEx = await db.insert(goals).values([
    { title: "wake up early", desiredWeeklyFrequency: 5 },
    { title: "go to the gym", desiredWeeklyFrequency: 3 },
    { title: "read a book", desiredWeeklyFrequency: 2 },
  ]).returning()

  // Insert completed goals
  const startOfWeek = dayjs().startOf('week')

  await db.insert(completedGoals).values([
    { goalId: goalsEx[1].id, createdAt: startOfWeek.toDate() },
    { goalId: goalsEx[2].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
}).catch(error => {
  console.error('Error seeding database:', error)
  client.end()
})