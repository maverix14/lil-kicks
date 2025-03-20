import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, CheckCircle2 } from "lucide-react";
import { accountBenefits } from "@/config/accountBenefits";

interface RegisterBenefitsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  showMigrationInfo?: boolean;
}

const RegisterBenefitsDialog: React.FC<RegisterBenefitsDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  primaryActionLabel = "Create Account",
  secondaryActionLabel = "Stay in Guest Mode",
  onPrimaryAction,
  onSecondaryAction,
  showMigrationInfo = false,
}) => {
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onOpenChange(false);
      navigate("/auth");
    }
  };

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="space-y-3">
            <h3 className="font-medium">Benefits of Creating an Account:</h3>
            <ul className="space-y-2">
              {accountBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {showMigrationInfo && (
            <div className="space-y-2 bg-muted/50 p-3 rounded-md">
              <h3 className="font-medium text-sm">Your Journal Entries Are Safe:</h3>
              <p className="text-sm text-muted-foreground">
                When you create an account, all your guest mode journal entries will be automatically transferred to your new account.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleSecondaryAction}
            className="sm:flex-1"
          >
            {secondaryActionLabel}
          </Button>
          <Button 
            onClick={handlePrimaryAction}
            className="sm:flex-1"
          >
            {primaryActionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterBenefitsDialog;
