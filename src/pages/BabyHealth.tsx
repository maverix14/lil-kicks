import React from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import { featureFlags } from "@/config/features";
import { cn } from "@/lib/utils";
import BabyDevelopment from "@/components/BabyDevelopment";
import MomsHealth from "@/components/MomsHealth";
import PregnancyJourney from "@/components/PregnancyJourney";
import UpcomingReminders from "@/components/UpcomingReminders";
import DailyTips from "@/components/DailyTips";
import { useIsMobile } from "@/hooks/use-mobile";

const BabyHealth = () => {
  const isMobile = useIsMobile();
  
  if (featureFlags.babyHealthEnabled) {
    return (
      <div className="page-container bg-gradient-to-b from-red-50 to-pink-50/70 dark:from-red-950/30 dark:to-pink-950/20">
        <Header />
        <main className="max-w-6xl mx-auto">
          <h1 className="heading-1 my-4 animate-slide-down">Health and Updates</h1>
          
          <div className="space-y-5">
            <div className={cn("grid gap-5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
              <BabyDevelopment className="transition-shadow duration-300" />
              <MomsHealth className="transition-shadow duration-300" />
            </div>
            
            <PregnancyJourney className="w-full transition-shadow duration-300" />
            
            <div className={cn("grid gap-5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
              <UpcomingReminders className="transition-shadow duration-300" />
              <DailyTips className="transition-shadow duration-300" />
            </div>
          </div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="page-container bg-red-100 dark:bg-red-950/30">
      <Header />
      
      <main>
        <h1 className="heading-1 mb-6 animate-slide-down">Baby Health</h1>
        
        <div className="section-container animate-fade-in">
          <h2 className="section-title">COMING SOON</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="card-container neo-shadow p-8 text-center animate-fade-in">
          <h3 className="heading-2 mb-4">Pregnancy Tracking & Baby Health</h3>
          <p className="text-muted-foreground mb-6">
            This feature is coming soon! You'll be able to track your pregnancy journey, including:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Baby Development</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Week-by-week size visualization</li>
                <li>• Development milestones</li>
                <li>• Fetal health articles</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Mother's Health</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Symptom tracking</li>
                <li>• Weight monitoring</li>
                <li>• Appointment reminders</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default BabyHealth;
