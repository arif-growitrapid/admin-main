"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { DBAuthType } from "@/types/auth";
import { CaretSortIcon, ClipboardIcon, DotsHorizontalIcon, ExclamationTriangleIcon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table"

import { VscVerified } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserModal from "@/components/user_modal";
import { ScrollArea } from "@/components/ui/scroll-area";

export const useColumns = ({ openedUser, setOpenedUser }: {
    openedUser: string,
    setOpenedUser: (value: string) => void
}): ColumnDef<DBAuthType>[] => {
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
            cell: ({ row }) => {
                const user = row.original

                return (
                    <Dialog
                        open={user.id === openedUser}
                        onOpenChange={open => {
                            if (!open) {
                                setOpenedUser("");
                            } else {
                                setOpenedUser(user.id);
                            }
                        }}
                    >
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
                                    navigator.clipboard.writeText(user.id).then(() => {
                                        toast({
                                            title: "User ID copied to clipboard",
                                            description: <pre className="mt-2 w-[340px] rounded-md bg-muted p-4">
                                                <code className="text-muted-foreground">User ID: {user.id}</code>
                                            </pre>,
                                        });
                                    });
                                }}>
                                    Copy User ID
                                    <DropdownMenuShortcut><ClipboardIcon /></DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>
                                        View User
                                        <DropdownMenuShortcut><PersonIcon /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="text-red-600">Danger Zone</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent className="w-48">
                                            <DropdownMenuItem>
                                                Delete User
                                                <DropdownMenuShortcut><TrashIcon /></DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Deactivate User
                                                <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                Block User
                                                <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                            </DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DialogContent className={`rounded-lg
                            bg-transparent border-none w-full h-full max-w-full p-0`} onClick={e => {
                                e.stopPropagation();
                                setOpenedUser("");
                            }}>
                            <ScrollArea className='h-full w-full' orientation='both'>
                                <div className="sm:container mx-auto sm:py-5 h-full">
                                    <UserModal user={user} />
                                </div>
                            </ScrollArea>
                        </DialogContent>
                    </Dialog>
                )
            },
        },
        // {
        //     accessorKey: "id",
        //     header: "ID",
        // },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-2 items-center">
                        <Avatar className={`h-8 w-8 rounded-full`}>
                            <AvatarImage
                                src={data.image || ""}
                                alt={data.name || data.email || ""}
                                referrerPolicy='no-referrer'
                            />
                            <AvatarFallback className={`h-full w-full rounded-none`}>
                                {data.name?.split(" ").map(e => e.charAt(0)).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <span className="whitespace-nowrap">{data.name}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1">
                        <span>{data.email}</span>
                        {data.emailVerified && <span
                            className="text-green-500 text-xl"
                        ><VscVerified /></span>}
                    </div>
                );
            },
        },
        {
            accessorKey: "roles",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Roles
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 flex-wrap">
                        {data.roles.slice(0, 3).map((role) => (
                            <Badge key={role} className="text-sm text-muted-foreground bg-muted hover:bg-[hsl(var(--muted)/60%)] uppercase px-2">{role}</Badge>
                        ))}
                    </div>
                );
            },
            enableGrouping: true,
            enableColumnFilter: true,
            enableSorting: true,
        },
        {
            accessorKey: "status",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Status
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Badge variant="outline" className={`rounded-full
                                ${data.status === "active" ? "border-green-500" : data.status === "pending" ? "border-yellow-500" : "border-red-600"}
                                ${data.status === "active" ? "bg-green-500" : data.status === "pending" ? "bg-yellow-500" : "bg-red-600"}
                                [--tw-bg-opacity:0.3]
                            `}>{data.status.toUpperCase()}</Badge>
                    </div>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        className="whitespace-nowrap"
                    >
                        Registered On
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1">
                        <span>{new Date(data.createdAt).toDateString()}</span>
                    </div>
                );
            },
        },
    ]
};
