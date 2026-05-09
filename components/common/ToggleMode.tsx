"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ToggleMode = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="border-white/20 bg-background/50 backdrop-blur-sm">
          <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card">
        <DropdownMenuItem className="cursor-pointer gap-2 text-sm" onClick={() => setTheme("light")}>
          <Sun size={14} /> Light
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 text-sm" onClick={() => setTheme("dark")}>
          <Moon size={14} /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer gap-2 text-sm" onClick={() => setTheme("system")}>
          <Monitor size={14} /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleMode;
