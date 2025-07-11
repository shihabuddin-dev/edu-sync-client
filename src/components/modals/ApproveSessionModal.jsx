import React, { useState } from 'react';
import { FaMoneyBillWave, FaDollarSign } from 'react-icons/fa';
import { inputBase } from '../../utils/inputBase';
import Button from '../ui/Button';

const ApproveSessionModal = ({ open, onClose, onApprove, isPaid, setIsPaid, amount, setAmount, loading }) => {
    const [touched, setTouched] = useState(false);
    const isInvalid = isPaid && (!amount || Number(amount) <= 0);
    if (!open) return null;
    return (
        <div className={`modal ${open ? 'modal-open' : ''}`}>
            <div className="modal-box rounded-md max-w-md">
                <h3 className="font-bold text-lg mb-2">Approve Session</h3>
                <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isPaid}
                            onChange={e => setIsPaid(e.target.checked)}
                            className="toggle toggle-primary"
                        />
                        <span>{isPaid ? 'Paid' : 'Free'} Session</span>
                    </label>
                </div>
                {isPaid && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Registration Fee</label>
                        <div className="relative">
                            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="number"
                                min={1}
                                value={amount}
                                onChange={e => { setAmount(e.target.value); setTouched(true); }}
                                onBlur={() => setTouched(true)}
                                className={inputBase + (isInvalid && touched ? ' border-error' : '')}
                                placeholder="Enter registration fee"
                                required
                            />
                        </div>
                        {isInvalid && touched && (
                            <span className="text-error text-xs">Registration fee must be greater than 0 for paid sessions.</span>
                        )}
                    </div>
                )}
                <div className="modal-action flex flex-col md:flex-row gap-2 md:gap-4">
                    <Button
                        className="btn btn-sm"
                        onClick={onApprove}
                        disabled={loading || isInvalid}
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