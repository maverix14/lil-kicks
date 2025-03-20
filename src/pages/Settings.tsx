import React from "react";
import Header from "@/components/Header";
import BottomBar from "@/components/BottomBar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";
import { useFontSize } from "@/context/FontSizeContext";
import { useSound } from "@/context/SoundContext";
import { FileText, Info, Sun, Monitor, Moon, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();
  const { soundEnabled, toggleSound, playSound } = useSound();

  const handleFontSizeChange = (size: string) => {
    if (size && (size === "small" || size === "medium" || size === "large")) {
      setFontSize(size);
      playSound("click");
    }
  };

  const handleThemeChange = (newTheme: string) => {
    if (newTheme && (newTheme === "light" || newTheme === "dark" || newTheme === "system")) {
      setTheme(newTheme);
      playSound("click");
    }
  };

  return (
    <div className="page-container">
      <Header />
      
      <main>
        <h1 className="heading-1 mb-6 animate-slide-down">Settings</h1>
        
        <div className="space-y-8 animate-fade-in">
          {/* Appearance Settings */}
          <div className="section-container">
            <div className="mb-4">
              <h2 className="section-title">APPEARANCE</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <label className="text-sm font-medium">Theme</label>
                </div>
                <ToggleGroup 
                  type="single" 
                  value={theme}
                  onValueChange={handleThemeChange}
                  className="grid grid-cols-3 gap-2"
                >
                  <ToggleGroupItem value="light" className="flex items-center justify-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" className="flex items-center justify-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="system" className="flex items-center justify-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span>System</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <label className="text-sm font-medium">Font Size</label>
                </div>
                <ToggleGroup 
                  type="single" 
                  value={fontSize}
                  onValueChange={handleFontSizeChange} 
                  className="grid grid-cols-3 gap-2"
                >
                  <ToggleGroupItem value="small" className="flex items-center justify-center">
                    <span className="text-xs">Small</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="medium" className="flex items-center justify-center">
                    <span>Medium</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="large" className="flex items-center justify-center">
                    <span className="text-lg">Large</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              <div className="opacity-50">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex items-center justify-center">
                        <span className="text-xs font-semibold">EN</span>
                      </div>
                      <label className="text-sm font-medium">
                        Language
                      </label>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications Settings */}
          <div className="section-container">
            <div className="mb-4">
              <h2 className="section-title">NOTIFICATIONS</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    <label htmlFor="sound" className="text-sm font-medium">
                      Sound Effects
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Play sounds for app interactions
                  </p>
                </div>
                <Switch 
                  id="sound" 
                  checked={soundEnabled}
                  onCheckedChange={() => {
                    toggleSound();
                    playSound("click");
                  }}
                />
              </div>
            </div>
          </div>
          
          {/* About & Legal */}
          <div className="section-container">
            <div className="mb-4">
              <h2 className="section-title">ABOUT & LEGAL</h2>
              <div className="section-divider"></div>
            </div>
            
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => playSound("click")}
              >
                <Info className="mr-2 h-4 w-4" />
                About Pregnancy Journal
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                size="sm"
                onClick={() => playSound("click")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Terms & Privacy Policy
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <BottomBar />
    </div>
  );
};

export default Settings;
