import React, { useState } from 'react';
import { SearchIcon, ArrowUpRightIcon } from '../../Icons/Icons';

export const DataTable = ({
  columns = [],
  data = [],
  searchKey = '',
  searchPlaceholder = 'Search records...',
  onEdit,
  onDelete,
  customActions,
  emptyMessage = 'No records found.',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter((row) => {
    if (!searchQuery.trim()) return true;
    if (searchKey && row[searchKey]) {
      return String(row[searchKey]).toLowerCase().includes(searchQuery.toLowerCase());
    }
    // General fallback search across all object values
    return Object.values(row).some((val) =>
      typeof val === 'string' || typeof val === 'number'
        ? String(val).toLowerCase().includes(searchQuery.toLowerCase())
        : false
    );
  });

  return (
    <div className="admin-table-container">
      {/* Search Bar Toolbar */}
      <div className="admin-table-toolbar">
        <div className="admin-search-box">
          <SearchIcon size={16} className="admin-search-icon-pos" />
          <input
            type="text"
            className="admin-search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>
          Showing {filteredData.length} of {data.length} records
        </span>
      </div>

      {/* Table Area */}
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.header} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || customActions) && (
                <th style={{ width: '120px', textAlign: 'right' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, idx) => (
                <tr key={row.id || idx}>
                  {columns.map((col) => (
                    <td key={col.key || col.header}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete || customActions) && (
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions" style={{ justifyContent: 'flex-end' }}>
                        {customActions && customActions(row)}
                        {onEdit && (
                          <button
                            type="button"
                            className="admin-action-icon-btn btn-edit"
                            onClick={() => onEdit(row)}
                            title="Edit record"
                            aria-label="Edit record"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            className="admin-action-icon-btn btn-delete"
                            onClick={() => onDelete(row)}
                            title="Delete record"
                            aria-label="Delete record"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (onEdit || onDelete || customActions ? 1 : 0)}
                  className="admin-empty-table-state"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
