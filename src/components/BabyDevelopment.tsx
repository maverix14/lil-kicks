
import React from "react";
import { cn } from "@/lib/utils";
import { Baby } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface BabyDevelopmentProps {
  className?: string;
}

const BabyDevelopment: React.FC<BabyDevelopmentProps> = ({ className }) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className={cn("overflow-hidden bg-gradient-to-br from-baby-50 to-baby-100/80 dark:from-baby-50 dark:to-black/20 shadow-sm", className)}>
      <CardHeader className="pb-1 p-3">
        <div className="flex items-center gap-2">
          <Baby className="h-4 w-4 text-baby-500 dark:text-baby-600" />
          <h3 className="text-sm font-medium">Baby Development</h3>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className={cn("flex", isMobile ? "flex-col gap-4" : "flex-row gap-6")}>
          {/* Left Section - Baby Image and Week 12 */}
          <div className={cn("flex flex-col items-center justify-center", isMobile ? "w-full" : "w-1/2")}>
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-baby-300 dark:border-baby-500 shadow-sm mb-3">
              <img 
                src="/lovable-uploads/f3f57254-c181-4fa8-89f9-05ad70fa83bc.png" 
                alt="Baby at week 12" 
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="font-medium text-[15px] mb-1.5">Week 12</h4>
            <p className="text-[12px] text-gray-700 dark:text-gray-300 leading-tight text-center max-w-[90%]">
              Your baby's lungs are forming air sacs, eyes shifting to the front, and ears moving to the sides!
            </p>
          </div>
          
          {/* Right Section - 4 Stacked Widgets */}
          <div className={cn("grid grid-cols-2 gap-2", isMobile ? "w-full" : "w-1/2")}>
            {/* Length Widget */}
            <div className="bg-white/90 dark:bg-white/10 rounded-lg p-2 shadow-sm">
              <div className="text-center text-[11px] text-baby-600 dark:text-baby-500">LENGTH</div>
              <div className="text-center font-semibold text-[16px] mt-1.5">2.5 inches</div>
            </div>
            
            {/* Weight Widget */}
            <div className="bg-white/90 dark:bg-white/10 rounded-lg p-2 shadow-sm">
              <div className="text-center text-[11px] text-baby-600 dark:text-baby-500">WEIGHT</div>
              <div className="text-center font-semibold text-[16px] mt-1.5">0.5 oz</div>
            </div>
            
            {/* Development Widget (from Pregnancy Journey) */}
            <div className="bg-white/90 dark:bg-white/10 rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-center mt-1">
                <div className="bg-pink-100 dark:bg-pink-900/50 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-pink-600 dark:text-pink-300 font-bold text-[12px]">W12</span>
                </div>
              </div>
              <div className="text-center text-[11px] w-full mt-1.5">
                <p className="text-gray-500 dark:text-gray-400">Your baby is developing</p>
                <p className="text-pink-500 dark:text-pink-300 font-bold mt-0.5">LIMBS & ORGANS</p>
              </div>
            </div>
            
            {/* Baby Size Widget (from Pregnancy Journey) */}
            <div className="bg-white/90 dark:bg-white/10 rounded-lg p-2 shadow-sm">
              <div className="flex items-center justify-center my-1.5">
                <img 
                  src="/lovable-uploads/260a680b-22fa-4bf9-ab5c-2b844dd234fc.png" 
                  alt="Apple for size comparison" 
                  className="h-8 object-contain"
                />
              </div>
              <div className="text-center text-[11px] w-full">
                <p className="text-gray-500 dark:text-gray-400">Your baby is now the size of</p>
                <p className="text-green-500 dark:text-green-300 font-bold mt-0.5">AN APPLE</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BabyDevelopment;