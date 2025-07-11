import React from 'react';
import { FaExclamationCircle, FaCommentDots } from 'react-icons/fa';
import { inputBase } from '../../utils/inputBase';
import Button from '../ui/Button';


const RejectSessionModal = ({ open, onClose, onReject, reason, setReason, feedback, setFeedback, loading }) => {
    if (!open) return null;
    return (
        <div className="modal modal-open">
            <div className="modal-box rounded-md w-full max-w-md md:max-w-lg lg:max-w-xl">
                <h3 className="font-bold text-lg mb-4 text-red-600">Reject Session</h3>
                <div className="form-control mb-4 flex flex-col gap-2">
                    <label className="label flex items-center gap-2">
                        <FaExclamationCircle className="text-red-500 text-lg" />
                        <span className="label-text">Rejection Reason <span className="text-red-500">*</span></span>
                    </label>
                    <input
                        type="text"
                        className={inputBase + ' rounded-md'}
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Enter reason for rejection"
                        required
                    />
                </div>
                <div className="form-control mb-4 flex flex-col gap-2">
                    <label className="label flex items-center gap-2">
                        <FaCommentDots className="text-blue-500 text-lg" />
                        <span className="label-text">Feedback (optional)</span>
                    </label>
                    <textarea
                        className={inputBase + ' rounded-md'}
                        value={feedback}
                        onChange={e => setFeedback(e.target.value)}
                        placeholder="Provide feedback for the tutor (optional)"
                        rows={3}
                    />
                </div>
                <div className="modal-action flex flex-col md:flex-row gap-2 md:gap-4">
                    <button
                        className="btn btn-sm btn-error rounded-md w-full md:w-auto"
                        disabled={!reason.trim() || loading}
                        onClick={onReject}
                    >
                        Reject
                    </button>
                    <Button variant='none' className="btn btn-sm" onClick={onClose} disabled={loading}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default RejectSessionModal; 