'use client';

import { useState, useEffect } from 'react';

interface TableInsertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onInsert: (rows: number, cols: number, withHeaderRow: boolean, equalColumns: boolean) => void;
}

const MAX_ROWS = 10;
const MAX_COLS = 10;

export function TableInsertDialog({ isOpen, onClose, onInsert }: TableInsertDialogProps) {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [withHeaderRow, setWithHeaderRow] = useState(true);
    const [equalColumns, setEqualColumns] = useState(false);
    const [hoverRows, setHoverRows] = useState(0);
    const [hoverCols, setHoverCols] = useState(0);

    // Reset state when dialog opens
    useEffect(() => {
        if (isOpen) {
            setRows(3);
            setCols(3);
            setWithHeaderRow(true);
            setEqualColumns(false);
            setHoverRows(0);
            setHoverCols(0);
        }
    }, [isOpen]);

    const handleInsert = () => {
        onInsert(rows, cols, withHeaderRow, equalColumns);
        onClose();
    };

    const handleCellHover = (r: number, c: number) => {
        setHoverRows(r);
        setHoverCols(c);
    };

    const handleCellClick = (r: number, c: number) => {
        setRows(r);
        setCols(c);
    };

    const handleGridMouseLeave = () => {
        setHoverRows(0);
        setHoverCols(0);
    };

    // Determine which dimensions to show (hover takes precedence)
    const displayRows = hoverRows || rows;
    const displayCols = hoverCols || cols;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-card rounded-xl max-w-md w-full">
                {/* Header */}
                <div className="border-b border-border px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Insert Table</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Grid Selector */}
                    <div>
                        <label className="block text-sm font-medium mb-3">
                            Select Size: <span className="text-primary font-semibold">{displayRows} × {displayCols}</span>
                        </label>
                        <div
                            className="inline-grid gap-1 p-2 bg-muted/30 rounded-lg"
                            style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)` }}
                            onMouseLeave={handleGridMouseLeave}
                        >
                            {Array.from({ length: MAX_ROWS }).map((_, rowIndex) => (
                                Array.from({ length: MAX_COLS }).map((_, colIndex) => {
                                    const r = rowIndex + 1;
                                    const c = colIndex + 1;
                                    const isInHoverRange = hoverRows > 0 && r <= hoverRows && c <= hoverCols;
                                    const isInSelectedRange = r <= rows && c <= cols;
                                    const isActive = isInHoverRange || (!hoverRows && isInSelectedRange);

                                    return (
                                        <button
                                            key={`${r}-${c}`}
                                            type="button"
                                            className={`w-5 h-5 rounded-sm border transition-all ${
                                                isActive
                                                    ? 'bg-primary border-primary'
                                                    : 'bg-background border-border hover:border-primary/50'
                                            }`}
                                            onMouseEnter={() => handleCellHover(r, c)}
                                            onClick={() => handleCellClick(r, c)}
                                        />
                                    );
                                })
                            ))}
                        </div>
                    </div>

                    {/* Manual Input */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Rows
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={rows}
                                onChange={(e) => setRows(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                                Columns
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={20}
                                value={cols}
                                onChange={(e) => setCols(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                                className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="space-y-3">
                        {/* Header Row Option */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={withHeaderRow}
                                    onChange={(e) => setWithHeaderRow(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    withHeaderRow
                                        ? 'bg-primary border-primary'
                                        : 'border-border group-hover:border-primary/50'
                                }`}>
                                    {withHeaderRow && (
                                        <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm">Include header row</span>
                        </label>

                        {/* Equal Column Widths Option */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={equalColumns}
                                    onChange={(e) => setEqualColumns(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    equalColumns
                                        ? 'bg-primary border-primary'
                                        : 'border-border group-hover:border-primary/50'
                                }`}>
                                    {equalColumns && (
                                        <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <span className="text-sm">Equal column widths</span>
                        </label>
                    </div>

                    {/* Preview */}
                    <div className="bg-muted/30 rounded-lg p-3 overflow-auto">
                        <div className="text-xs text-muted-foreground mb-2">Preview</div>
                        <div
                            className="inline-grid gap-px bg-border rounded overflow-hidden"
                            style={{
                                gridTemplateColumns: `repeat(${Math.min(cols, 6)}, minmax(40px, 1fr))`,
                            }}
                        >
                            {Array.from({ length: Math.min(rows, 4) }).map((_, rowIndex) => (
                                Array.from({ length: Math.min(cols, 6) }).map((_, colIndex) => (
                                    <div
                                        key={`preview-${rowIndex}-${colIndex}`}
                                        className={`h-6 ${
                                            withHeaderRow && rowIndex === 0
                                                ? 'bg-muted/80'
                                                : 'bg-background'
                                        }`}
                                    />
                                ))
                            ))}
                        </div>
                        {(rows > 4 || cols > 6) && (
                            <div className="text-xs text-muted-foreground mt-1">
                                {rows > 4 && `+${rows - 4} more rows`}
                                {rows > 4 && cols > 6 && ', '}
                                {cols > 6 && `+${cols - 6} more columns`}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-border px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleInsert}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                        Insert Table
                    </button>
                </div>
            </div>
        </div>
    );
}
