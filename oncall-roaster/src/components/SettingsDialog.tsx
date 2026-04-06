import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/context/ThemeContext";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SettingsDialog = ({ open, onOpenChange }: Props) => {
  const { colorTheme, mode, setColorTheme, toggleMode } = useTheme();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize the appearance of the application.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="flex items-center justify-between py-3">
          <Label htmlFor="dark-mode" className="text-sm font-medium">
            Dark Mode
          </Label>
          <Switch
            id="dark-mode"
            checked={mode === "dark"}
            onCheckedChange={toggleMode}
          />
        </div>

        <Separator />

        <div className="space-y-3 py-3">
          <Label className="text-sm font-medium">Color Theme</Label>
          <div className="flex gap-3">
            <button
              onClick={() => setColorTheme("orange")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors cursor-pointer ${
                colorTheme === "orange"
                  ? "border-[oklch(0.679_0.174_55.75)] bg-[oklch(0.679_0.174_55.75)]/10 text-[oklch(0.679_0.174_55.75)]"
                  : "border-border hover:bg-accent"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[oklch(0.679_0.174_55.75)]" />
              Orange
            </button>
            <button
              onClick={() => setColorTheme("blue")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors cursor-pointer ${
                colorTheme === "blue"
                  ? "border-[oklch(0.546_0.245_262.88)] bg-[oklch(0.546_0.245_262.88)]/10 text-[oklch(0.546_0.245_262.88)]"
                  : "border-border hover:bg-accent"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[oklch(0.546_0.245_262.88)]" />
              Blue
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
