import React from 'react';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { FaBullhorn, FaRegCommentDots, FaPaperPlane, FaImage, FaTag, FaUsers, FaExclamationCircle, FaLink, FaUpload, FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { inputBase } from '../../../utils/inputBase';
import Button from '../../../components/ui/Button';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { uploadImageToImgBB } from '../../../utils/uploadImageToImgBB';
import Swal from 'sweetalert2';

const categoryOptions = [
    { value: '', label: 'Select category' },
    { value: 'general', label: 'General' },
    { value: 'update', label: 'Update' },
    { value: 'event', label: 'Event' },
    { value: 'alert', label: 'Alert' },
];
const audienceOptions = [
    { value: '', label: 'All Users' },
    { value: 'students', label: 'Students' },
    { value: 'tutors', label: 'Tutors' },
    { value: 'admins', label: 'Admins' },
];
const priorityOptions = [
    { value: '', label: 'Normal' },
    { value: 'important', label: 'Important' },
    { value: 'featured', label: 'Featured' },
];

const Announcements = () => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef();

    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const onSubmit = async (data) => {
        try {
            let imageUrl = '';
            if (image) {
                const uploadResult = await uploadImageToImgBB(image);
                if (uploadResult.success) {
                    imageUrl = uploadResult.url;
                } else {
                    throw new Error('Image upload failed');
                }
            }
            const announcementData = {
                title: data.title,
                message: data.message,
                category: data.category,
                audience: data.audience,
                priority: data.priority,
                link: data.link,
                imageUrl,
            };
            await axiosSecure.post('/announcements', announcementData);
            Swal.fire({ icon: 'success', title: 'Announcement created!' });
            reset();
            setImage(null);
            setImagePreview(null);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to create announcement' });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <title>Announcements | Edu Sync</title>
            <DashboardHeading icon={FaBullhorn} title='Create Announcement' />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-xl bg-base-100 shadow-md p-8 flex flex-col gap-6 border border-base-200"
            >
                {/* Title input with icon */}
                <div className="relative">
                    <FaBullhorn className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
                    <input
                        type="text"
                        className={inputBase + ' pl-10'}
                        {...register('title', { required: 'Title is required' })}
                        placeholder="Announcement title"
                    />
                </div>
                {errors.title && <span className="text-error text-xs">{errors.title.message}</span>}
                {/* Message textarea with icon */}
                <div className="relative">
                    <FaRegCommentDots className="absolute left-3 top-4 text-primary text-lg" />
                    <textarea
                        className={inputBase + ' pl-10 min-h-[120px] resize-none'}
                        {...register('message', { required: 'Message is required' })}
                        placeholder="Write your announcement here..."
                    />
                </div>
                {errors.message && <span className="text-error text-xs">{errors.message.message}</span>}
                {/* Image upload styled like SignUp */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-base-content">Image (optional)</label>
                    <div className="relative">
                        <FaUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary/80 file:cursor-pointer"
                        />
                    </div>
                    {imagePreview && (
                        <div className="mt-3 p-3 bg-base-200/50 rounded-md relative">
                            <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10" title="Remove image">
                                <FaTimes className="text-xs" />
                            </button>
                            <p className="text-xs text-base-content/70 mb-2">Preview:</p>
                            <div className="flex justify-center">
                                <img src={imagePreview} alt="Preview" className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-primary/20" />
                            </div>
                        </div>
                    )}
                </div>
                {/* Category select */}
                <div className="relative">
                    <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
                    <select
                        className={inputBase + ' pl-10'}
                        {...register('category')}
                    >
                        {categoryOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                {/* Audience select */}
                <div className="relative">
                    <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
                    <select
                        className={inputBase + ' pl-10'}
                        {...register('audience')}
                    >
                        {audienceOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className='text-black'>{opt.label}</option>
                        ))}
                    </select>
                </div>
                {/* Priority select */}
                <div className="relative">
                    <FaExclamationCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
                    <select
                        className={inputBase + ' pl-10'}
                        {...register('priority')}
                    >
                        {priorityOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className='text-black'>{opt.label}</option>
                        ))}
                    </select>
                </div>
                {/* Link input */}
                <div className="relative">
                    <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg" />
                    <input
                        type="url"
                        className={inputBase + ' pl-10'}
                        {...register('link')}
                        placeholder="Optional link (https://...)"
                    />
                </div>
                <Button type="submit" className="flex items-center text-xs md:text-base gap-2 w-full justify-center">
                    <FaPaperPlane />
                    Make Announcement
                </Button>
            </form>
        </div>
    );
};

export default Announcements;