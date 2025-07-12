import React from 'react';
import { FaEdit, FaRegStickyNote, FaRegFileAlt } from 'react-icons/fa';
import Button from '../ui/Button';

const EditNoteModal = ({ open, note, onClose, onUpdate, register, handleSubmit, errors, loading }) => {
    if (!open || !note) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-base-100 rounded-md shadow-lg p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-1 right-3 text-2xl font-black text-base-content/60 hover:text-error">&times;</button>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaEdit className="text-primary" /> Update Note</h3>
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <div className="relative">
                            <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="text"
                                {...register('title', { required: 'Title is required' })}
                                className="w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50"
                            />
                        </div>
                        {errors.title && <span className="text-error text-xs">{errors.title.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <div className="relative">
                            <FaRegFileAlt className="absolute left-3 top-6 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                className="w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50 min-h-[100px]"
                            />
                        </div>
                        {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Note'}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default EditNoteModal; 