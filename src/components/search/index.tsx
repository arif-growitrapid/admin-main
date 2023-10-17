"use client"

import React from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { useSession } from 'next-auth/react'
import { menuFunc } from '../appbar'
import Link from 'next/link'
import { Link2Icon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'

type Props = {
    children?: React.ReactNode
}

export default function SearchDialog({ children }: Props) {
    const [open, setOpen] = React.useState(false);
    const { data: session, status } = useSession();
    const pathname = usePathname();

    const menu = menuFunc(session?.user);

    React.useEffect(() => {
        setOpen(false);
    }, [pathname]);

    React.useEffect(() => {
        function onBackPressed(e: PopStateEvent) {
            if (open) {
                e.preventDefault();
                setOpen(false);
            }
        }

        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        window.addEventListener("popstate", onBackPressed)
        return () => {
            document.removeEventListener("keydown", down);
            window.removeEventListener("popstate", onBackPressed)
        }
    }, [])

    return (
        <>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        // @ts-ignore
                        onClick: () => setOpen(true),
                    })
                }
                return child
            })}

            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                contentProps={{
                    className: `h-full max-h-full max-w-full
                        sm:max-h-[calc(100%-4rem)] sm:max-w-[calc(100%-4rem)]
                        md:h-auto md:max-h-auto md:max-w-[40rem] md:w-full overflow-hidden p-0`
                }}
            >
                <CommandInput placeholder="Type a command or search..." />

                <CommandList className='flex-grow max-h-full'>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup heading="Navigation">
                        {menu.map((item, index) => {
                            if (!item) return null;

                            if (!item.options || item.options.length < 0) return <Link href={`${item.path}`} key={index}>
                                <CommandItem className='flex flex-row items-center gap-4 cursor-pointer'>
                                    <span>
                                        <Link2Icon />
                                    </span>
                                    <span>{item.name}</span>
                                </CommandItem>
                            </Link>

                            return item.options.map((option, index) => {
                                if (!option) return null;

                                return <Link href={`${item.path}${option.path}`} key={index}>
                                    <CommandItem className='flex flex-row items-center gap-4 cursor-pointer'>
                                        <span>
                                            <Link2Icon />
                                        </span>
                                        <span>{option.name}</span>
                                        <span className='text-muted-foreground text-sm border rounded-md px-2 bg-background'>From: {item.name}</span>
                                    </CommandItem>
                                </Link>
                            })
                        })}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}