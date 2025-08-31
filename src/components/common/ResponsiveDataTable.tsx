import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import { Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResponsiveDataTableProps {
  columns: any[];
  data: any[];
  title?: string;
  actions?: any[];
  searchable?: boolean;
  pagination?: boolean;
  selectableRows?: boolean;
  onRowSelect?: (selectedRows: any[]) => void;
  loading?: boolean;
  exportable?: boolean;
  onExport?: () => void;
}

const ResponsiveDataTable: React.FC<ResponsiveDataTableProps> = ({
  columns,
  data,
  title = "Data Table",
  actions,
  searchable = true,
  pagination = true,
  selectableRows = false,
  onRowSelect,
  loading = false,
  exportable = false,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage, pagination]);

  // Handle row selection
  const handleRowSelect = (state: any) => {
    setSelectedRows(state.selectedRows);
    if (onRowSelect) {
      onRowSelect(state.selectedRows);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  // Custom styles for better responsiveness
  const customStyles = {
    table: {
      style: {
        minWidth: "100%",
        backgroundColor: "transparent",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "2px solid #e2e8f0",
        minHeight: "56px",
      },
    },
    headCells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        textTransform: "uppercase" as const,
        letterSpacing: "0.05em",
      },
    },
    rows: {
      style: {
        minHeight: "56px",
        fontSize: "14px",
        "&:not(:last-of-type)": {
          borderBottom: "1px solid #e5e7eb",
        },
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        color: "#374151",
      },
    },
  };

  // Custom pagination component
  const CustomPagination = () => {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startItem = (currentPage - 1) * rowsPerPage + 1;
    const endItem = Math.min(currentPage * rowsPerPage, filteredData.length);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Showing {startItem} to {endItem} of {filteredData.length} results
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={rowsPerPage.toString()}
              onValueChange={(value) => handleRowsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="px-3 py-1 min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {searchable && (
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64"
                />
              </div>
            )}

            {exportable && onExport && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={paginatedData}
          progressPending={loading}
          progressComponent={<div className="p-8 text-center">Loading...</div>}
          selectableRows={selectableRows}
          onSelectedRowsChange={handleRowSelect}
          customStyles={customStyles}
          responsive
          noDataComponent={
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? "No results found for your search." : "No data available."}
            </div>
          }
        />
      </div>

      {/* Pagination */}
      {pagination && filteredData.length > 0 && <CustomPagination />}
    </div>
  );
};

export default ResponsiveDataTable;
