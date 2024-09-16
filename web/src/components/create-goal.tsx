import { X } from 'lucide-react'

import { Button } from './ui/button'
import { DialogContent, DialogTitle, DialogClose, DialogDescription } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from './ui/radio-group'

export function CreateGoal() {
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

          <form action="" className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title"> Which activity? </Label>
                <Input
                  id="title"
                  autoFocus
                  placeholder='go to the gym, meditate, etc...'
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="title"> How many times per week? </Label>
                <RadioGroup>
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