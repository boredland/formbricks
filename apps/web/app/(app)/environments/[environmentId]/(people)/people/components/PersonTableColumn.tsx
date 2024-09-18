"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@formbricks/lib/cn";
import { TPersonTableData } from "@formbricks/types/people";
import { Checkbox } from "@formbricks/ui/Checkbox";

export const generatePersonTableColumns = (isExpanded: boolean): ColumnDef<TPersonTableData>[] => {
  const selectionColumn: ColumnDef<TPersonTableData> = {
    accessorKey: "select",
    size: 75,
    enableResizing: false,
    header: ({ table }) => (
      <div className="flex w-full items-center justify-center pr-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex w-full items-center justify-center pr-4">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mx-1"
        />
      </div>
    ),
  };

  const dateColumn: ColumnDef<TPersonTableData> = {
    accessorKey: "createdAt",
    header: () => "Date",
    size: 200,
    cell: ({ row }) => {
      const isoDateString = row.original.createdAt;
      const date = new Date(isoDateString);

      const formattedDate = date.toLocaleString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedTime = date.toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      return (
        <div>
          <p className="truncate text-slate-900">{formattedDate}</p>
          <p className="truncate text-slate-900">{formattedTime}</p>
        </div>
      );
    },
  };

  const userColumn: ColumnDef<TPersonTableData> = {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const personId = row.original.personId;
      return <p className="truncate text-slate-900">{personId}</p>;
    },
  };

  const userIdColumn: ColumnDef<TPersonTableData> = {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => {
      const userId = row.original.userId;
      return <p className="truncate text-slate-900">{userId}</p>;
    },
  };

  const emailColumn: ColumnDef<TPersonTableData> = {
    accessorKey: "email",
    header: "Email",
  };

  const attributesColumn: ColumnDef<TPersonTableData> = {
    accessorKey: "attributes",
    header: "Attributes",
    cell: ({ row }) => {
      const attributes = row.original.attributes;

      // Handle cases where attributes are missing or empty
      if (!attributes || Object.keys(attributes).length === 0) return null;

      return (
        <div className={cn(!isExpanded && "flex space-x-2")}>
          {Object.entries(attributes).map(([key, value]) => (
            <div key={key} className="flex space-x-2">
              <div className="font-semibold">{key}</div> : <div>{value}</div>
            </div>
          ))}
        </div>
      );
    },
  };

  return [selectionColumn, dateColumn, userColumn, userIdColumn, emailColumn, attributesColumn];
};
