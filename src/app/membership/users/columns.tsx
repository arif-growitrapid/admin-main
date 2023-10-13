"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { DBAuthType } from "@/types/auth";
import { CaretSortIcon, ClipboardIcon, DotsHorizontalIcon, ExclamationTriangleIcon, PersonIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row, RowSelectionState, Table } from "@tanstack/react-table"

import { VscVerified } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserModal from "@/components/user_modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { changeVisibilityOfUsersByID, deleteUsersByID } from "@/functions/user";

export const useColumns = ({ openedUser, setOpenedUser, rowSelection }: {
    openedUser: string,
    setOpenedUser: (value: string) => void,
    rowSelection?: RowSelectionState,
}): ColumnDef<DBAuthType>[] => {
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
            header: ({ table }) => <ActionsComponentHeader table={table} />,
            cell: ({ row }) => (<ActionsComponent row={row} openedUser={openedUser} setOpenedUser={setOpenedUser} />),
        },
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
                        {data.roles.slice(-2).map((role) => (
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

function ActionsComponentHeader({
    table,
}: {
    table: Table<DBAuthType>,
}) {
    const { toast } = useToast();
    const [alertItem, setAlertItem] = React.useState(0);
    const [isPending, startTransition] = React.useTransition();
    const selectedRows = table.getFilteredSelectedRowModel();
    const selectedRowIds = selectedRows.rows.map(row => row.original._id.toString());
    const isAnyRowSelected = selectedRows.rows.length > 0;

    function DangerActionFunction() {
        startTransition(async () => {
            if ([2, 3, 4, 5].includes(alertItem)) {
                const res = await changeVisibilityOfUsersByID(
                    selectedRowIds,
                    alertItem === 2 ? "pending"
                        : alertItem === 3 ? "active"
                            : alertItem === 4 ? "inactive"
                                : "blocked",
                    window.location.pathname
                );

                toast({
                    title: res.status === 200 ? "User status changed" : "User status change failed",
                    description: res.status === 200 ? <div>
                        <p>User status changed to <span className="text-green-500">{alertItem === 2 ? "pending"
                            : alertItem === 3 ? "active"
                                : alertItem === 4 ? "inactive"
                                    : "blocked"}</span></p>
                        <p>User will be notified via email</p>
                    </div> : res.message || "User status change failed",
                });
            } else {
                const res = await deleteUsersByID(selectedRowIds, window.location.pathname);

                toast({
                    title: res.status === 200 ? "User deleted" : "User deletion failed",
                    description: res.status === 200 ? "User deleted successfully. Will notify this user via email." : res.message || "User deletion failed",
                });
            }
        });
    }

    return isPending ?
        <ReloadIcon className="h-4 w-4 animate-spin" />
        :
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={!isAnyRowSelected}>
                        <span className="sr-only">Open menu</span>
                        <DotsHorizontalIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="text-muted-foreground">Actions</DropdownMenuLabel>

                    {/* Delete User */}
                    <DropdownMenuItem onClick={e => setAlertItem(1)}>
                        Delete User
                        <DropdownMenuShortcut><TrashIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* Pending User */}
                    <DropdownMenuItem onClick={e => setAlertItem(2)}>
                        Pend User
                        <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* Activate User */}
                    <DropdownMenuItem onClick={e => setAlertItem(3)}>
                        Activate User
                        <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* Deactivate User */}
                    <DropdownMenuItem onClick={e => setAlertItem(4)}>
                        Deactivate User
                        <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* Block User */}
                    <DropdownMenuItem onClick={e => setAlertItem(5)}>
                        Block User
                        <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={alertItem > 0} onOpenChange={open => setAlertItem(open ? alertItem : 0)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure {alertItem === 2 ? "Pending"
                            : alertItem === 3 ? "Activate"
                                : alertItem === 4 ? "Deactivate"
                                    : "Block"} User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertItem === 1 ?
                                "This action cannot be undone. This will permanently change your account in our servers."
                                : "This action will change user status in our servers. User will be notified via email."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={DangerActionFunction}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
}

function ActionsComponent({
    row,
    openedUser,
    setOpenedUser,
}: {
    row: Row<DBAuthType>,
    openedUser: string,
    setOpenedUser: (value: string) => void
}) {
    const { toast } = useToast();
    const [alertItem, setAlertItem] = React.useState(0);
    const [isPending, startTransition] = React.useTransition();

    const user = row.original

    function DangerActionFunction() {
        startTransition(async () => {
            if ([2, 3, 4, 5].includes(alertItem)) {
                const res = await changeVisibilityOfUsersByID(
                    [user.id],
                    alertItem === 2 ? "pending"
                        : alertItem === 3 ? "active"
                            : alertItem === 4 ? "inactive"
                                : "blocked",
                    window.location.pathname
                );

                toast({
                    title: res.status === 200 ? "User status changed" : "User status change failed",
                    description: res.status === 200 ? <div>
                        <p>User status changed to <span className="text-green-500">{alertItem === 2 ? "pending"
                            : alertItem === 3 ? "active"
                                : alertItem === 4 ? "inactive"
                                    : "blocked"}</span></p>
                        <p>User will be notified via email</p>
                    </div> : res.message || "User status change failed",
                });
            } else {
                const res = await deleteUsersByID([user.id], window.location.pathname);

                toast({
                    title: res.status === 200 ? "User deleted" : "User deletion failed",
                    description: res.status === 200 ? "User deleted successfully. Will notify this user via email." : res.message || "User deletion failed",
                });
            }
        });
    }

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
                        {/* Copy User ID */}
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
                        {/* View User */}
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
                                    {/* Delete User */}
                                    <DropdownMenuItem onClick={e => setAlertItem(1)}>
                                        Delete User
                                        <DropdownMenuShortcut><TrashIcon /></DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                    {/* Pending User */}
                                    {user.status !== "pending" &&
                                        <DropdownMenuItem onClick={e => setAlertItem(2)}>
                                            Pend User
                                            <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    }
                                    {/* Activate User */}
                                    {user.status !== "active" &&
                                        <DropdownMenuItem onClick={e => setAlertItem(3)}>
                                            Activate User
                                            <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    }
                                    {/* Deactivate User */}
                                    {user.status !== "inactive" &&
                                        <DropdownMenuItem onClick={e => setAlertItem(4)}>
                                            Deactivate User
                                            <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    }
                                    {/* Block User */}
                                    {user.status !== "blocked" &&
                                        <DropdownMenuItem onClick={e => setAlertItem(5)}>
                                            Block User
                                            <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                                        </DropdownMenuItem>
                                    }
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
            }

            <AlertDialog open={alertItem > 0} onOpenChange={open => setAlertItem(open ? alertItem : 0)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure {alertItem === 2 ? "Pending"
                            : alertItem === 3 ? "Activate"
                                : alertItem === 4 ? "Deactivate"
                                    : "Block"} User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertItem === 1 ?
                                "This action cannot be undone. This will permanently change your account in our servers."
                                : "This action will change user status in our servers. User will be notified via email."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={DangerActionFunction}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
}
