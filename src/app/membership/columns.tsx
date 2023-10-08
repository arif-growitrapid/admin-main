"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { DBAuthType } from "@/types/auth";
import { CaretSortIcon, ClipboardIcon, DotsHorizontalIcon, ExclamationTriangleIcon, PersonIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table"

import { VscVerified } from "react-icons/vsc";
import UserModal from "./user_modal";

export const useColumns = (): ColumnDef<DBAuthType>[] => {
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
                        // open={user.email === "as2048282@gmail.com"}
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

                        <UserModal user={user} />
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
                    <div className="flex flex-row gap-1">
                        {data.roles.map((role) => (
                            <span key={role} className="text-sm text-gray-500 uppercase">{role}, </span>
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
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
