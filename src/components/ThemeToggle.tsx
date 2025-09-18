"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="bg-slate-900/10 text-slate-900 hover:bg-slate-900/20 border border-slate-900/20 dark:bg-white/20 dark:text-white dark:hover:bg-white/40 dark:border-white/30 backdrop-blur-lg rounded-full"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}