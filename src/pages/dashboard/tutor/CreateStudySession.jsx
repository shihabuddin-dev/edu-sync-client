import useAuth from '../../../hooks/useAuth';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import {
    FaRegStickyNote,
    FaUser,
    FaEnvelope,
    FaRegFileAlt,
    FaCalendarAlt,
    FaClock,
    FaMoneyBillWave,
    FaInfoCircle,
    FaRegCalendarPlus,
    FaChevronDown,
    FaUpload,
    FaTimes,
    FaImage
} from 'react-icons/fa';
import { useState } from 'react';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { uploadImageToImgBB } from '../../../utils/uploadImageToImgBB';
import { inputBase } from '../../../utils/inputBase';

// const inputBase =
//     "w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50";

const CreateStudySession = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm({
        mode: 'onChange',
    });

    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const [selectedDurationUnit, setSelectedDurationUnit] = useState('hours');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imageError, setImageError] = useState('');

    const today = new Date().toISOString().split('T')[0];

    const durationUnits = [
        { value: 'hours', label: 'Hours' },
        { value: 'days', label: 'Days' },
        { value: 'weeks', label: 'Weeks' },
        { value: 'months', label: 'Months' },
        { value: 'years', label: 'Years' },
    ];

    const handleDurationUnitChange = (unit) => {
        setSelectedDurationUnit(unit);
        setIsDurationDropdownOpen(false);
        const currentValue = watch('durationValue') || '';
        setValue('duration', currentValue ? `${currentValue} ${unit}` : '');
    };

    const handleDurationValueChange = (e) => {
        const value = e.target.value;
        const numValue = Number(value);

        if (numValue <= 0) {
            setValue('duration', '', { shouldValidate: true });
            return;
        }

        const wholeNumber = Math.floor(numValue);

        setValue('durationValue', wholeNumber, { shouldValidate: true });
        setValue('duration', `${wholeNumber} ${selectedDurationUnit}`, { shouldValidate: true });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImageError('');
        if (file) {
            if (!file.type.startsWith('image/')) {
                setImageError('Please select an image file.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setImageError('Image size should be less than 5MB.');
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setValue('sessionImage', null);
        setImageError('');
        const fileInput = document.querySelector('input[name="sessionImage"]');
        if (fileInput) fileInput.value = '';
    };


    //  Updated validation
    const validateDateLogic = (value, fieldName) => {
        if (!value) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(value);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return `${fieldName} cannot be in the past`;
        }

        return true;
    };

    const validateRegistrationEnd = (value) => {
        if (!value) return true;

        const registrationStart = watch('registrationStart');
        if (registrationStart && value <= registrationStart) {
            return 'Registration end date must be after registration start date';
        }

        return validateDateLogic(value, 'Registration end date');
    };

    const validateClassStart = (value) => {
        if (!value) return true;

        const registrationEnd = watch('registrationEnd');
        if (registrationEnd && value < registrationEnd) {
            return 'Class start date must be after or on registration end date';
        }

        return validateDateLogic(value, 'Class start date');
    };

    const validateClassEnd = (value) => {
        if (!value) return true;

        const classStart = watch('classStart');
        if (classStart && value <= classStart) {
            return 'Class end date must be after class start date';
        }

        return validateDateLogic(value, 'Class end date');
    };

    const onSubmit = async (data) => {
        if (!selectedImage) {
            setImageError('Please select a session image.');
            return;
        }

        setUploading(true);
        try {
            // Upload image to ImgBB
            const uploadResult = await uploadImageToImgBB(selectedImage);
            let imageURL = imagePreview;

            if (uploadResult.success) {
                imageURL = uploadResult.url;
            } else {
                throw new Error(uploadResult.error || 'Image upload failed');
            }

            await axiosSecure.post('/sessions', {
                title: data.title,
                tutorName: user.displayName || user.name,
                tutorEmail: user.email,
                tutorImage: user.photoURL || user.photoURL || '',
                description: data.description,
                sessionImage: imageURL,
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
            setSelectedDurationUnit('hours');
            setSelectedImage(null);
            setImagePreview(null);
            setImageError('');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Create Session',
                text: error.message || 'Something went wrong.',
                confirmButtonText: 'OK'
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
             <title>Create Study Session | Edu Sync</title>
            <DashboardHeading icon={FaRegCalendarPlus} title='Create Study Session' />
            
            <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
                    <h3 className="text-lg font-semibold text-base-content flex items-center gap-2">
                        <FaRegCalendarPlus className="text-primary" />
                        Session Information
                    </h3>
                    <p className="text-sm text-base-content/70 mt-1">Fill in the details below to create your study session</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                    <div className="border-b border-base-300 pb-4">
                        <h4 className="text-md font-semibold text-base-content mb-4 flex items-center gap-2">
                            <FaRegStickyNote className="text-primary" />
                            Basic Information
                        </h4>
                    </div>
                    
                    {/* Session Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-base-content/80">Session Title</label>
                        <div className="relative">
                            <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="text"
                                {...register('title', { required: 'Session title is required' })}
                                placeholder="Enter session title"
                                className={inputBase}
                            />
                        </div>
                        {errors.title && <span className="text-error text-xs mt-1 block">{errors.title.message}</span>}
                    </div>

                    {/* Tutor Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Tutor Name</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="text"
                                    value={user?.displayName || user?.name || ''}
                                    readOnly
                                    className={inputBase + ' cursor-not-allowed bg-base-200/50'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Tutor Email</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    readOnly
                                    className={inputBase + ' cursor-not-allowed bg-base-200/50'}
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Description Section */}
                <div className="space-y-6">
                    <div className="border-b border-base-300 pb-4">
                        <h4 className="text-md font-semibold text-base-content mb-4 flex items-center gap-2">
                            <FaRegFileAlt className="text-primary" />
                            Session Details
                        </h4>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2 text-base-content/80">Session Description</label>
                        <div className="relative">
                            <FaRegFileAlt className="absolute left-3 top-6 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <textarea
                                {...register('description', { required: 'Description is required' })}
                                placeholder="Enter session description"
                                className={inputBase + ' min-h-[100px] pl-10'}
                            />
                        </div>
                        {errors.description && <span className="text-error text-xs mt-1 block">{errors.description.message}</span>}
                    </div>

                </div>

                {/* Session Image Section */}
                <div className="space-y-6">
                    <div className="border-b border-base-300 pb-4">
                        <h4 className="text-md font-semibold text-base-content mb-4 flex items-center gap-2">
                            <FaImage className="text-primary" />
                            Session Image
                        </h4>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium mb-2 text-base-content/80">Upload Session Image</label>
                        <div className="relative">
                            <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="file"
                                name="sessionImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full border-b-2 border-base-content/30 px-4 py-3 pl-10 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-content hover:file:bg-primary/80 file:cursor-pointer"
                            />
                        </div>
                        {imageError && <span className="text-error text-xs mt-1 block">{imageError}</span>}
                        {imagePreview && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-md border border-primary/20 relative">
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg z-10"
                                    title="Remove image"
                                >
                                    <FaTimes className="text-xs" />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={imagePreview}
                                            alt="Session Preview"
                                            className="w-20 h-20 object-cover rounded-md border-2 border-primary/30 shadow-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-base-content mb-1">Session Image Preview</p>
                                        <p className="hidden md:inline text-xs text-base-content/70">
                                            {selectedImage?.name} • {(selectedImage?.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Schedule Section */}
                <div className="space-y-6">
                    <div className="border-b border-base-300 pb-4">
                        <h4 className="text-md font-semibold text-base-content mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-primary" />
                            Schedule & Duration
                        </h4>
                    </div>
                    
                    {/* Registration Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Registration Start Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="date"
                                    min={today}
                                    {...register('registrationStart', {
                                        required: 'Registration start date is required',
                                        validate: (value) => validateDateLogic(value, 'Registration start date')
                                    })}
                                    className={inputBase}
                                />
                            </div>
                            {errors.registrationStart && <span className="text-error text-xs mt-1 block">{errors.registrationStart.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Registration End Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="date"
                                    min={today}
                                    {...register('registrationEnd', {
                                        required: 'Registration end date is required',
                                        validate: validateRegistrationEnd
                                    })}
                                    className={inputBase}
                                />
                            </div>
                            {errors.registrationEnd && <span className="text-error text-xs mt-1 block">{errors.registrationEnd.message}</span>}
                        </div>
                    </div>

                    {/* Class Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Class Start Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="date"
                                    min={today}
                                    {...register('classStart', {
                                        required: 'Class start date is required',
                                        validate: validateClassStart
                                    })}
                                    className={inputBase}
                                />
                            </div>
                            {errors.classStart && <span className="text-error text-xs mt-1 block">{errors.classStart.message}</span>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Class End Date</label>
                            <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="date"
                                    min={today}
                                    {...register('classEnd', {
                                        required: 'Class end date is required',
                                        validate: validateClassEnd
                                    })}
                                    className={inputBase}
                                />
                            </div>
                            {errors.classEnd && <span className="text-error text-xs mt-1 block">{errors.classEnd.message}</span>}
                        </div>
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-base-content/80">Session Duration</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="number"
                                    min="1"
                                    step="1"
                                    {...register('durationValue', {
                                        required: 'Session duration is required',
                                        min: { value: 1, message: 'Duration must be at least 1' },
                                        validate: (value) => {
                                            if (value <= 0) return 'Duration must be greater than 0';
                                            if (!Number.isInteger(Number(value))) return 'Duration must be a whole number';
                                            return true;
                                        }
                                    })}
                                    placeholder="e.g. 2"
                                    onChange={handleDurationValueChange}
                                    className={inputBase}
                                />
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-3 border-b-2 border-base-content/30 bg-transparent text-base-content hover:border-secondary transition duration-300 min-w-[120px]"
                                >
                                    <span className="capitalize">{selectedDurationUnit}</span>
                                    <FaChevronDown className={`transition-transform duration-200 ${isDurationDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isDurationDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-content/20 rounded-md shadow-lg z-10 mt-1">
                                        {durationUnits.map((unit) => (
                                            <button
                                                key={unit.value}
                                                type="button"
                                                onClick={() => handleDurationUnitChange(unit.value)}
                                                className="w-full px-4 py-2 text-left hover:bg-base-200 transition duration-200 capitalize"
                                            >
                                                {unit.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <input
                            type="hidden"
                            {...register('duration')}
                        />
                        {errors.durationValue && <span className="text-error text-xs mt-1 block">{errors.durationValue.message}</span>}
                    </div>
                </div>

                {/* Final Details Section */}
                <div className="space-y-6">
                    <div className="border-b border-base-300 pb-4">
                        <h4 className="text-md font-semibold text-base-content mb-4 flex items-center gap-2">
                            <FaInfoCircle className="text-primary" />
                            Session Details
                        </h4>
                    </div>
                    
                    {/* Fee and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Registration Fee</label>
                            <div className="relative">
                                <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="number"
                                    value={0}
                                    readOnly
                                    className={inputBase + ' cursor-not-allowed bg-base-200/50'}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-base-content/80">Status</label>
                            <div className="relative">
                                <FaInfoCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                                <input
                                    type="text"
                                    value="pending"
                                    readOnly
                                    className={inputBase + ' cursor-not-allowed bg-base-200/50'}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? (
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Session...
                        </div>
                    ) : (
                        "Create Session"
                    )}
                </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateStudySession;