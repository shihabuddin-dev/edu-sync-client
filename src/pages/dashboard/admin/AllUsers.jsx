import React, { useState, useEffect, useRef } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { FaUsers, FaSearch, FaEdit, FaUser, FaEnvelope, FaIdBadge, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import { inputBase } from '../../../utils/inputBase';
import { useNavigate } from 'react-router';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const initialLoad = useRef(true);
    const navigate = useNavigate();

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch all users with search
    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['users', debouncedSearchTerm],
        queryFn: async () => {
            const params = debouncedSearchTerm ? `?search=${encodeURIComponent(debouncedSearchTerm)}` : '';
            const res = await axiosSecure.get(`/users${params}`);
            return res.data;
        }
    });

    // Update user role mutation
    const { mutate: updateUserRole, isLoading: isUpdating } = useMutation({
        mutationFn: async ({ email, role }) => {
            await axiosSecure.patch(`/users/${email}/role`, { role });
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Role Updated!',
                text: 'User role has been updated successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            setEditingUser(null);
            setSelectedRole('');
            refetch();
        },
        onError: (error) => {
            Swal.fire('Error', error.response?.data?.message || 'Failed to update role', 'error');
        }
    });

    // Only show full page spinner on initial load
    if (initialLoad.current && isLoading) {
        return <Spinner />;
    }
    initialLoad.current = false;

    const handleEditRole = (user) => {
        setEditingUser(user.email);
        setSelectedRole(user.role || 'student');
    };

    const handleUpdateRole = (email) => {
        if (!selectedRole) {
            Swal.fire('Error', 'Please select a role', 'error');
            return;
        }

        Swal.fire({
            title: 'Update Role?',
            text: `Are you sure you want to change this user's role to ${selectedRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!'
        }).then((result) => {
            if (result.isConfirmed) {
                updateUserRole({ email, role: selectedRole });
            }
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setSelectedRole('');
    };

    const handleViewUser = (_id) => {
        navigate(`/dashboard/admin/users/${_id}`);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-700 rounded-sm';
            case 'tutor': return 'bg-blue-100 text-blue-700 rounded-sm';
            case 'student': return 'bg-green-100 text-green-700 rounded-sm';
            default: return 'bg-gray-100 text-gray-700 rounded-sm';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <DashboardHeading icon={FaUsers} title='All Users' />

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={inputBase}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-100 rounded-md shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-base-300/80">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-base-content">User</th>
                                <th className="px-6 py-4 text-left font-semibold text-base-content">Email</th>
                                <th className="px-6 py-4 text-left font-semibold text-base-content">Role</th>
                                <th className="px-6 py-4 text-left font-semibold text-base-content">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-content/10">
                            {users.map((user) => (
                                <tr key={user.email} className="hover:bg-base-200/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.name || user.displayName}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <FaUser className="text-primary" />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-base-content">
                                                    {user.name || user.displayName || 'No Name'}
                                                </div>
                                                <div className="text-[10px] text-base-content/60">
                                                    Created At: {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'N/A'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-base-content/50" />
                                            <span className="text-base-content">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingUser === user.email ? (
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="border-b-2 border-base-content/30 py-1 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content placeholder:text-base-content/50"
                                            >
                                                <option value="student" className='text-black'>Student</option>
                                                <option value="tutor" className='text-black'>Tutor</option>
                                                <option value="admin" className='text-black'>Admin</option>
                                            </select>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleBadgeColor(user.role)}`}>
                                                <FaIdBadge className="mr-1" />
                                                {user.role || 'student'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {editingUser === user.email ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateRole(user.email)}
                                                    disabled={isUpdating}
                                                >
                                                    <FaCheck className="text-green-500" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                >
                                                    <FaTimes className="text-lg text-red-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewUser(user._id)}
                                                    title="View user info"
                                                >
                                                    <FaEye className="text-blue-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditRole(user)}
                                                >
                                                    <FaEdit className="text-lg text-green-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleViewUser(user._id)}
                                                    title="View user info"
                                                >
                                                    <FaEye className="text-lg text-blue-500" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-8 text-base-content/60">
                        {debouncedSearchTerm ? 'No users found matching your search.' : 'No users found.'}
                    </div>
                )}
            </div>
            {/* Summary */}
            <div className="mt-6 text-sm text-base-content/60">
                Total Users: {users.length}
            </div>
        </div>
    );
};

export default AllUsers;