"use client";

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';

import LightLogo from '@/assets/logo/logo_light.svg';
import DarkLogo from '@/assets/logo/logo_dark.svg';
import ToggleThemeButton from '@/components/ui/toggle-theme-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import config from '@/config';
import { BroadcastChannel } from '@/utils/web';
import { BellIcon, GearIcon, HamburgerMenuIcon, KeyboardIcon, PersonIcon } from '@radix-ui/react-icons';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '../ui/navigation-menu';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { FaArrowRightFromBracket, FaCreditCard } from 'react-icons/fa6';
import { AuthType } from '@/types/auth';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useToast } from '../ui/use-toast';
import CommingSoon from '../svg/comming_soon';
import SearchDialog from '../search';

export const menuFunc = (user?: AuthType) => [
    {
        name: "Membership",
        path: "/membership",
        description: "Manage members and roles",
        options: [
            (user?.permissions?.user_view || true) && {
                name: "Users",
                path: "/users",
                description: "Manage users and their roles"
            },
            (user?.permissions?.role_view || true) && {
                name: "Roles",
                path: "/roles",
                description: "Manage roles and their permissions"
            },
        ],
    },
    (user?.permissions?.blogs_add) && {
        name: "Blogs",
        path: "/blogs"
    },
    (user?.permissions?.view_reports) && {
        name: "Monitors",
        path: "/monitors",
        description: "View, manage and examine monitors data and reports. Well designed charts and graphs to help you understand your data.",
        options: [
            {
                name: "Analytics",
                path: "/analytics",
                description: "View analytics and reports"
            },
            (user?.permissions?.view_unlighthouse_reports || true) && {
                name: "Unlighthouse",
                path: "/unlighthouse",
                description: "View unlighthouse reports"
            }
        ]
    },
    (user?.permissions?.manage_database) && {
        name: "Database",
        path: "/database",
        description: "Manage database and collections as well as assets. Perform CRUD operations on database and collections.",
        options: [
            {
                name: "Sanity Studio",
                path: "/sanity-studio",
                description: "Manage Sanity Studio directly from here."
            },
            {
                name: "MongoDB",
                path: "/mongodb",
                description: "Manage MongoDB Data directly from here."
            },
            (user?.permissions?.manage_static_database) && {
                name: "Static DB",
                path: "/static",
                description: "Manage Static Database directly from here."
            },
            {
                name: "Assets",
                path: "/assets",
                description: "Manage, add, delete all Assets (Images, Gifs, Videos etc)."
            }
        ],
    },
    (user?.permissions?.view_settings) && {
        name: "Settings",
        path: "/settings",
        description: "Manage settings and configurations.",
    }
];

export default function AppBar({ theme }: { theme: string }) {
    const { data: session, status } = useSession();
    const [themeState, setThemeState] = useState(theme);
    const { toast } = useToast();

    const themeBroadcast = useRef(new BroadcastChannel<string>(config.theme_key, { should_receive_own_messages: true }));

    useEffect(() => {
        themeBroadcast.current.onReceiveMessage((event, data) => {
            if (event === "theme_toggle") {
                setThemeState(data.theme);
            }
        })
    }, []);

    return (
        <header className={`w-full h-auto border-b-2`}>
            <div className={`w-full h-auto py-2 px-6 flex flex-row items-center gap-2`}>

                <div className='lg:hidden'>
                    <SMNavigationMenuBar theme={themeState} />
                </div>

                <div className={`flex-1 flex-grow lg:hidden`}></div>

                <div className={`logo hidden sm:block`}>
                    <Link href={"/"}>
                        <Image
                            src={themeState === 'dark' ? DarkLogo : LightLogo}
                            alt='logo'
                            height={25}
                            width={170}
                            className='cursor-pointer object-contain'
                        />
                    </Link>
                </div>

                <div className={`menu w-auto h-full hidden lg:flex flex-row items-center gap-2`}>
                    <NavigationMenuBar />
                </div>

                <div className={`flex-1 flex-grow`}></div>

                <div className={`right w-auto h-full flex flex-row items-center gap-2`}>

                    <SearchDialog>
                        <Button
                            variant="outline"
                            size="default"
                            className={`overflow-hidden flex flex-row justify-between items-center gap-5
                            cursor-pointer [color:hsl(var(--foreground)/70%)]`}
                        >
                            <span>
                                Search...
                            </span>
                            <span className='border px-1 bg-accent rounded-sm align-middle'>
                                <span className='text-sm'>⌘</span>
                                <span className='text-xs'>K</span>
                            </span>
                        </Button>
                    </SearchDialog>

                    <Button variant="outline" size="icon" className='overflow-hidden aspect-square' onClick={e => {
                        toast({
                            title: "Coming Soon!",
                            description: "Notifications is not available yet.",
                            variant: "default",
                            duration: 5000,
                        });
                    }}>
                        <BellIcon className={`h-[1.2em] w-[1.2em] rounded-none`} />
                    </Button>

                    <ToggleThemeButton />

                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className='overflow-hidden aspect-square'>
                                    <Avatar className={`h-full w-full rounded-none`}>
                                        <AvatarImage
                                            src={session?.user.image || ""}
                                            alt={session?.user.name || ""}
                                            referrerPolicy='no-referrer'
                                        />
                                        <AvatarFallback className={`h-full w-full rounded-none`}>{session?.user.name?.split(" ").map(e => e.charAt(0)).join("")}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className='w-56'>
                                <DropdownMenuLabel className='text-muted-foreground'>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuGroup>
                                    <Link href="/profile" passHref>
                                        <DropdownMenuItem>
                                            Profile
                                            <DropdownMenuShortcut><PersonIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem onClick={e => {
                                        toast({
                                            title: "Coming Soon!",
                                            description: "Billing is not available yet.",
                                            variant: "default",
                                            duration: 5000,
                                        });
                                    }}>
                                        Billing
                                        <DropdownMenuShortcut><FaCreditCard /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <Link href="/settings" passHref>
                                        <DropdownMenuItem>
                                            Settings
                                            <DropdownMenuShortcut><GearIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>
                                            Keyboard shortcuts
                                            <DropdownMenuShortcut><KeyboardIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={e => {
                                        signOut();
                                    }}>
                                        Log out
                                        <DropdownMenuShortcut>
                                            <FaArrowRightFromBracket />
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>

                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className="w-[calc(100%-2rem)] max-w-[800px] h-full max-h-[600px] rounded-lg">
                            <DialogHeader>
                                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                                <DialogDescription>
                                    <p className="text-xs text-muted-foreground">
                                        Below are the keyboard shortcuts that can be used to navigate through the app.
                                    </p>
                                </DialogDescription>
                            </DialogHeader>

                            <ScrollArea className='' orientation='both'>
                                <CommingSoon className='w-full h-auto max-w-[600px] mx-auto' />
                                <p className='text-lg font-medium text-muted-foreground text-center'>This feature is comming soon</p>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>

                </div>

            </div>
        </header>
    )
}

