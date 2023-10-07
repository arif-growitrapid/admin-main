"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppDispatch } from "@/redux/store"
import { setTheme } from "@/redux/slices/ui"

export default function ToggleThemeButton({ }: {}) {
    const ui_dispatch = useAppDispatch();

    function setThemefunc(theme: string) {
        ui_dispatch({
            type: setTheme.type,
            payload: theme
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setThemefunc("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setThemefunc("dark")}>
                    Dark
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}