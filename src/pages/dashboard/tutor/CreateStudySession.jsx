import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import { FaRegStickyNote, FaUser, FaEnvelope, FaRegFileAlt, FaCalendarAlt, FaClock, FaMoneyBillWave, FaInfoCircle, FaRegCalendarPlus } from 'react-icons/fa';
import { MdNoteAdd } from 'react-icons/md';

const inputBase =
  "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";

const CreateStudySession = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            await axiosSecure.post('/sessions', {
                title: data.title,
                tutorName: user.displayName || user.name,
                tutorEmail: user.email,
                description: data.description,
                registrationStart: data.registrationStart,
                registrationEnd: data.registrationEnd,
                classStart: data.classStart,
                classEnd: data.classEnd,
                duration: data.duration,
                registrationFee: 0,
                status: 'pending',
                created_at: new Date().toISOString(),
            });
            Swal.fire({
                icon: 'success',
                title: 'Session Created',
                text: 'Your study session has been created and is pending approval.',
                showConfirmButton: false,
                timer: 1500
            });
            reset();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Create Session',
                text: error.message || 'Something went wrong.',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-1 md:gap-2">
                <FaRegCalendarPlus className="text-primary md:text-3xl" /> Create Study Session
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Session Title</label>
                    <div className="relative">
                        <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="text"
                            {...register('title', { required: 'Session title is required' })}
                            placeholder="Enter session title"
                            className={inputBase}
                        />
                    </div>
                    {errors.title && <span className="text-error text-xs">{errors.title.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tutor Name</label>
                    <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="text"
                            value={user?.displayName || user?.name || ''}
                            readOnly
                            className={inputBase + ' cursor-not-allowed'}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tutor Email</label>
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
                    <label className="block text-sm font-medium mb-1">Session Description</label>
                    <div className="relative">
                        <FaRegFileAlt className="absolute left-3 top-4 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Enter session description"
                            className={inputBase + ' min-h-[100px] pl-10'}
                        />
                    </div>
                    {errors.description && <span className="text-error text-xs">{errors.description.message}</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Start Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                {...register('registrationStart', { required: 'Registration start date is required' })}
                                className={inputBase}
                            />
                        </div>
                        {errors.registrationStart && <span className="text-error text-xs">{errors.registrationStart.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration End Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                {...register('registrationEnd', { required: 'Registration end date is required' })}
                                className={inputBase}
                            />
                        </div>
                        {errors.registrationEnd && <span className="text-error text-xs">{errors.registrationEnd.message}</span>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Class Start Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                {...register('classStart', { required: 'Class start date is required' })}
                                className={inputBase}
                            />
                        </div>
                        {errors.classStart && <span className="text-error text-xs">{errors.classStart.message}</span>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Class End Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                {...register('classEnd', { required: 'Class end date is required' })}
                                className={inputBase}
                            />
                        </div>
                        {errors.classEnd && <span className="text-error text-xs">{errors.classEnd.message}</span>}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Session Duration</label>
                    <div className="relative">
                        <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="text"
                            {...register('duration', { required: 'Session duration is required' })}
                            placeholder="e.g. 2 hours, 3 weeks"
                            className={inputBase}
                        />
                    </div>
                    {errors.duration && <span className="text-error text-xs">{errors.duration.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Registration Fee</label>
                    <div className="relative">
                        <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="number"
                            value={0}
                            readOnly
                            className={inputBase + ' cursor-not-allowed'}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <div className="relative">
                        <FaInfoCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="text"
                            value="pending"
                            readOnly
                            className={inputBase + ' cursor-not-allowed'}
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full">Create Session</Button>
            </form>
        </div>
    );
};

export default CreateStudySession;