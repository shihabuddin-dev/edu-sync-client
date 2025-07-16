import React from 'react';

const AdminAllStudyPagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    if (totalPages <= 1) return null;

    const handlePageClick = (page) => {
        if (page !== currentPage && page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // Generate page numbers (show up to 5 pages, with ... if needed)
    let pages = [];
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        if (currentPage <= 3) {
            pages = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage >= totalPages - 2) {
            pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            <button
                className="btn btn-xs btn-outline hover:btn-primary"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Prev
            </button>
            {pages.map((page, idx) =>
                page === '...'
                    ? <span key={idx} className="px-2 text-base-content/60">...</span>
                    : <button
                        key={page}
                        className={`btn btn-xs hover:btn-primary ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => handlePageClick(page)}
                        disabled={currentPage === page}
                    >
                        {page}
                    </button>
            )}
            <button
                className="btn btn-xs btn-outline hover:btn-primary"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
            <span className="ml-4 text-xs text-base-content/60">
                Page {currentPage} of {totalPages} | {totalItems} total
            </span>
        </div>
    );
};

export default AdminAllStudyPagination;