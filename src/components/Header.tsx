import React, { useState } from "react";
import { Settings, User, Bookmark, Wallet, LogOut, Sparkle, LogIn, Info, Moon, Sun, Monitor } from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useSound } from "@/context/SoundContext";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RegisterBenefitsDialog from "./RegisterBenefitsDialog";
import { benefitContexts } from "@/config/accountBenefits";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { logout, user, isGuestMode } = useAuth();
  const { theme, setTheme } = useTheme();
  const { playSound } = useSound();
  const navigate = useNavigate();
  const [showGuestProfileDialog, setShowGuestProfileDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  const handleLogout = () => {
    playSound("click");
    if (isGuestMode) {
      // If in guest mode, show the register benefits dialog
      setShowRegisterDialog(true);
    } else {
      logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/landing");
    }
  };

  const handleProfileClick = () => {
    playSound("click");
    if (isGuestMode) {
      setShowGuestProfileDialog(true);
    } else {
      navigate("/profile");
    }
  };

  const handleThemeChange = (value: string) => {
    if (value === "light" || value === "dark" || value === "system") {
      setTheme(value);
      playSound("click");
    }
  };

  return (
    <>
      <header className={cn("py-4 px-5 mb-6 flex items-center justify-between animate-slide-down", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-full glass-morphism hover:bg-white/10 transition-all duration-300"
              aria-label="User profile"
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-5 h-5 text-foreground" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild onClick={handleProfileClick}>
              <div className="flex items-center cursor-pointer">
                <div className="flex items-center space-x-2 w-full">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span>{isGuestMode ? "Guest Mode" : (user?.name || "Your Profile")}</span>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            
            {/* Theme toggle in dropdown menu */}
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
              <DropdownMenuRadioItem value="light" className="flex items-center cursor-pointer">
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="flex items-center cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="flex items-center cursor-pointer">
                <Monitor className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/bookmarks" className="flex items-center cursor-pointer">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Bookmarks</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/wallet" className="flex items-center cursor-pointer">
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet</span>
                <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className={isGuestMode ? "" : "text-destructive focus:text-destructive"}
            >
              {isGuestMode ? (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Log In</span>
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 flex justify-center">
          <Logo />
        </div>

        <Link
          to="/insights"
          className="w-10 h-10 flex items-center justify-center rounded-full glass-morphism hover:bg-white/10 transition-all duration-300"
          aria-label="Insights"
          onClick={() => playSound("click")}
        >
          <Sparkle className="w-5 h-5 text-foreground" />
        </Link>
      </header>

      {/* Register Dialog for Log In button */}
      <RegisterBenefitsDialog
        open={showRegisterDialog}
        onOpenChange={setShowRegisterDialog}
        title="Create an Account"
        description={benefitContexts.profile}
        primaryActionLabel="Create Account"
        secondaryActionLabel="Continue with Guest Mode"
        showMigrationInfo={true}
      />

      {/* Guest Profile Dialog */}
      <RegisterBenefitsDialog
        open={showGuestProfileDialog}
        onOpenChange={setShowGuestProfileDialog}
        title="Create an Account"
        description={benefitContexts.profile}
        primaryActionLabel="Create Account"
        secondaryActionLabel="Stay in Guest Mode"
        showMigrationInfo={true}
      />
    </>
  );
};

export default Header;
