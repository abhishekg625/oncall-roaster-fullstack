import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

type ColorTheme = "orange" | "blue";
type Mode = "light" | "dark";

type ThemeContextType = {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem("colorTheme") as ColorTheme) || "orange";
  });

  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem("mode") as Mode) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("theme-blue", "dark");

    if (colorTheme === "blue") {
      root.classList.add("theme-blue");
    }

    if (mode === "dark") {
      root.classList.add("dark");
    }

    localStorage.setItem("colorTheme", colorTheme);
    localStorage.setItem("mode", mode);
  }, [colorTheme, mode]);

  const setColorTheme = (theme: ColorTheme) => setColorThemeState(theme);
  const setMode = (m: Mode) => setModeState(m);
  const toggleMode = () => setModeState((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ colorTheme, mode, setColorTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};
