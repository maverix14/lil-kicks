import React, { useState } from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import { featureFlags } from "@/config/features";
import { Button } from "@/components/ui/button";
import { Sparkle } from "lucide-react";
import RegisterBenefitsDialog from "@/components/RegisterBenefitsDialog";
import { benefitContexts } from "@/config/accountBenefits";
import { useAuth } from "@/context/AuthContext";

const Wallet = () => {
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const { isGuestMode } = useAuth();

  if (featureFlags.walletEnabled) {
    // Render actual Wallet component here
    return (
      <div className="min-h-screen pb-24 px-4">
        <Header />
        <main>
          <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Wallet</h1>
          <div>{/* Actual Wallet Content */}</div>
        </main>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-4">
      <Header />
      
      <main>
        <h1 className="text-2xl font-medium tracking-tight mb-6 animate-slide-down">Wallet</h1>
        
        <div className="space-y-1 mb-8 animate-fade-in">
          <h2 className="text-sm text-muted-foreground font-medium">COMING SOON</h2>
          <div className="h-px bg-border w-full"></div>
        </div>
        
        <div className="rounded-xl neo-shadow p-8 text-center animate-fade-in">
          <h3 className="text-xl font-medium mb-4">Premium Features</h3>
          <p className="text-muted-foreground mb-6">
            The wallet feature is coming soon! You'll be able to unlock premium features:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-8">
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Advanced Journaling</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Custom themes</li>
                <li>• Journal templates</li>
                <li>• Advanced formatting</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Exclusive Content</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Premium articles</li>
                <li>• Expert resources</li>
                <li>• Special guides</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg glass-morphism">
              <h4 className="font-medium mb-2">Enhanced Sharing</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Multiple groups</li>
                <li>• Advanced privacy</li>
                <li>• Custom sharing options</li>
              </ul>
            </div>
          </div>
          
          {isGuestMode && (
            <Button
              onClick={() => setShowRegisterDialog(true)}
              className="rounded-full px-6"
              size="lg"
            >
              <Sparkle className="mr-2 h-4 w-4" />
              Discover All You Get with an Account
            </Button>
          )}
        </div>
      </main>
      
      <RegisterBenefitsDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        title="Premium Features Await"
        description={benefitContexts.comingSoon}
        primaryActionLabel="Create Account Now"
        secondaryActionLabel="Maybe Later"
        showMigrationInfo={true}
      />
      
      <BottomBar />
    </div>
  );
};

export default Wallet;
