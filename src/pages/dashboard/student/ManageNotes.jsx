import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import { FaTrash, FaEdit, FaRegStickyNote, FaRegFileAlt } from 'react-icons/fa';
import { MdNoteAlt } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { inputBase } from '../../../utils/inputBase';

// const inputBase =
//     "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";

const ManageNotes = () => {
const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingNote, setEditingNote] = useState(null);
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();
    const { data: notes = [], refetch } = useQuery({
        queryKey: ['notes', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/notes?email=${user.email}`);
            return res.data;
        }
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this note!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });
        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/notes/${id}`);
                Swal.fire({ icon: 'success', title: 'Deleted!', showConfirmButton: false, timer: 1200 });
                refetch();
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Failed to delete', text: error.message || 'Something went wrong.' });
            }
        }
    };

    const openEditModal = (note) => {
        setEditingNote(note);
        setValue('title', note.title);
        setValue('description', note.description);
    };

    const closeEditModal = () => {
        setEditingNote(null);
        reset();
    };

    const onUpdate = async (data) => {
        try {
            await axiosSecure.patch(`/notes/${editingNote._id}`, {
                title: data.title,
                description: data.description,
            });
            Swal.fire({ icon: 'success', title: 'Note Updated', showConfirmButton: false, timer: 1200 });
            closeEditModal();
            refetch();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed to update', text: error.message || 'Something went wrong.' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-md shadow-md">
            <DashboardHeading icon={MdNoteAlt} title='Manage Notes' />
            {notes.length === 0 ? (
                <div className="text-center text-base-content/70">No notes found.</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {notes.map(note => (
                        <div key={note._id} className="p-4 bg-base-200/50 rounded shadow flex flex-col gap-2 relative">
                            <div className="flex items-center gap-2">
                                <FaRegStickyNote className="text-primary text-lg" />
                                <span className="font-semibold text-lg">{note.title}</span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-hidden">
                                <FaRegFileAlt className="text-base-content/50 text-lg" />
                                <span className="text-base-content/80">{note.description}</span>
                            </div>
                            <div className="flex gap-1 md:gap-2 mt-2">
                                <Button type="button" variant="outline" className="flex items-center gap-1 btn btn-sm" onClick={() => openEditModal(note)}>
                                    <FaEdit /> Update
                                </Button>
                                <Button type="button" variant="danger" className="flex items-center gap-1 btn btn-sm" onClick={() => handleDelete(note._id)}>
                                    <FaTrash /> Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Edit Modal */}
            {editingNote && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-base-100 rounded-md shadow-lg p-6 w-full max-w-md relative">
                        <button onClick={closeEditModal} className="absolute top-1 right-3 text-2xl font-black text-base-content/60 hover:text-error">&times;</button>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><FaEdit className="text-primary" /> Update Note</h3>
                        <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title</label>
                                <div className="relative">
                                    <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                    <input
                                        type="text"
                                        {...register('title', { required: 'Title is required' })}
                                        className={inputBase}
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
                                        className={inputBase + ' min-h-[100px] pl-10'}
                                    />
                                </div>
                                {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
                            </div>
                            <Button type="submit" className="w-full">Update Note</Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageNotes;