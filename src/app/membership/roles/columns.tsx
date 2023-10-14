"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ChangeRoleStatus, DeleteRole } from "@/functions/roles";
import { roleType } from "@/types/auth";
import { ArrowRightIcon, DotsHorizontalIcon, ExclamationTriangleIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import React from "react";
import { VscEdit } from "react-icons/vsc";
import RolesEdit from "./rolesEdit";

export const useColumns = ({ openedRoleID, setOpenedRoleID }: {
    openedRoleID: string,
    setOpenedRoleID: (value: string) => void
}): ColumnDef<roleType>[] => {

    return [
        // {
        //     id: "select",
        //     header: ({ table }) => (
        //         <Checkbox
        //             checked={table.getIsAllPageRowsSelected()}
        //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        //             aria-label="Select all"
        //         />
        //     ),
        //     cell: ({ row }) => (
        //         <Checkbox
        //             checked={row.getIsSelected()}
        //             onCheckedChange={(value) => row.toggleSelected(!!value)}
        //             aria-label="Select row"
        //         />
        //     ),
        //     enableSorting: false,
        //     enableHiding: false,
        // },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => <ActionsComponent
                row={row}
                openedRoleID={openedRoleID}
                setOpenedRoleID={setOpenedRoleID}
            />,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <span
                className="capitalize"
            >{row.original.name}</span>,
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <span
                className="w-full max-w-[300px] text-muted-foreground text-sm line-clamp-2"
            >{row.original.description}</span>,
        },
        {
            accessorKey: "rank",
            header: ({ column }) => <span
                className="capitalize text-center w-full block"
            >Rank</span>,
            sortingFn: (rowA, rowB) => rowA.original.rank - rowB.original.rank,
            sortDescFirst: true,
            cell: ({ row }) => <span
                className="capitalize text-center w-full block"
            >{row.original.rank}</span>,
        },
        {
            accessorKey: 'permissions_count',
            header: ({ column }) => <span
                className="capitalize text-center w-full block"
            >Permissions</span>,
            cell: ({ row }) => <span
                className="capitalize text-center w-full block"
            >{row.original.permissions.length}</span>,
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <Badge
                variant="outline"
                className={`rounded-full
                    ${row.original.status === "active" ? "border-green-500" : "border-red-600"}
                    ${row.original.status === "active" ? "bg-green-500" : "bg-red-600"}
                    [--tw-bg-opacity:0.3]
                `}>
                {row.original.status}
            </Badge>,
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => <span
                className="capitalize"
            >{new Date(row.original.createdAt).toDateString()}</span>,
        },
    ];
};

function ActionsComponent({
    row,
    openedRoleID,
    setOpenedRoleID,
}: {
    row: Row<roleType>,
    openedRoleID: string,
    setOpenedRoleID: (value: string) => void
}) {
    const { toast } = useToast();
    const [alertItem, setAlertItem] = React.useState(0);
    const [isPending, startTransition] = React.useTransition();

    const role = row.original

    function DangerActionFunction() {
        if (role._id.toString() === '1' || role._id.toString() === '2') {
            toast({
                title: "Cannot make changes in this role",
                description: "This role is required for the system to function properly.",
                variant: 'destructive'
            });
            return;
        }

        startTransition(async () => {
            if ([2, 3].includes(alertItem)) {
                const res = await ChangeRoleStatus(role._id.toString(), alertItem === 2 ? "active" : "inactive", window.location.pathname);

                toast({
                    title: res.status === 200 ? "Role status changed" : "Role status change failed",
                    description: res.status === 200 ? <div>
                        <p>Role status changed to <span className="text-green-500">{alertItem === 2 ? "Active"
                            : "Inactive"}</span></p>
                        <p>User will be notified via email</p>
                    </div> : res.message || "Role status change failed",
                    variant: res.status === 200 ? 'default' : 'destructive'
                });
            } else {
                const res = await DeleteRole(role._id.toString(), window.location.pathname);

                toast({
                    title: res.status === 200 ? "Role deleted" : "Role deletion failed",
                    description: res.status === 200 ? "Role deleted successfully" : res.message || "Role deletion failed",
                    variant: res.status === 200 ? 'default' : 'destructive'
                });
            }
        });
    }

    return (
        <Dialog
            open={row.id === openedRoleID}
            onOpenChange={open => {
                if (!open) {
                    setOpenedRoleID("");
                } else {
                    setOpenedRoleID(row.id);
                }
            }}
        >
            {isPending ?
                <ReloadIcon className="h-4 w-4 animate-spin" />
                :
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={['1', '2'].includes(role._id.toString())}>
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-muted-foreground">Actions</DropdownMenuLabel>
                        {/* View User */}
                        <DialogTrigger asChild>
                            <DropdownMenuItem>
                                Edit Role
                                <DropdownMenuShortcut><VscEdit /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuSeparator />
                        {/* Delete Role */}
                        <DropdownMenuItem onClick={e => setAlertItem(1)}>
                            Delete User
                            <DropdownMenuShortcut><TrashIcon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        {/* Activate Role */}
                        {role.status !== "active" &&
                            <DropdownMenuItem onClick={e => setAlertItem(2)}>
                                Activate Role
                                <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        }
                        {/* Deactivate Role */}
                        {role.status !== "inactive" &&
                            <DropdownMenuItem onClick={e => setAlertItem(3)}>
                                Deactivate Role
                                <DropdownMenuShortcut><ExclamationTriangleIcon /></DropdownMenuShortcut>
                            </DropdownMenuItem>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            }

            <AlertDialog open={alertItem > 0} onOpenChange={open => setAlertItem(open ? alertItem : 0)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure to {alertItem === 2 ? "Activate"
                            : alertItem === 3 ? "Deactivate"
                                : "Delete"} Role?</AlertDialogTitle>
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

            <DialogContent className={`rounded-lg w-full max-w-[calc(100%-2rem)] lg:max-w-4xl h-full max-h-[calc(100%-2rem)] p-0`}>
                <ScrollArea className='h-full w-full p-4' orientation='both'>
                    <RolesEdit
                        initial_data={role}
                        close={() => setOpenedRoleID("")}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

