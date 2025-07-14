import React, { useState, useEffect, useRef } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import {
    FaUsers,
    FaSearch,
    FaEdit,
    FaUser,
    FaEnvelope,
    FaIdBadge,
    FaCheck,
    FaTimes,
    FaEye,
    FaInfoCircle,
    FaCalendarAlt,
    FaCog,
    FaImage
} from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import { inputBase } from '../../../utils/inputBase';
import { useNavigate } from 'react-router';
import AllUsersPagination from '../../../components/paginations/AllUsersPagination';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const initialLoad = useRef(true);
    const navigate = useNavigate();
    const USERS_PER_PAGE = 5;

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch paginated users with search and role filter
    const { data: usersData = { users: [], totalPages: 1, totalItems: 0 }, refetch, isLoading } = useQuery({
        queryKey: ['users', debouncedSearchTerm, roleFilter, currentPage],
        queryFn: async () => {
            let params = `?page=${currentPage}&limit=${USERS_PER_PAGE}`;
            if (debouncedSearchTerm) params += `&search=${encodeURIComponent(debouncedSearchTerm)}`;
            if (roleFilter !== 'all') params += `&role=${roleFilter}`;
            const res = await axiosSecure.get(`/users${params}`);
            return res.data;
        }
    });

    useEffect(() => {
        setTotalPages(usersData.totalPages || 1);
    }, [usersData.totalPages]);

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

    // Pagination controls
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return <span className="badge badge-error badge-sm rounded gap-1"><FaIdBadge /> Admin</span>;
            case 'tutor':
                return <span className="badge badge-primary badge-sm rounded gap-1"><FaIdBadge /> Tutor</span>;
            case 'student':
                return <span className="badge badge-success badge-sm rounded gap-1"><FaIdBadge /> Student</span>;
            default:
                return <span className="badge badge-neutral badge-sm rounded gap-1"><FaIdBadge /> Student</span>;
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeading icon={FaUsers} title='All Users' />

            {/* Search and Filter Section */}
            <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
                        <div className="relative flex-1 max-w-md w-full">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={inputBase}
                            />
                        </div>

                        {/* Role Filter */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                            <span className="text-sm font-medium text-base-content/70 whitespace-nowrap">Filter by Role:</span>
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="border-b-2 border-base-content/30 px-3 py-2 rounded-none focus:outline-none focus:ring-0 focus:border-secondary transition duration-300 bg-transparent text-base-content w-full sm:w-auto"
                            >
                                <option value="all" className="text-black">All Roles</option>
                                <option value="student" className="text-black">Student</option>
                                <option value="tutor" className="text-black">Tutor</option>
                                <option value="admin" className="text-black">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-base-content/70 w-full lg:w-auto justify-center lg:justify-start">
                        <FaSearch className="text-base-content/50" />
                        <span>{usersData.totalItems} of {usersData.totalItems} user{usersData.totalItems !== 1 ? 's' : ''}</span>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            {usersData.users.length === 0 ? (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <FaInfoCircle className="text-6xl text-base-content/30 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No users found</h2>
                        <p className="text-base-content/70 mb-4">
                            {(debouncedSearchTerm || roleFilter !== 'all')
                                ? "No users match your search or filter criteria."
                                : "No users have been registered yet."
                            }
                        </p>
                        {(debouncedSearchTerm || roleFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setRoleFilter('all');
                                }}
                                className="btn btn-primary btn-sm"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">All Users</h3>
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <FaUsers />
                                <span>{usersData.totalItems} user{usersData.totalItems !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            {/* Table Head */}
                            <thead className="bg-base-200">
                                <tr>
                                    <th className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <FaImage className="text-primary" />
                                            Photo
                                        </div>
                                    </th>
                                    <th className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-primary" />
                                            User
                                        </div>
                                    </th>
                                    <th className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <FaEnvelope className="text-primary" />
                                            Email
                                        </div>
                                    </th>
                                    <th className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <FaIdBadge className="text-primary" />
                                            Role
                                        </div>
                                    </th>
                                    <th className="font-semibold text-center">
                                        <div className="flex items-center gap-2 justify-center">
                                            <FaCog className="text-primary" />
                                            Actions
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            {/* Table Body */}
                            <tbody>
                                {usersData.users.map((user) => (
                                    <tr key={user.email} className="hover:bg-base-50">
                                        <td>
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.name || user.displayName}
                                                    className="w-12 h-12 rounded-md object-cover border-2 border-primary"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-base-200 rounded-md flex items-center justify-center border-2 border-primary">
                                                    <FaUser className="text-primary" />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name || user.displayName || 'No Name'}
                                                </div>
                                                <div className="hidden md:flex items-center gap-1 text-xs text-base-content/70">
                                                    <FaCalendarAlt className="text-primary" />
                                                    <span>{user.created_at ? formatDate(user.created_at) : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <FaEnvelope className="text-primary text-sm" />
                                                <div className="text-sm">
                                                    {user.email?.length > 25 ? user.email.slice(0, 25) + '...' : user.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
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
                                                getRoleBadge(user.role)
                                            )}
                                        </td>

                                        <td>
                                            <div className="flex justify-center gap-2">
                                                {editingUser === user.email ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateRole(user.email)}
                                                            disabled={isUpdating}
                                                            className="btn btn-sm btn-success btn-outline"
                                                            title="Save changes"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="btn btn-sm btn-error btn-outline"
                                                            title="Cancel edit"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewUser(user._id)}
                                                            className="btn btn-sm btn-primary btn-outline"
                                                            title="View user info"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditRole(user)}
                                                            className="btn btn-sm btn-primary btn-outline"
                                                            title="Edit role"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewUser(user._id)}
                                                            className="btn btn-sm btn-info btn-outline"
                                                            title="View user info"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <AllUsersPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />

                    {/* Table Footer */}
                    <div className="bg-base-200 px-6 py-3 border-t border-base-300">
                        <div className="flex flex-wrap items-center justify-between text-sm text-base-content/70">
                            <span>Showing {usersData.users.length} of {usersData.totalItems} users</span>
                            <span>Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsers;