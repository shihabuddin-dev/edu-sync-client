import React from 'react';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { FaLayerGroup, FaTrash, FaLink, FaIdBadge, FaEnvelope, FaImage } from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/ui/Spinner';
import Swal from 'sweetalert2';

const AllMaterials = () => {
    const axiosSecure = useAxiosSecure();
    // Fetch all materials
    const { data: materials = [], isLoading, refetch } = useQuery({
        queryKey: ['allMaterials'],
        queryFn: async () => {
            const res = await axiosSecure.get('/materials');
            return res.data;
        }
    });

    // Delete material mutation
    const { mutate: deleteMaterial, isLoading: isDeleting } = useMutation({
        mutationFn: async (id) => {
            await axiosSecure.delete(`/materials/${id}`);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Material has been removed.',
                showConfirmButton: false,
                timer: 1500
            });
            refetch();
        },
        onError: () => {
            Swal.fire('Error', 'Failed to delete material', 'error');
        }
    });

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently remove the material.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMaterial(id);
            }
        });
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <DashboardHeading icon={FaLayerGroup} title='All Materials' />
            {materials.length === 0 ? (
                <div className="text-center py-12 text-base-content/60 text-lg">No materials found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {materials.map(material => (
                        <div
                            key={material._id}
                            className="duration-500 transition hover:-translate-y-2 group card bg-base-100 shadow-md border border-base-200 rounded-lg overflow-hidden flex flex-col relative"
                        >
                            {/* Delete icon top-right */}
                            <button
                                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-error/50 border border-base-200 rounded-full p-2 shadow transition-colors duration-200"
                                onClick={() => handleDelete(material._id)}
                                disabled={isDeleting}
                                title="Remove Material"
                            >
                                <FaTrash className='text-red-500 text-lg' />
                            </button>
                            <div className="relative h-34 bg-base-200 flex items-center justify-center overflow-hidden">
                                {material.imageUrl ? (
                                    <img src={material.imageUrl} alt={material.title} className="object-cover w-full h-full rounded-md" />
                                ) : (
                                    <FaImage className="text-5xl text-base-content/30" />
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-2">
                                <div className="font-bold text-lg flex items-center gap-2">
                                    <FaLayerGroup className="text-primary" />
                                    {material.title}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-base-content/60">
                                    <FaEnvelope /> <span>Tutor:</span> <span className="font-semibold">{material.tutorEmail}</span>
                                </div>
                                {/* Session ID with icon, no badge background */}
                                <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
                                    <FaIdBadge />
                                    <span className="font-mono">{material.sessionId}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-base-content/60">
                                    <FaLink /> <a href={material.resourceLink} target="_blank" rel="noopener noreferrer" className="link link-primary break-all">Resource Link</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllMaterials;