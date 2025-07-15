import React, { useState } from 'react';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import {
    FaLayerGroup,
    FaSearch,
    FaInfoCircle,
    FaTable,
    FaTh
} from 'react-icons/fa';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/ui/Spinner';
import Swal from 'sweetalert2';
import { inputBase } from '../../../utils/inputBase';
import MaterialsTable from './viewMaterials/MaterialsTable';
import MaterialsCard from './viewMaterials/MaterialsCard';

const AllMaterials = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

    // Fetch all materials
    const { data: materials = [], isLoading, refetch } = useQuery({
        queryKey: ['allMaterials'],
        queryFn: async () => {
            const res = await axiosSecure.get('/materials');
            return res.data;
        }
    });

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter materials based on search term
    const filteredMaterials = materials.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tutorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="space-y-6">
             <title>All Materials | Edu Sync</title>
            <DashboardHeading icon={FaLayerGroup} title='All Materials' />

            {/* Search and View Toggle Section */}
            <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
                        <div className="relative flex-1 max-w-md w-full">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                placeholder="Search materials by title, tutor email, or session ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={inputBase}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-base-content/70 w-full sm:w-auto justify-center sm:justify-start">
                            <FaSearch className="text-base-content/50" />
                            <span>{filteredMaterials.length} of {materials.length} materials</span>
                        </div>
                    </div>

                    {/* View Toggle Buttons */}
                    <div className="flex items-center gap-2 bg-base-200 rounded-md p-1 w-full lg:w-auto justify-center lg:justify-start">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'table'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-300'
                                }`}
                            title="Table View"
                        >
                            <FaTable className="text-lg" />
                        </button>
                        <button
                            onClick={() => setViewMode('card')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'card'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-300'
                                }`}
                            title="Card View"
                        >
                            <FaTh className="text-lg" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            {filteredMaterials.length === 0 ? (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <FaInfoCircle className="text-6xl text-base-content/30 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No materials found</h2>
                        <p className="text-base-content/70 mb-4">
                            {searchTerm
                                ? "No materials match your search criteria."
                                : "No materials have been uploaded yet."
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="btn btn-primary btn-sm"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                </div>
            ) : viewMode === 'table' ? (
                <MaterialsTable
                    filteredMaterials={filteredMaterials}
                    materials={materials}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    formatDate={formatDate}
                />
            ) : (
                <MaterialsCard
                    filteredMaterials={filteredMaterials}
                    materials={materials}
                    handleDelete={handleDelete}
                    isDeleting={isDeleting}
                    formatDate={formatDate}
                />
            )}
        </div>
    );
};

export default AllMaterials;