import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import SettingsDialog from "./SettingsDialog";
import { Settings, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Members", path: "/members" },
  { label: "Teams", path: "/teams" },
  { label: "Availability", path: "/availability" },
  { label: "Create Roster", path: "/create-roster" },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

const Sidebar = ({ open, onClose }: Props) => {
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <aside
        className={`w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 z-50 transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-xl font-bold border-b border-sidebar-border flex items-center justify-between">
          <span>OnCall Roster</span>
          <button
            onClick={onClose}
            className="lg:hidden text-sidebar-foreground hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-colors text-sm ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer mb-3"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/50 truncate">@{user?.userId}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="w-full cursor-pointer"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </aside>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
};

export default Sidebar;
