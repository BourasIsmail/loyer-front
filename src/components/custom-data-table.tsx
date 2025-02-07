"use client"

import React, { useState } from "react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    getFilteredRowModel,
    type ColumnFiltersState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    onRowsSelected?: (rows: TData[]) => void
}

export function CustomDataTable<TData, TValue>({ columns, data, onRowsSelected }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = useState({})
    const [regionFilter, setRegionFilter] = useState<string>("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    React.useEffect(() => {
        if (onRowsSelected) {
            const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original as TData)
            onRowsSelected(selectedRows)
        }
    }, [rowSelection, onRowsSelected]) // Removed table from dependencies

    const uniqueRegions = React.useMemo(() => {
        const regions = new Set<string>()
        data.forEach((item: any) => {
            if (item.province?.region?.name) {
                regions.add(item.province.region.name)
            }
        })
        return Array.from(regions)
    }, [data])

    React.useEffect(() => {
        if (regionFilter) {
            table.getColumn("province.region.name")?.setFilterValue(regionFilter)
        } else {
            table.getColumn("province.region.name")?.setFilterValue("")
        }
    }, [regionFilter, table])

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter noms..."
                    value={(table.getColumn("nomComplet")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("nomComplet")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <Select value={regionFilter} onValueChange={(value) => setRegionFilter(value)}>
                    <SelectTrigger className="w-[180px] ml-4">
                        <SelectValue placeholder="Filtrer par région" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les régions</SelectItem> {/* Changed default value */}
                        {uniqueRegions.map((region) => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
}

