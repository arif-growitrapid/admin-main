"use client"

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { DBAuthType, roleType } from "@/types/auth";
import { CaretSortIcon, ClipboardIcon, DotsHorizontalIcon, ExclamationTriangleIcon, GearIcon, IdCardIcon, PersonIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row, RowSelectionState, Table } from "@tanstack/react-table"

import { VscVerified } from "react-icons/vsc";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserModal from "@/components/user_modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { assignRolesToUsersByID, changeVisibilityOfUsersByID, deleteUsersByID, promoteUsersByID } from "@/functions/user";
import { getRoles } from "@/functions/roles";
import { Switch } from "@/components/ui/switch";

export const useColumns = ({ initial_roles }: { initial_roles?: roleType[] }): ColumnDef<DBAuthType>[] => {
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
            cell: ({ row }) => (<ActionsComponent row={row} initial_roles={initial_roles} />),
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
            accessorKey: "is_employee",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Employee
                        <CaretSortIcon className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const data = row.original;

                return (
                    <div className="flex flex-row gap-1 items-center justify-center">
                        <Badge variant="outline" className={`rounded-full
                                ${data.is_employee ? "border-green-500" : "border-red-600"}
                                ${data.is_employee ? "bg-green-500" : "bg-red-600"}
                                [--tw-bg-opacity:0.3]
                            `}>{data.is_employee ? "Yes" : "No"}</Badge>
                    </div>
                );
            },
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
            if ([6, 7].includes(alertItem)) {
                const res = await promoteUsersByID(selectedRowIds, alertItem === 6, window.location.pathname);

                toast({
                    title: res.status === 200 ? "User status changed" : "User status change failed",
                    description: res.status === 200 ? <div>
                        <p>User status changed to <span className="text-green-500">{alertItem === 6 ? "Employee"
                            : "User"}</span></p>
                        <p>User will be notified via email</p>
                    </div> : res.message || "User status change failed",
                });
            } else if ([2, 3, 4, 5].includes(alertItem)) {
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

                    {/* Promote User */}
                    <DropdownMenuItem onClick={e => setAlertItem(6)}>
                        Assign as Employee
                        <DropdownMenuShortcut><IdCardIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    {/* Demote User */}
                    <DropdownMenuItem onClick={e => setAlertItem(7)}>
                        Remove Employee
                        <DropdownMenuShortcut><IdCardIcon /></DropdownMenuShortcut>
                    </DropdownMenuItem>
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
                        <AlertDialogTitle>Are you absolutely sure want to {alertItem === 1 ? "Delete"
                            : alertItem === 2 ? "Pend"
                                : alertItem === 3 ? "Activate"
                                    : alertItem === 4 ? "Deactivate"
                                        : alertItem === 5 ? "Block"
                                            : alertItem === 6 ? "Assign as an Employee"
                                                : "Dissociate from Employee"} this User?</AlertDialogTitle>
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
    initial_roles
}: {
    row: Row<DBAuthType>,
    initial_roles?: roleType[],
}) {
    const { toast } = useToast();
    const [alertItem, setAlertItem] = React.useState(0);
    const [isPending, startTransition] = React.useTransition();
    const [dialogItem, setDialogItem] = React.useState(0);
    const [roles, setRoles] = React.useState<roleType[]>(initial_roles || []);
    const [selectedRoles, setSelectedRoles] = React.useState(row.original.roles || []);

    const user = row.original

    React.useEffect(() => {
        setRoles(initial_roles || []);
    }, [initial_roles]);

    function RefreshRoles() {
        startTransition(async () => {
            const res = await getRoles();

            if (res.status === 200) {
                setRoles(res.data || []);
            } else {
                toast({
                    title: "Error fetching roles",
                    description: res.message || "Error fetching roles",
                });
            }
        });
    }

    function SaveRoles() {
        startTransition(async () => {
            const res = await assignRolesToUsersByID([user.id], selectedRoles, window.location.pathname);

            if (res.status === 200) {
                toast({
                    title: "Roles updated",
                    description: "Roles updated successfully",
                });
            } else {
                toast({
                    title: "Error updating roles",
                    description: res.message || "Error updating roles",
                });
            }
        });
    }

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
                        <DropdownMenuItem onClick={() => {
                            setDialogItem(1)
                        }}>
                            View User
                            <DropdownMenuShortcut><PersonIcon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            setDialogItem(2)
                        }}>
                            Edit Roles
                            <DropdownMenuShortcut><GearIcon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            startTransition(async () => {
                                const res = await promoteUsersByID([user.id], !user.is_employee, window.location.pathname);

                                toast({
                                    title: res.status === 200 ? "User status changed" : "User status change failed",
                                    description: res.status === 200 ? <div>
                                        <p>User status changed to <span className="text-green-500">{!user.is_employee ? "Employee"
                                            : "User"}</span></p>
                                        <p>User will be notified via email</p>
                                    </div> : res.message || "User status change failed",
                                });
                            });
                        }}>
                            {user.is_employee ? "Remove Employee" : "Assign as Employee"}
                            <DropdownMenuShortcut><IdCardIcon /></DropdownMenuShortcut>
                        </DropdownMenuItem>
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

            <Dialog
                open={dialogItem > 0}
                onOpenChange={open => {
                    if (!open) {
                        setDialogItem(0);
                    }
                }}
            >
                {dialogItem === 1 ?
                    <DialogContent className={`rounded-lg
                            bg-transparent border-none w-full h-full max-w-full p-0`}
                        onClick={e => {
                            e.stopPropagation();
                            setDialogItem(0);
                        }}>
                        <ScrollArea className='h-full w-full' orientation='both'>
                            <div className="sm:container mx-auto sm:py-5 h-full">
                                <UserModal user={user} />
                            </div>
                        </ScrollArea>
                    </DialogContent>
                    :
                    <DialogContent className={`rounded-lg w-full max-w-[calc(100%-2rem)] lg:max-w-4xl h-auto max-h-[calc(100%-2rem)] p-0`}>
                        <ScrollArea className='h-full w-full p-4' orientation='both'>
                            <div className='w-full h-auto'>
                                {isPending &&
                                    <div className='w-full h-full fixed top-0 left-0 flex flex-row justify-center items-center bg-black bg-opacity-50 z-50'>
                                        <div className='w-12 h-12 animate-spin'>
                                            <svg className='w-full h-full text-foreground' viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                }

                                <h2 className='text-xl font-semibold text-muted-foreground'>Edit Role</h2>
                                <p className='text-sm text-muted-foreground'>Select roles for this user.</p>

                                <div className='flex flex-row gap-4 mt-4'>
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-sm text-muted-foreground'>User ID</span>
                                        <span className='text-xs font-semibold'>{user.id}</span>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <span className='text-sm text-muted-foreground'>Email</span>
                                        <span className='text-xs font-semibold'>{user.email}</span>
                                    </div>
                                </div>

                                <div className='col-span-full border rounded-lg px-4 py-2 mt-4'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-muted-foreground'>Add/Remove Roles</h3>
                                        <p className='text-sm text-muted-foreground'>
                                            Add or remove roles for this user.
                                            Roles are used to grant permissions to users.
                                        </p>
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                                        {roles.map((role, index) => (
                                            <div key={index} className={`flex flex-row gap-4 items-center
                                                border rounded-lg px-4 py-2
                                            `}>
                                                <Switch
                                                    checked={selectedRoles.includes(role.name)}
                                                    onCheckedChange={(value) => {
                                                        if (value) {
                                                            setSelectedRoles([...selectedRoles, role.name]);
                                                        } else {
                                                            setSelectedRoles(selectedRoles.filter(e => e !== role.name));
                                                        }
                                                    }}
                                                    disabled={role.status === "inactive"}
                                                />
                                                <div className={`${selectedRoles.includes(role.name) ? "text-foreground" : "text-muted-foreground"}`}>
                                                    <h2 className="text-sm capitalize pb-2">{role.name}</h2>
                                                    <p className="text-xs line-clamp-2">{role.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className='flex flex-row flex-wrap gap-4 mt-4'>
                                    <div className="flex-grow" />
                                    <Button
                                        variant="secondary"
                                        onClick={RefreshRoles}
                                    >
                                        Refresh Roles
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setSelectedRoles([]);
                                        }}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setSelectedRoles(roles.filter(e => e.status === "active").map(e => e.name));
                                        }}
                                    >
                                        Select All
                                    </Button>
                                    <Button
                                        variant="default"
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                        onClick={SaveRoles}
                                    >
                                        Save
                                    </Button>
                                </div>

                            </div>
                        </ScrollArea>
                    </DialogContent>
                }
            </Dialog>
        </>
    )
}
