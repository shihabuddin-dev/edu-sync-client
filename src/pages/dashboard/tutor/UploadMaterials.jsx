import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import { uploadImageToImgBB } from '../../../utils/uploadImageToImgBB';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { FaCloudUploadAlt, FaRegStickyNote, FaIdBadge, FaEnvelope, FaImage, FaLink } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

const inputBase =
    "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";

const UploadMaterials = () => {
    const { sessionId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        if (!data.image?.[0]) {
            Swal.fire('Error', 'Image is required', 'error');
            return;
        }
        setUploading(true);
        try {
            const result = await uploadImageToImgBB(data.image[0]);
            if (!result.success) throw new Error(result.error || 'Image upload failed');
            await axiosSecure.post('/materials', {
                title: data.title,
                sessionId,
                tutorEmail: user.email,
                imageUrl: result.url,
                resourceLink: data.resourceLink,
            });
            Swal.fire('Success', 'Material uploaded!', 'success');
            reset();
        } catch (error) {
            Swal.fire('Error', error.message || 'Failed to upload', 'error');
        }
        setUploading(false);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-base-100 rounded shadow">
            <DashboardHeading icon={FaCloudUploadAlt} title='Upload Material' />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <div className="relative">
                        <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            className={inputBase}
                            placeholder="Enter material title"
                            {...register('title', { required: 'Title is required' })}
                        />
                    </div>
                    {errors.title && <span className="text-error text-xs">{errors.title.message}</span>}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Study Session ID</label>
                    <div className="relative">
                        <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            className={inputBase + ' cursor-not-allowed'}
                            value={sessionId}
                            readOnly
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Tutor Email</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            className={inputBase + ' cursor-not-allowed'}
                            value={user.email}
                            readOnly
                        />
                    </div>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Image</label>
                    <div className="relative">
                        <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="file"
                            accept="image/*"
                            {...register('image', { required: 'Image is required' })}
                            className={inputBase + ' file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary/80 file:cursor-pointer'}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    {errors.image && <span className="text-error text-xs">{errors.image.message}</span>}
                </div>
                <div>
                    <label className="block mb-1 font-medium">Google Drive Link</label>
                    <div className="relative">
                        <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            className={inputBase}
                            placeholder="https://drive.google.com/..."
                            {...register('resourceLink', { required: 'Google Drive link is required' })}
                        />
                    </div>
                    {errors.resourceLink && <span className="text-error text-xs">{errors.resourceLink.message}</span>}
                </div>
                <button className="btn btn-primary w-full" type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload Material'}
                </button>
            </form>
        </div>
    );
};

export default UploadMaterials;