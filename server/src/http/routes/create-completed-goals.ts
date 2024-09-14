import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { markGoalCompleted } from '../../features/create-goals-completions';

export const createGoalCompletedRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/goals-completed', {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  }, async (request) => {
    const { goalId } = request.body
  
    await markGoalCompleted({
      goalId,
    })
  })
};