"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getRoles } from "@/functions/roles"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { ColumnDef, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import React from "react"
import { VscAdd, VscRefresh } from "react-icons/vsc"
import { useColumns } from "./columns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import RolesEdit from "./rolesEdit"

interface DataTableProps<TData, TValue> {
    initial_data: TData[]
}

export function DataTable<TData, TValue>({
    initial_data,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [data, setData] = React.useState<TData[]>(initial_data);
    const [openedRoleID, setOpenedRoleID] = React.useState("");
    const [isPending, startTransition] = React.useTransition();
    const [createModalOpen, setCreateModalOpen] = React.useState(false);

    function refreshData() {
        setData([]);
        startTransition(async () => {
            const data = await getRoles() || { data: [] };

            setData((data.data || []) as TData[]);
        });
    }

    React.useEffect(() => {
        setData(initial_data);
    }, [initial_data]);

    const columns = useColumns({
        openedRoleID,
        setOpenedRoleID,
    }) as ColumnDef<TData, TValue>[];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="rounded-md border h-full flex flex-col">
            <div className="flex items-center justify-between gap-1 border-b-4 p-2">

                <div className="flex gap-1">
                    <h2 className="text-lg font-semibold">Roles Management</h2>
                </div>

                <div className="flex gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="outline" size="icon" onClick={refreshData}>
                        <VscRefresh className="h-4 w-4" />
                    </Button>

                    <Button variant="outline" size="icon" onClick={() => setCreateModalOpen(true)}>
                        <VscAdd className="h-4 w-4" />
                    </Button>
                </div>

            </div>

            <ScrollArea className="w-full relative flex-grow" orientation="both">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    <TableCell className='flex items-center justify-center gap-2'>
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-5 w-32" />
                                    </TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="flex items-center justify-end px-2 py-2 border-t-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            >
                <DialogContent className={`rounded-lg w-full max-w-[calc(100%-2rem)] lg:max-w-4xl h-full max-h-[calc(100%-2rem)] p-0`}>
                    <ScrollArea className='h-full w-full p-4' orientation='both'>
                        <RolesEdit
                            close={() => setCreateModalOpen(false)}
                            isCreating={true}
                        />
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}