import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("lumina-chat-theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("lumina-chat-theme", theme);
    set({ theme });
  },
}));
