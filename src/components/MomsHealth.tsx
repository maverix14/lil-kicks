
import React from "react";
import { cn } from "@/lib/utils";
import { Heart, Activity, Apple, Zap, Droplets, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

interface MomsHealthProps {
  className?: string;
}

const MomsHealth: React.FC<MomsHealthProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-health-50 to-health-100/80 shadow-card h-full", className)}>
      <CardHeader className="pb-1 p-3">
        <div className="flex items-center gap-2">
          <Heart className="h-3.5 w-3.5 text-health-500" />
          <h3 className="text-xs font-medium">Mom's Health</h3>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-1">
        <div className={cn(
          "grid gap-3 h-full", 
          isMobile ? "grid-cols-2" : "grid-cols-2"
        )}>
          <div className="rounded-xl bg-white/95 dark:bg-white/10 shadow-sm p-2 flex flex-col h-full">
            <div className="text-center mb-1 flex items-center justify-between">
              <span className="text-[12px] font-medium text-health-600">Weight Tracking</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" title="Add weight data">
                <Plus className="h-3 w-3 text-health-500" />
              </Button>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-health-400" />
                <span className="text-[11px] text-muted-foreground">This Week</span>
              </div>
              <div className="flex items-center">
                <span className="text-health-500 text-xs font-bold">+</span>
                <span className="text-health-500 text-sm font-bold">0.5</span>
                <span className="text-[11px] text-muted-foreground ml-0.5">kg</span>
              </div>
            </div>
            <div className="w-full mt-1.5 flex-grow flex flex-col justify-center">
              <div className="h-1.5 w-full bg-health-100 dark:bg-health-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-health-400 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-[11px] block mt-0.5 text-center text-muted-foreground">Healthy weight gain on track</span>
            </div>
          </div>
          
          <div className="rounded-xl bg-white/95 dark:bg-white/10 shadow-sm p-2 flex flex-col h-full">
            <div className="text-center mb-1 flex items-center justify-between">
              <span className="text-[12px] font-medium text-health-600">Daily Nutrition</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" title="Add nutrition data">
                <Plus className="h-3 w-3 text-health-500" />
              </Button>
            </div>
            <div className="space-y-1.5 flex-grow flex flex-col justify-center">
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-1">
                    <Apple className="h-2.5 w-2.5 text-green-500" />
                    <span className="text-[11px] text-muted-foreground">Protein</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-1 bg-green-100 dark:bg-green-900/30" indicatorColor="bg-green-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-1">
                    <Droplets className="h-2.5 w-2.5 text-blue-500" />
                    <span className="text-[11px] text-muted-foreground">Hydration</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-1 bg-blue-100 dark:bg-blue-900/30" indicatorColor="bg-blue-500" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-1">
                    <Zap className="h-2.5 w-2.5 text-amber-500" />
                    <span className="text-[11px] text-muted-foreground">Vitamins</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-1 bg-amber-100 dark:bg-amber-900/30" indicatorColor="bg-amber-500" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MomsHealth;