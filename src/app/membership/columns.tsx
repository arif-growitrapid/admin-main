"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DBAuthType } from "@/types/auth";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table"

import { VscVerified } from "react-icons/vsc";

export const columns: ColumnDef<DBAuthType>[] = [
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
    }
];
