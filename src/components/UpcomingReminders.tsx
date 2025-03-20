import React from "react";
import { cn } from "@/lib/utils";
import { Bell, CalendarCheck, Dumbbell, Stethoscope } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
  icon: 'calendar' | 'exercise' | 'ultrasound';
}

interface UpcomingRemindersProps {
  className?: string;
}

const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  const reminders: Reminder[] = [
    {
      id: '1',
      title: 'Prenatal checkup with Dr. Smith',
      date: 'Tomorrow',
      time: '10:00 AM',
      color: 'bg-blue-100 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300',
      icon: 'calendar'
    },
    {
      id: '2',
      title: 'Pregnancy yoga class',
      date: 'Mar 10',
      time: '5:00 PM',
      color: 'bg-pink-100 text-pink-500 dark:bg-pink-900/50 dark:text-pink-300',
      icon: 'exercise'
    },
    {
      id: '3',
      title: 'Ultrasound appointment',
      date: 'Mar 15',
      time: '2:30 PM',
      color: 'bg-purple-100 text-purple-500 dark:bg-purple-900/50 dark:text-purple-300',
      icon: 'ultrasound'
    }
  ];

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'calendar':
        return <CalendarCheck className="h-2.5 w-2.5" />;
      case 'exercise':
        return <Dumbbell className="h-2.5 w-2.5" />;
      case 'ultrasound':
        return <Stethoscope className="h-2.5 w-2.5" />;
      default:
        return <CalendarCheck className="h-2.5 w-2.5" />;
    }
  };

  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-reminder-50 to-reminder-100/60 shadow-card h-full", className)}>
      <CardHeader className="pb-1 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-reminder-500" />
            <h3 className="text-xs font-medium">Upcoming Reminders</h3>
          </div>
          <a href="#" className="text-[9px] text-reminder-500 hover:underline">View all</a>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className={cn("space-y-1.5", isMobile && "pt-1")}>
          {reminders.map(reminder => (
            <div key={reminder.id} className="rounded-lg bg-white/90 dark:bg-white/10 shadow-sm p-2 hover:bg-white transition-colors dark:hover:bg-white/20">
              <div className="flex gap-2 items-start">
                <div className={cn("rounded-md p-0.5", reminder.color)}>
                  {getIcon(reminder.icon)}
                </div>
                <div className="flex-1">
                  <div className="compact-card-label">
                    {reminder.date}, {reminder.time}
                  </div>
                  <div className="compact-card-title">{reminder.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
