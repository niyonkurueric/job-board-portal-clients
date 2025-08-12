import React from 'react';

const DataTable = ({ columns, data, actions }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            {columns.map((col) => (
              <th key={col.key} className="py-2 px-3">{col.label}</th>
            ))}
            {actions && <th className="py-2 px-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="py-2 px-3">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="py-2 px-3 flex gap-2">
                  {actions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => action.onClick(row)}
                      className={action.className}
                      title={action.label}
                    >
                      {action.icon ? <action.icon className={action.iconClassName} /> : action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
