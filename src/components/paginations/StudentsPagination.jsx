import React from 'react';

const StudentsPagination = ({ page, setPage, totalPages }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-2 py-4 bg-base-100 border-t border-base-300">
            <button
                className="btn btn-sm btn-outline hover:btn-primary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
            >
                Previous
            </button>
            <span className="px-2 text-base-content/70">
                Page {page} of {totalPages} 
            </span>
            <button
                className="btn btn-sm btn-outline hover:btn-primary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default StudentsPagination;