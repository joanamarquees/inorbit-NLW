import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod"
import { createGoalRoute } from './routes/create-goal'
import { getPendingGoalsRoute } from './routes/get-pending-goals'
import { createGoalCompletedRoute } from './routes/create-completed-goals'
import { getWeekSummaryRoute } from './routes/get-week-summary'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: '*' })

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute)
app.register(getPendingGoalsRoute)
app.register(createGoalCompletedRoute)
app.register(getWeekSummaryRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})