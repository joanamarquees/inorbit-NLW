import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DialogTrigger } from "./ui/dialog";
import { InOrbitIcon } from "./in-orbit-icon";
import { Progress, ProgressIndicator } from "./ui/progress-bar";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../http/get-summary";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { PendingGoals } from "./pending-goals";

dayjs.extend(isoWeek);

export function Summary() {

  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    staleTime: 1000 * 60, // 60 seconds
  })
  

  if(!data){
    return null
  }

  const firstDayOfWeek = dayjs().startOf('isoWeek').format('D MMM')
  const lastDayOfWeek = dayjs().endOf('isoWeek').format('D MMM')

  const completedPercentage = Math.round(data.completed * 100 / data.total)

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon/>
          
          <span className="text-lg font-semibold">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>

        <DialogTrigger asChild> 
          <Button size="sm">
            <Plus className="size-4"/>
            Register goal
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={8} max={15}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }}/>
        </Progress>

        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            You've completed <span className="text-zinc-100">{data?.completed}</span > {' '}
            out of <span className="text-zinc-100">{data?.total}</span> goals this week
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator/>

      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium"> Your week </h2>

        {Object.entries(data.goalsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const cleanDate = dayjs(date).format('D MMMM')

          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className="capitalize">{weekDay}</span>{' '}
                <span className="text-zinc-400 text-xs">({cleanDate})</span>
              </h3>

              <ul className="flex flex-col gap-3">
                {goals.map(goal => {
                  const time = dayjs(goal.completedAt).format('HH[h]mm')

                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-zinc-400 text-sm">
                        You have completed '
                        <span className="text-zinc-100">{goal.title}</span>' at {' '}
                        <span className="text-zinc-100">{time}</span>
                      </span>
                    </li>
                  )
                })}


              </ul>
            </div>
          )
        })}

      </div>

    </div>
  )
}