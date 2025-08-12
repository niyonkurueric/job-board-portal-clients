import React from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
};

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

function ReusableTable<T extends { id?: string | number }>(props: ReusableTableProps<T>) {
  const { columns, data, emptyMessage = 'No data found.' } = props;

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(col => (
              <TableHead key={col.key as string} className={col.className}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, idx) => (
              <TableRow key={row.id ?? idx}>
                {columns.map(col => (
                  <TableCell key={col.key as string} className={col.className}>
                    {col.render
                      ? col.render(row[col.key as keyof T], row)
                      : (row[col.key as keyof T] as React.ReactNode) ?? '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ReusableTable;
