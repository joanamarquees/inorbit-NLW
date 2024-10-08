import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingGoals } from "../http/get-pending-goals";
import { OutlineButton } from "./ui/outline-button";
import { Plus } from "lucide-react";
import { createCompletedGoal } from "../http/createcompleted-goal";

export function PendingGoals() {

const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60, // 60 seconds
  })

  if(!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    await createCompletedGoal(goalId)

    queryClient.invalidateQueries({ queryKey: ['summary']}) // Avoid re-fetching all the data
    queryClient.invalidateQueries({ queryKey: ['pending-goals']}) // Avoid re-fetching all the data
  }

  return (
    <div className="flex flex-wrap gap-3">
        {data.map(goal => {
          return (
            <OutlineButton
              key={goal.id}
              disabled={goal.completedGoalsCount >= goal.desiredWeeklyFrequency}
              onClick={() => handleCompleteGoal(goal.id)}
            >
              <Plus className="size-4 text-zinc-600"/>
              {goal.title}
            </OutlineButton>
          )
        })}

      </div>
  )
}