import React from 'react';
import { FaMoneyBillWave, FaDollarSign } from 'react-icons/fa';
import { inputBase } from '../../utils/inputBase';
import Button from '../ui/Button';

const ApproveSessionModal = ({ open, onClose, onApprove, isPaid, setIsPaid, amount, setAmount, loading }) => {
    if (!open) return null;
    return (
        <div className="modal modal-open">
            <div className="modal-box rounded-md w-full max-w-md md:max-w-lg lg:max-w-xl">
                <h3 className="font-bold text-lg mb-4">Approve Session</h3>
                <div className="form-control mb-4 flex flex-col gap-2">
                    <label className="label cursor-pointer flex items-center gap-2">
                        <FaMoneyBillWave className="text-primary text-lg" />
                        <span className="label-text">Is this session paid?</span>
                        <input type="checkbox" className="toggle toggle-primary ml-2" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} />
                    </label>
                </div>
                {isPaid && (
                    <div className="form-control mb-4 flex flex-col gap-2">
                        <label className="label flex items-center gap-2">
                            <FaDollarSign className="text-green-600 text-lg" />
                            <span className="label-text">Amount</span>
                        </label>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-lg pointer-events-none">
                                <FaDollarSign />
                            </span>
                            <input
                                type="number"
                                className={inputBase + ' rounded-md pl-10'}
                                value={amount}
                                min={0}
                                onChange={e => setAmount(Number(e.target.value))}
                                placeholder="Enter amount"
                            />
                        </div>
                    </div>
                )}
                <div className="modal-action flex flex-col md:flex-row gap-2 md:gap-4">
                    <Button
                        className="btn btn-sm"
                        onClick={onApprove}
                        disabled={loading}
                    >
                        Approve
                    </Button>
                    <Button variant='none' className="btn btn-sm" onClick={onClose} disabled={loading}>Cancel</Button>
                </div>
            </div>
        </div>
    );
};

export default ApproveSessionModal; 