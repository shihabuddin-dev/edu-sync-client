import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import { FaTrash, FaEdit, FaRegStickyNote, FaRegFileAlt, FaEye } from 'react-icons/fa';
import { MdNoteAlt } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import ViewNoteModal from '../../../components/modals/ViewNoteModal';
import EditNoteModal from '../../../components/modals/EditNoteModal';


const ManageNotes = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [editingNote, setEditingNote] = useState(null);
    const [viewingNote, setViewingNote] = useState(null);
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

    const openViewModal = (note) => {
        setViewingNote(note);
    };

    const closeViewModal = () => {
        setViewingNote(null);
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
            <title>Manage Notes | Edu Sync</title>
            <DashboardHeading icon={MdNoteAlt} title='Manage Notes' />
            {notes.length === 0 ? (
                <div className="text-center text-base-content/70">No notes found.</div>
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {notes.map(note => (
                        <div key={note._id} className="p-4 bg-base-200/50 rounded shadow flex flex-col gap-2 relative">
                            <div className="flex items-center gap-2">
                                <FaRegStickyNote className="text-primary text-lg" />
                                <span className="font-semibold text-lg">{note.title.slice(0, 15)}</span>
                            </div>
                            <div className="flex items-center gap-2 overflow-x-hidden">
                                <FaRegFileAlt className="text-base-content/50 text-lg" />
                                <span className="text-base-content/80">{note.description.slice(0, 15)}</span>
                            </div>
                            <div className="flex gap-1 md:gap-2 mt-2">
                                <Button type="button" variant="primary" className='btn btn-sm' onClick={() => openViewModal(note)}>
                                    <FaEye className='text-[16px]' />
                                </Button>
                                <Button type="button" variant="outline" className="flex items-center gap-1 btn btn-sm" onClick={() => openEditModal(note)}>
                                    <FaEdit />
                                </Button>
                                <Button type="button" variant="danger" className="flex items-center gap-1 btn btn-sm" onClick={() => handleDelete(note._id)}>
                                    <FaTrash />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* View Modal */}
            <ViewNoteModal
                open={!!viewingNote}
                note={viewingNote}
                onClose={closeViewModal}
                onEdit={openEditModal}
            />
            {/* Edit Modal */}
            <EditNoteModal
                open={!!editingNote}
                note={editingNote}
                onClose={closeEditModal}
                onUpdate={onUpdate}
                register={register}
                handleSubmit={handleSubmit}
                errors={errors}
                loading={false}
            />
        </div>
    );
};

export default ManageNotes;