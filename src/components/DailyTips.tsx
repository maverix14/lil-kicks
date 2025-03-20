import React from "react";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface Tip {
  id: string;
  title: string;
  description: string;
}

interface DailyTipsProps {
  className?: string;
}

const DailyTips: React.FC<DailyTipsProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  const tips: Tip[] = [
    {
      id: '1',
      title: 'Healthy eating habits',
      description: 'Focus on nutrient-rich foods like fruits, vegetables, lean proteins, and whole grains.'
    },
    {
      id: '2',
      title: 'Safe exercises',
      description: 'Swimming, walking, and prenatal yoga are excellent low-impact options.'
    },
    {
      id: '3',
      title: 'Managing back pain',
      description: 'Maintain good posture and consider using a pregnancy support belt.'
    }
  ];

  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-tip-50 to-tip-100/60 dark:from-tip-50 dark:to-black/20 shadow-card h-full", className)}>
      <CardHeader className="pb-1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-tip-500 dark:text-tip-700" />
            <h3 className="text-sm font-medium">Daily Tips</h3>
          </div>
          <a href="#" className="compact-card-label hover:underline">View all</a>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className={cn("space-y-1.5", isMobile && "pt-1")}>
          {tips.map(tip => (
            <div 
              key={tip.id} 
              className="border-b border-tip-100/50 dark:border-tip-700/30 pb-1.5 last:border-b-0 last:pb-0 hover:bg-white/40 dark:hover:bg-white/10 p-1 rounded-sm transition-colors"
            >
              <h4 className="compact-card-title text-tip-700 dark:text-tip-500">{tip.title}</h4>
              <p className="compact-card-content text-gray-600 dark:text-gray-300">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTips;
