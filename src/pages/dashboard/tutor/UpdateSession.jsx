import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/ui/Spinner';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import {
    FaRegStickyNote, FaRegFileAlt, FaCalendarAlt, FaClock,
    FaMoneyBillWave, FaInfoCircle, FaRegCalendarPlus, FaChevronDown, FaUpload, FaTimes, FaImage, FaDollarSign
} from 'react-icons/fa';
import { inputBase } from '../../../utils/inputBase';
import { uploadImageToImgBB } from '../../../utils/uploadImageToImgBB';
import useUserRole from '../../../hooks/useUserRole';


const durationUnits = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
];

const UpdateSession = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    // Fetch session data
    const { data: session, isLoading } = useQuery({
        queryKey: ['session', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/sessions/${id}`);
            return res.data;
        }
    });

    // State for form fields
    const [form, setForm] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState('');
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { role, isLoading: roleLoading } = useUserRole();

    // Set form state when session loads
    useEffect(() => {
        if (session) {
            // Parse duration value and unit
            let durationValue = '';
            let durationUnit = 'hours';
            if (session.duration) {
                const [val, unit] = session.duration.split(' ');
                durationValue = val;
                durationUnit = unit || 'hours';
            }
            setForm({
                title: session.title || '',
                description: session.description || '',
                registrationStart: session.registrationStart || '',
                registrationEnd: session.registrationEnd || '',
                classStart: session.classStart || '',
                classEnd: session.classEnd || '',
                durationValue: durationValue,
                durationUnit: durationUnit,
                duration: session.duration || '',
                sessionImage: session.sessionImage || '',
                status: session.status || 'pending',
                paid: session.paid || false,
                registrationFee: session.registrationFee || 0,
            });
            setImagePreview(session.sessionImage || '');
        }
    }, [session]);

    // Mutation for updating session
    const { mutate: updateSession, isLoading: isUpdating } = useMutation({
        mutationFn: async (updatedData) => {
            await axiosSecure.put(`/sessions/${id}`, updatedData);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Session Updated',
                showConfirmButton: false,
                timer: 1200
            });
            // Redirect based on role
            if (role === 'admin') {
                navigate('/dashboard/admin/sessions');
            } else {
                navigate('/dashboard/tutor/sessions');
            }
        }
    });

    if (isLoading || roleLoading) return <Spinner />;
    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                <FaInfoCircle className="text-4xl text-error mb-4" />
                <h2 className="text-xl font-semibold mb-2">Session not found.</h2>
                <p className="text-base-content/70">The session you are looking for does not exist or has been deleted.</p>
            </div>
        );
    }
    if (!form) return <Spinner />;

    // Handlers
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'registrationFee') {
            setForm(prev => ({ ...prev, [name]: Number(value) }));
        } else if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDurationValueChange = (e) => {
        const value = e.target.value;
        const numValue = Number(value);
        if (numValue <= 0) return;
        const wholeNumber = Math.floor(numValue);
        setForm(prev => ({
            ...prev,
            durationValue: wholeNumber,
            duration: `${wholeNumber} ${form.durationUnit}`
        }));
    };

    const handleDurationUnitChange = (unit) => {
        setForm(prev => ({
            ...prev,
            durationUnit: unit,
            duration: `${form.durationValue} ${unit}`
        }));
        setIsDurationDropdownOpen(false);
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
        setImagePreview('');
        setForm(prev => ({ ...prev, sessionImage: '' }));
        setImageError('');
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        let imageURL = form.sessionImage;
        if (selectedImage) {
            const uploadResult = await uploadImageToImgBB(selectedImage);
            if (uploadResult.success) {
                imageURL = uploadResult.url;
            } else {
                setImageError(uploadResult.error || 'Image upload failed');
                setUploading(false);
                return;
            }
        }
        const updatedData = {
            ...form,
            registrationFee: form.paid ? Number(form.registrationFee) || 0 : 0,
            sessionImage: imageURL,
            duration: `${form.durationValue} ${form.durationUnit}`,
        };
        updateSession(updatedData);
        setUploading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-md shadow-md">
            <DashboardHeading icon={FaRegCalendarPlus} title='Update Study Session' />
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Session Title</label>
                    <div className="relative">
                        <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter session title"
                            className={inputBase}
                            required
                        />
                    </div>
                </div>
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Session Description</label>
                    <div className="relative">
                        <FaRegFileAlt className="absolute left-3 top-6 transform -translate-y-1/2 text-base-content/50 text-lg" />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Enter session description"
                            className={inputBase + ' min-h-[100px] pl-10'}
                            required
                        />
                    </div>
                </div>
                {/* Session Image */}
                <div>
                    <label className="block text-sm font-medium mb-1">Session Image</label>
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
                    {imageError && <span className="text-error text-xs">{imageError}</span>}
                    {imagePreview && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20 relative">
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
                                        className="w-20 h-20 object-cover rounded-lg border-2 border-primary/30 shadow-md"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Start Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                name="registrationStart"
                                min={today}
                                value={form.registrationStart}
                                onChange={handleChange}
                                className={inputBase}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration End Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                name="registrationEnd"
                                min={today}
                                value={form.registrationEnd}
                                onChange={handleChange}
                                className={inputBase}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Class Start Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                name="classStart"
                                min={today}
                                value={form.classStart}
                                onChange={handleChange}
                                className={inputBase}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Class End Date</label>
                        <div className="relative">
                            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="date"
                                name="classEnd"
                                min={today}
                                value={form.classEnd}
                                onChange={handleChange}
                                className={inputBase}
                                required
                            />
                        </div>
                    </div>
                </div>
                {/* Duration */}
                <div>
                    <label className="block text-sm font-medium mb-1">Session Duration</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            <input
                                type="number"
                                min="1"
                                step="1"
                                name="durationValue"
                                value={form.durationValue}
                                onChange={handleDurationValueChange}
                                className={inputBase}
                                required
                            />
                        </div>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-3 border-b-2 border-base-content/30 bg-transparent text-base-content hover:border-secondary transition duration-300 min-w-[120px]"
                            >
                                <span className="capitalize">{form.durationUnit}</span>
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
                </div>
                {/* Paid (editable for admin, read-only for tutor) */}
                <div>
                    <label className="block text-sm font-medium mb-1">Paid Session?</label>
                    <div className="flex items-center gap-2">
                        {role === 'admin' ? (
                            <input
                                type="checkbox"
                                name="paid"
                                checked={!!form.paid}
                                onChange={handleChange}
                                className="toggle toggle-primary"
                            />
                        ) : (
                            <input
                                type="checkbox"
                                checked={!!form.paid}
                                readOnly
                                className="toggle toggle-primary cursor-not-allowed"
                            />
                        )}
                        <span>{form.paid ? 'Paid' : 'Free'}</span>
                    </div>
                </div>
                {/* Registration Fee (only if paid) */}
                {form.paid && (
                    <div>
                        <label className="block text-sm font-medium mb-1">Registration Fee</label>
                        <div className="relative">
                            <FaMoneyBillWave className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                            {role === 'admin' ? (
                                <input
                                    type="number"
                                    name="registrationFee"
                                    value={form.registrationFee || 0}
                                    onChange={handleChange}
                                    className={inputBase}
                                    min={0}
                                    required
                                />
                            ) : (
                                <input
                                    type="number"
                                    value={form.registrationFee || 0}
                                    readOnly
                                    className={inputBase + ' cursor-not-allowed'}
                                />
                            )}
                        </div>
                    </div>
                )}
                <Button type="submit" className="w-full" disabled={uploading || isUpdating}>
                    {uploading || isUpdating ? (
                        <div className="flex justify-center items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating Session...
                        </div>
                    ) : (
                        "Update Session"
                    )}
                </Button>
            </form>
        </div>
    );
};

export default UpdateSession;