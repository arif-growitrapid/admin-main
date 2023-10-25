"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { BookmarkIcon, CaretSortIcon, ClipboardIcon, DotsHorizontalIcon, ExclamationTriangleIcon, EyeOpenIcon, HeartIcon, LockClosedIcon, OpenInNewWindowIcon, Pencil1Icon, PersonIcon, ReloadIcon, StopwatchIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row } from "@tanstack/react-table"

import { VscVerified } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlogPostType } from "@/types/blog";
import Image from "next/image";
import { stringifyNumberData } from "@/utils/funcs";
import Link from "next/link";
import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { changeVisibilityBlog, deleteBlog } from "@/functions/blogs";

export const useColumns = ({ openedBlog, setopenedBlog }: {
    openedBlog: string,
    setopenedBlog: (value: string) => void
}): ColumnDef<BlogPostType>[] => {
    const { toast } = useToast();

    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => <ActionsComponent row={row} />,
        },
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-2 items-center max-w-xs min-w-[250px]">
                        <span>
                            <img
                                src={data.thumbnail || ""}
                                alt={data.title}
                                referrerPolicy="no-referrer"
                                className="rounded-md h-full w-auto max-w-[80px]"
                            />
                        </span>
                        <span className="w-full line-clamp-2">{data.title}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "is_published",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <LockClosedIcon className="h-4 w-4 mr-1" />
                            Visibility
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Badge variant="outline" className={`rounded-full
                                ${data.is_published ? "border-green-500" : "border-yellow-500"}
                                ${data.is_published ? "bg-green-500" : "bg-yellow-500"}
                                [--tw-bg-opacity:0.3]
                            `}>{data.is_published ? "Published" : "Draft"}</Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "author",
            header: ({ column }) => {
                return <div className="flex flex-row gap-1 items-center justify-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <PersonIcon className="h-4 w-4 mr-1" />
                        Author
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-2 items-center justify-center">
                        <Badge variant="outline" className={`rounded-full px-0.5 gap-1 pr-2.5
                                [--tw-bg-opacity:1] bg-muted
                            `}>
                            <Avatar className="h-6 w-6">
                                <AvatarFallback className="rounded-full" />
                                <AvatarImage
                                    src={data.author.image || ""}
                                    alt={data.author.name || ""}
                                    referrerPolicy="no-referrer"
                                />
                            </Avatar>
                            <span className="whitespace-nowrap">{data.author.name}</span>
                        </Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "time_to_read",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            <StopwatchIcon className="h-4 w-4 mr-1" />
                            <span className="whitespace-nowrap">Reading Time</span>
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <span className="text-base font-medium">{data.time_to_read}</span>
                        <span className="text-muted-foreground">min</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "views",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="whitespace-nowrap"
                        >
                            <EyeOpenIcon className="h-4 w-4 mr-1" />
                            Views
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <span className="text-base font-medium">{stringifyNumberData(data.views)}</span>
                        <span className="text-muted-foreground">({data.views.toLocaleString()})</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "likes",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="whitespace-nowrap"
                        >
                            <HeartIcon className="h-4 w-4 mr-1" />
                            Likes
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <span className="text-base font-medium">{stringifyNumberData(data.likes)}</span>
                        <span className="text-muted-foreground">({data.likes.toLocaleString()})</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "saves",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="whitespace-nowrap"
                        >
                            <BookmarkIcon className="h-4 w-4 mr-1" />
                            Saves
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <span className="text-base font-medium">{stringifyNumberData(data.saves)}</span>
                        <span className="text-muted-foreground">({data.saves.toLocaleString()})</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="whitespace-nowrap"
                        >
                            Posted On
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <span>{new Date(data.createdAt).toDateString()}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => {
                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            className="whitespace-nowrap"
                        >
                            Last Updated
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <span>{new Date(data.updatedAt).toDateString()}</span>
                    </div>
                );
            },
        }
    ]
};

function ActionsComponent({
    row
}: {
    row: Row<BlogPostType>,
}) {
    const { toast } = useToast();
    const [alertItem, setAlertItem] = React.useState(0);
    const [isPending, startTransition] = React.useTransition();

    const data = row.original

    function DangerActionFunction() {
        startTransition(async () => {
            if (alertItem === 1) {
                // Publish/Unpublish Blog
                const res = await changeVisibilityBlog(data._id.toString(), window.location.pathname);

                if (res.status === 200) {
                    toast({
                        title: "Blog Visibility Changed",
                        description: "Blog Visibility Changed",
                        duration: 5000,
                    });
                } else {
                    toast({
                        title: "Error Changing Blog Visibility",
                        description: res.message,
                        duration: 5000,
                    });
                }

                return;
            }

            if (alertItem === 2) {
                // Delete Blog
                const res = await deleteBlog(data._id.toString(), window.location.pathname);

                if (res.status === 200) {
                    toast({
                        title: "Blog Deleted",
                        description: "Blog Deleted",
                        duration: 5000,
                    });
                } else {
                    toast({
                        title: "Error Deleting Blog",
                        description: res.message,
                        duration: 5000,
                    });
                }
            }
        });
    }

    return (
        <>
            {isPending ?
                <ReloadIcon className="h-4 w-4 animate-spin" />
                :
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-muted-foreground">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => {
                            toast({
                                title: "Opening Blog in New Tab",
                                description: "Opening Blog in New Tab",
                                duration: 5000,
                            });
                            window.open(`https://www.growitrapid.com/blogs/${data.slug}`, "_blank");
                        }}>
                            Open Blog in New Tab
                            <DropdownMenuShortcut><OpenInNewWindowIcon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/blogs/${data._id.toString()}`} passHref>
                                Edit
                                <DropdownMenuShortcut><Pencil1Icon /></DropdownMenuShortcut>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger className="text-red-600">Danger Zone</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="w-48">
                                    <DropdownMenuItem onClick={() => {
                                        setAlertItem(1)
                                    }}>
                                        {data.is_published ? "Unpublish" : "Publish"} Blog
                                        <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        setAlertItem(2)
                                    }}>
                                        Delete Blog
                                        <DropdownMenuShortcut><TrashIcon /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            }

            <AlertDialog open={alertItem > 0} onOpenChange={open => setAlertItem(open ? alertItem : 0)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure {alertItem === 1 ? (data.is_published ? "Unpublish" : "Publish")
                            : "Delete"} this blog post?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertItem === 2 ?
                                "This action cannot be undone. This will permanently change your account in our servers."
                                : "This action will change user status in our servers."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={DangerActionFunction}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