function NavigationMenuBar() {
    const { data: session, status } = useSession();

    const menu = menuFunc(session?.user);

    return (
        <NavigationMenu>
            <NavigationMenuList>
                {menu.map((item, index) => {
                    if (!item) return null;

                    return (
                        <NavigationMenuItem key={index}>
                            {item.options ? (
                                <>
                                    <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <h2 className="px-4 pt-2 text-lg font-semibold text-muted-foreground">{item.name}</h2>
                                        <p className="px-4 text-xs text-muted-foreground">{item.description}</p>

                                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                            {item.options.map((option, index) => {
                                                if (!option) return null;

                                                return (
                                                    <ListItem
                                                        key={index}
                                                        title={option.name}
                                                        href={`${item.path}${option.path}`}
                                                    >
                                                        {option.description}
                                                    </ListItem>
                                                )
                                            })}
                                        </ul>
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <Link href={item.path} legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        {item.name}
                                    </NavigationMenuLink>
                                </Link>
                            )}
                        </NavigationMenuItem>
                    )
                })}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

function SMNavigationMenuBar({ theme }: { theme: string }) {
    const { data: session, status } = useSession();

    const menu = menuFunc(session?.user);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className='overflow-hidden aspect-square'>
                    <HamburgerMenuIcon className={`h-[1.2em] w-[1.2em] rounded-none`} />
                </Button>
            </SheetTrigger>

            <SheetContent side={"left"} className='w-full max-w-[300px]'>
                <div className='flex flex-col h-full'>
                    <SheetHeader className='pb-2'>
                        <div className={`logo grid place-items-center`}>
                            <Image
                                src={theme === 'dark' ? DarkLogo : LightLogo}
                                alt='logo'
                                height={25}
                                width={170}
                                className='cursor-pointer object-contain'
                            />
                        </div>
                        <p className='text-xs text-center'>
                            Navigate to different pages & sections.
                        </p>
                    </SheetHeader>

                    <div className='pt-8 border-t flex-grow'>
                        <Accordion type="single" collapsible className="w-full flex flex-col gap-2">
                            {menu.map((item, index) => {
                                if (!item) return null;

                                if (item.options) return (
                                    <AccordionItem key={index} value={`nav-item-${index}`} className='bg-muted hover:bg-[hsl(var(--muted)/60%)] transition-colors rounded-md'>
                                        <AccordionTrigger className='py-2 px-4 rounded-md'>
                                            {item.name}
                                        </AccordionTrigger>

                                        <AccordionContent className='pb-2'>
                                            <p className="px-4 text-xs text-muted-foreground line-clamp-2">{item.description}</p>

                                            <ul className="w-full gap-2 flex flex-col items-stretch px-2 pt-2">
                                                {item.options.map((option, index) => {
                                                    if (!option) return null;

                                                    return (
                                                        <li key={index}>
                                                            <Link className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                                                                href={`${item.path}${option.path}`}
                                                                passHref
                                                            >
                                                                <div className="text-sm font-medium leading-none">{option.name}</div>
                                                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                                                    {option.description}
                                                                </p>
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                                else return (
                                    <Link key={index} href={item.path} legacyBehavior passHref>
                                        <Button className='block w-full text-left bg-muted hover:bg-[hsl(var(--muted)/60%)] text-foreground'>
                                            {/* <AccordionTrigger>{item.name}</AccordionTrigger> */}
                                            {item.name}
                                        </Button>
                                    </Link>
                                )
                            })}
                        </Accordion>
                    </div>

                    <div className='w-full border-t '>
                        <p className='flex justify-between py-2'>
                            <span className='text-xs text-muted-foreground'>Version: 1.0.1</span>
                            <span className='text-xs font-medium text-muted-foreground ml-1'>Developed by <a href='https://arif.thedev.id' target='_blank' className='hover:after:w-full after:w-0 after:h-[1px] after:bg-muted after:transition-all after:absolute after:-bottom-[2px] after:left-0 relative'>Arif Sardar</a></span>
                        </p>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    href={href || "#"}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
