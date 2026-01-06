import React from 'react';

const MarkdownTable = ({ content, renderCell }) => {
    const rows = content.trim().split('\n').filter(row => row.trim() !== '');
    if (rows.length < 2) return <div className="whitespace-pre-wrap">{content}</div>;

    const headerRow = rows[0];
    const bodyRows = rows.slice(2);

    const parseRow = (row) => {
        return row.split('|').filter((cell, index, arr) => {
            if (index === 0 && cell.trim() === '') return false;
            if (index === arr.length - 1 && cell.trim() === '') return false;
            return true;
        }).map(cell => cell.trim());
    };

    const headers = parseRow(headerRow);
    if (!headerRow.includes('|')) return <div className="whitespace-pre-wrap">{content}</div>;

    return (
        <div className="overflow-x-auto my-4 rounded-xl border border-gray-200/50">
            <table className="markdown-table">
                <thead>
                    <tr>
                        {headers.map((header, i) => (
                            <th key={i}>{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {bodyRows.map((row, i) => {
                        if (row.match(/^[\s|:-]+$/)) return null;
                        const cells = parseRow(row);
                        return (
                            <tr key={i}>
                                {cells.map((cell, j) => (
                                    <td key={j}>{renderCell ? renderCell(cell) : cell}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default MarkdownTable;
