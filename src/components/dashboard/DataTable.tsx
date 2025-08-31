import React from "react";
import ResponsiveDataTable from "@/components/common/ResponsiveDataTable";

const DataTable = ({ columns, data, actions, title = "Data Table" }) => {
  // Transform columns to work with react-data-table-component
  const transformedColumns = columns.map((col) => ({
    name: col.label,
    selector: (row: any) => row[col.key],
    sortable: true,
    cell: (row: any) => col.render ? col.render(row[col.key], row) : row[col.key],
    width: col.width || 'auto',
  }));

  // Add actions column if actions are provided
  if (actions && actions.length > 0) {
    transformedColumns.push({
      name: 'Actions',
      selector: () => null,
      sortable: false,
      cell: (row: any) => (
        <div className="flex gap-2">
          {actions
            .filter((action) => !action.shouldShow || action.shouldShow(row))
            .map((action, i) => (
              <button
                key={i}
                onClick={() => action.onClick(row)}
                className={action.className}
                title={action.label}
              >
                {action.icon ? (
                  <action.icon className={action.iconClassName} />
                ) : (
                  action.label
                )}
              </button>
            ))}
        </div>
      ),
      width: '120px',
    });
  }

  return (
    <ResponsiveDataTable
      columns={transformedColumns}
      data={data}
      title={title}
      searchable={true}
      pagination={true}
      selectableRows={false}
      loading={false}
      exportable={true}
      onExport={() => {
        // Export functionality can be implemented here
        console.log('Export clicked');
      }}
    />
  );
};

export default DataTable;
