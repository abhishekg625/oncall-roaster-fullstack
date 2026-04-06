import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type Props = {
  onMenuClick: () => void;
};

const Header = ({ onMenuClick }: Props) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden cursor-pointer"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-lg font-semibold text-foreground">{formattedDate}</h1>

      <div className="lg:hidden w-10" />
    </header>
  );
};

export default Header;
