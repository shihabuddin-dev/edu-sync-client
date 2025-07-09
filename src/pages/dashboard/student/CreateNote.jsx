import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import { FaEnvelope, FaRegStickyNote, FaRegFileAlt } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';

const inputBase =
    "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";

const CreateNote = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            await axiosSecure.post('/notes', {
                email: user.email,
                title: data.title,
                description: data.description,
                created_at: new Date().toISOString(),
            });
            Swal.fire({
                icon: 'success',
                title: 'Note Created',
                text: 'Your note has been saved.',
                showConfirmButton: false,
                timer: 1500
            });
            reset();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Create Note',
                text: error.message || 'Something went wrong.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-base-100 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
                <MdNoteAdd className="text-primary text-3xl" /> Create a Note
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="email"
                            value={user?.email || ''}
                            readOnly
                            className={inputBase + ' cursor-not-allowed'}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <div className="relative">
                        <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="text"
                            {...register('title', { required: 'Title is required' })}
                            placeholder="Enter note title"
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
                            placeholder="Enter note description"
                            className={inputBase + ' min-h-[100px] pl-10'}
                        />
                    </div>
                    {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
                </div>
                <Button type="submit" className="w-full">Create Note</Button>
            </form>
        </div>
    );
};

export default CreateNote;