
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, Heart, Clock, Activity, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";

interface PregnancyJourneyProps {
  className?: string;
}

const PregnancyJourney: React.FC<PregnancyJourneyProps> = ({ className }) => {
  const [kickCount, setKickCount] = useState(12);
  const [checklistCompleted, setChecklistCompleted] = useState(2);
  const isMobile = useIsMobile();
  
  const toggleChecklistItem = () => {
    if (checklistCompleted < 4) {
      setChecklistCompleted(prev => prev + 1);
    } else {
      setChecklistCompleted(0);
    }
  };
  
  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-100/60 dark:from-indigo-900/30 dark:to-purple-900/20 shadow-sm", className)}>
      <CardHeader className="pb-1 p-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          <h3 className="text-sm font-medium">Pregnancy Journey</h3>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className={cn("grid gap-3", isMobile ? "grid-cols-2" : "grid-cols-4")}>
          <div className="rounded-xl bg-white/90 dark:bg-white/10 shadow-sm p-2.5 flex flex-col items-center h-full">
            <div className="flex items-center gap-1 text-center">
              <Clock className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
              <div className="text-[12px] font-medium">Due Date</div>
            </div>
            <div className="mt-1 flex-grow flex items-center justify-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full w-12 h-12 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[11px] text-indigo-400 dark:text-indigo-300">OCT</div>
                  <div className="text-indigo-600 dark:text-indigo-300 font-bold text-sm">15</div>
                </div>
              </div>
            </div>
            <div className="w-full text-center">
              <div className="text-[11px] text-indigo-500 dark:text-indigo-400 font-medium">28 weeks to go</div>
              <div className="w-full bg-indigo-100 dark:bg-indigo-900/50 h-1 rounded-full mt-1 overflow-hidden">
                <div className="bg-indigo-400 dark:bg-indigo-500 h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
          </div>
          
          {/* New Widget: Trimester Progress */}
          <div className="rounded-xl bg-white/90 dark:bg-white/10 shadow-sm p-2.5 flex flex-col h-full">
            <div className="flex items-center justify-center gap-1 text-center">
              <Activity className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400" />
              <div className="text-[12px] font-medium">Trimester Progress</div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="flex gap-2 w-full justify-between mb-2 px-1">
                <div className="flex flex-col items-center">
                  <div className="bg-purple-100 dark:bg-purple-900/50 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-300 text-[10px] font-bold">1st</span>
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">Complete</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-purple-200 dark:bg-purple-800/50 w-9 h-9 rounded-full flex items-center justify-center border-2 border-purple-400 dark:border-purple-600">
                    <span className="text-purple-700 dark:text-purple-200 text-[10px] font-bold">2nd</span>
                  </div>
                  <span className="text-[9px] text-purple-500 dark:text-purple-400 font-medium mt-0.5">Current</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white/50 dark:bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-500 text-[10px]">3rd</span>
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5">Upcoming</span>
                </div>
              </div>
              <div className="w-full px-1">
                <Progress value={42} className="h-1.5 bg-purple-100 dark:bg-purple-900/30" indicatorColor="bg-purple-500 dark:bg-purple-400" />
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">Week 12</span>
                  <span className="text-[9px] text-purple-500 dark:text-purple-400 font-medium">42% complete</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* New Widget: Weekly To-Do */}
          <div className="rounded-xl bg-white/90 dark:bg-white/10 shadow-sm p-2.5 flex flex-col h-full">
            <div className="flex items-center gap-1 text-center justify-center">
              <Check className="h-3.5 w-3.5 text-teal-500 dark:text-teal-400" />
              <div className="text-[12px] font-medium">Weekly To-Do</div>
            </div>
            <div className="flex-grow flex flex-col justify-center space-y-1.5 mt-1">
              {[
                { text: "Prenatal vitamin", done: true },
                { text: "Schedule ultrasound", done: true },
                { text: "Drink 8 cups of water", done: false },
                { text: "30 min light exercise", done: false }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center gap-1.5 px-1 py-0.5 rounded-sm cursor-pointer transition-colors",
                    item.done || index < checklistCompleted ? 
                      "bg-teal-50 dark:bg-teal-900/20" : 
                      "bg-transparent hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                  onClick={toggleChecklistItem}
                >
                  <div className={cn(
                    "w-3.5 h-3.5 rounded-sm flex items-center justify-center border transition-colors",
                    item.done || index < checklistCompleted ? 
                      "bg-teal-500 dark:bg-teal-600 border-teal-600" : 
                      "border-gray-300 dark:border-gray-600"
                  )}>
                    {(item.done || index < checklistCompleted) && (
                      <Check className="h-2.5 w-2.5 text-white" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[11px]",
                    item.done || index < checklistCompleted ? 
                      "text-teal-700 dark:text-teal-300 line-through" : 
                      "text-gray-700 dark:text-gray-300"
                  )}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <div className="text-[10px] text-teal-600 dark:text-teal-400">
                {checklistCompleted}/4 tasks completed
              </div>
            </div>
          </div>
          
          <div className="rounded-xl bg-white/90 dark:bg-white/10 shadow-sm p-2.5 flex flex-col h-full">
            <div className="flex justify-center items-center mb-1">
              <div className="flex items-center gap-1">
                <Heart className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
                <span className="text-[12px] font-medium">Kick Counter</span>
              </div>
            </div>
            <div className="flex-grow flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-red-500 dark:text-red-400">{kickCount}</div>
            </div>
            <div className="w-full text-center">
              <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">kicks recorded today</div>
              <Button 
                className="w-full bg-red-100 hover:bg-red-200 text-red-500 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 text-[12px] h-6"
                variant="ghost"
                onClick={() => setKickCount(kickCount + 1)}
              >
                Record Kick
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PregnancyJourney;