import { z } from 'zod'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { createGoal } from '../http/create-goal'

import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from './ui/radio-group'
import { DialogContent, DialogTitle, DialogClose, DialogDescription } from './ui/dialog'

const createGoalForm = z.object({
  title: z.string().min(1, 'Please enter a title'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
})

type CreateGoalForm = z.infer<typeof createGoalForm>

export function CreateGoal() {

  const queryClient = useQueryClient()

  const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
    resolver: zodResolver(createGoalForm)
  })

  async function handleCreateGoal(data: CreateGoalForm) {
    await createGoal({
      title: data.title,
      desiredWeeklyFrequency: data.desiredWeeklyFrequency,
    })

    queryClient.invalidateQueries({ queryKey: ['summary'] })
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

    reset()
  }

  return (
    <DialogContent>
        <div className="flex flex-col gap-6 h-full ">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <DialogTitle> Register goal </DialogTitle>
              <DialogClose>
                <X className="size-5 text-zinc-600"/>
              </DialogClose>
            </div>

            <DialogDescription>
              Add activities that make you feel good and which you want to continue practicing every week.
            </DialogDescription>
          </div>

          <form onSubmit={handleSubmit(handleCreateGoal)} className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title"> Which activity? </Label>
                <Input
                  id="title"
                  autoFocus
                  placeholder='go to the gym, meditate, etc...'
                  {...register('title')}
                />

                {formState.errors.title && (
                  <p className="text-pink-500 text-sm">{formState.errors.title.message}</p>
                )}

              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title"> How many times per week? </Label>
                <Controller
                  control={control}
                  name="desiredWeeklyFrequency"
                  defaultValue={1}
                  render={({ field }) => {
                    return (
                      <RadioGroup onValueChange={field.onChange} value={String(field.value)}>
                        <RadioGroupItem value="1">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">1 time</span>
                          <span className="text-lg leading-none">🥱</span>
                        </RadioGroupItem>

                        <RadioGroupItem value="2">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">2 times</span>
                          <span className="text-lg leading-none">🙂</span>
                        </RadioGroupItem>

                        <RadioGroupItem value="3">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">3 times</span>
                          <span className="text-lg leading-none">😎</span>
                        </RadioGroupItem>     

                        <RadioGroupItem value="4">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">4 times</span>
                          <span className="text-lg leading-none">😜</span>
                        </RadioGroupItem>

                        <RadioGroupItem value="5">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">5 times</span>
                          <span className="text-lg leading-none">🤯</span>
                        </RadioGroupItem>

                        <RadioGroupItem value="6">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">6 times</span>
                          <span className="text-lg leading-none">🔥</span>
                        </RadioGroupItem>

                        <RadioGroupItem value="7">
                          <RadioGroupIndicator/>                    
                          <span className="text-zinc-300 text-sm font-medium leading-none">7 times</span>
                          <span className="text-lg leading-none">🥱</span>
                        </RadioGroupItem> 

                      </RadioGroup>
                    )
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DialogClose asChild>
                <Button type="button" className="flex-1" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button className="flex-1">Save</Button>
            </div>
          </form>
        </div>
    </DialogContent>
  )
}