"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useColumns } from "./columns"
import { VscRefresh } from "react-icons/vsc"
import { Skeleton } from "@/components/ui/skeleton"
import { filterUsers } from "@/functions/user"
import { roleType } from "@/types/auth"

interface DataTableProps<TData, TValue> {
    initial_data: TData[],
    initial_total?: number,
    initial_roles?: roleType[],
}

export function DataTable<TData, TValue>({
    initial_data,
    initial_total = 0,
    initial_roles,
}: DataTableProps<TData, TValue>) {
    const [data, setData] = React.useState<TData[]>(initial_data);
    const [total, setTotal] = React.useState(initial_total);
    const [isPending, startTransition] = React.useTransition();
    const [columnFilterBy, setColumnFilterBy] = React.useState("email");
    const [filterQuery, setFilterQuery] = React.useState("");

    // States for react-table
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({});
    const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    React.useEffect(() => { setData(initial_data); }, [initial_data]);

    function refreshData() {
        setData([]);
        startTransition(async () => {
            const data = await filterUsers({
                [columnFilterBy]: {
                    $regex: filterQuery,
                    $options: "i",
                },
            }, 10, pageIndex * pageSize) || {
                data: {
                    users: [],
                    total: 0
                }
            };

            setData((data.data?.users || []) as TData[]);
            setTotal(data.data?.total || 0);
        });
    }

    // Update data when pagination changes
    React.useEffect(() => {
        setData([]);

        startTransition(async () => {
            const data = await filterUsers({}, 10, pageIndex * pageSize) || {
                data: {
                    users: [],
                    total: 0
                }
            };

            setData((data.data?.users || []) as TData[]);
            setTotal(data.data?.total || 0);
        });
    }, [pageIndex, pageSize]);

    // Update data when column filters change
    React.useEffect(() => {
        if (!filterQuery) {
            setData(initial_data);
            setTotal(initial_total);
            return;
        };
        setData([]);

        startTransition(async () => {
            const data = await filterUsers({
                [columnFilterBy]: {
                    $regex: filterQuery,
                    $options: "i",
                },
            }, 10, 0) || {
                data: {
                    users: [],
                    total: 0
                }
            };

            setData((data.data?.users || []) as TData[]);
            setTotal(data.data?.total || 0);
            setPagination({ pageIndex: 0, pageSize: 10});
        });
    }, [filterQuery, columnFilterBy]);

    const pagination = React.useMemo(() => ({ pageIndex, pageSize }), [pageIndex, pageSize]);

    const columns = useColumns({ initial_roles }) as ColumnDef<TData, TValue>[];

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },

        // Pagination
        manualPagination: true,
        pageCount: Math.ceil(total / 10),
        onPaginationChange: setPagination,
    })

    return (
        <div className="rounded-md border h-full flex flex-col">
            <div className="flex items-center justify-between gap-1 border-b-4 p-2">

                <div className="flex gap-1">
                    <Input
                        placeholder={`Filter ${columnFilterBy}s...`}
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select defaultValue={"email"}
                        onValueChange={(e) => setColumnFilterBy(e || "email")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <SelectItem
                                                key={column.id}
                                                className="capitalize"
                                                value={column.id}
                                            >
                                                {column.id}
                                            </SelectItem>
                                        )
                                    })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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

            <div className="flex items-center justify-end px-2 py-2 border-t-4 gap-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="h-full flex items-center gap-1 align-middle text-sm text-muted-foreground">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isPending}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isPending}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
