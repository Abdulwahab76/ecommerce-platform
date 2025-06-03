import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number; // Number of pages to show on either side of current
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
}) => {
    const generatePageNumbers = () => {
        const totalNumbers = siblingCount * 2 + 5;
        const totalBlocks = totalNumbers + 2; // for first/last & dots

        if (totalPages <= totalBlocks) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages: (number | string)[] = [];

        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

        const showLeftDots = leftSiblingIndex > 2;
        const showRightDots = rightSiblingIndex < totalPages - 2;

        if (!showLeftDots && showRightDots) {
            const leftRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => i + 1);
            pages.push(...leftRange, "...", totalPages);
        } else if (showLeftDots && !showRightDots) {
            const rightRange = Array.from({ length: 3 + 2 * siblingCount }, (_, i) => totalPages - (3 + 2 * siblingCount) + i + 1);
            pages.push(1, "...", ...rightRange);
        } else if (showLeftDots && showRightDots) {
            const middleRange = Array.from({ length: 2 * siblingCount + 1 }, (_, i) => leftSiblingIndex + i);
            pages.push(1, "...", ...middleRange, "...", totalPages);
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <nav className="flex justify-center mt-6">
            <ul className="inline-flex items-center space-x-1 text-sm">
                <li>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => onPageChange(currentPage - 1)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                    >
                        Prev
                    </button>
                </li>
                {pageNumbers.map((page, idx) =>
                    typeof page === "number" ? (
                        <li key={idx}>
                            <button
                                onClick={() => onPageChange(page)}
                                className={`px-3 py-1 rounded-md border ${page === currentPage ? "bg-gray-900 text-white" : ""
                                    }`}
                            >
                                {page}
                            </button>
                        </li>
                    ) : (
                        <li key={idx}>
                            <span className="px-3 py-1 text-gray-500">...</span>
                        </li>
                    )
                )}
                <li>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => onPageChange(currentPage + 1)}
                        className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
