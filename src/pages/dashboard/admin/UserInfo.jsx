import React from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../../components/ui/Spinner';
import { FaUser, FaEnvelope, FaIdBadge, FaArrowLeft } from 'react-icons/fa';
import Button from '../../../components/ui/Button';

const UserInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['user', id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    if (isLoading) return <Spinner />;
    if (isError || !user) return (
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
            <div className="text-red-500 text-xl font-semibold mb-2">User not found</div>
            <div className="text-base-content/60">{error?.response?.data?.message || `No user found with id: ${id}`}</div>
        </div>
    );

    // DaisyUI badge color by role
    const roleBadge = {
        admin: 'badge badge-error rounded-md',
        tutor: 'badge badge-info rounded-md',
        student: 'badge badge-success rounded-md',
    }[user.role] || 'badge badge-neutral rounded-md';

    return (
        <div className="flex flex-col items-center justify-center px-4" data-aos="flip-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="1500">
            <Button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-2">
                <FaArrowLeft /> Back
            </Button>
            <div className="rounded-md w-full max-w-md bg-base-100 shadow-md border border-base-200">
                <div className="card-body items-center text-center">
                    <div className="avatar mb-4">
                        <div className="w-24 md:w-28 rounded-full border-2 border-primary">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.name || user.displayName}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <FaUser className="text-primary text-4xl" />
                                </div>
                            )}
                        </div>
                    </div>
                    <h2 className="card-title text-2xl font-bold text-primary mb-1">
                        {user.name || user.displayName || 'No Name'}
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                        <FaEnvelope className="text-base-content/70" />
                        <span className="text-base-content/80">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <FaIdBadge className="text-base-content/70" />
                        <span className={roleBadge + ' capitalize'}>{user.role || 'student'}</span>
                    </div>
                    <div className="divider my-2" />
                    <div className="flex flex-col gap-1 w-full">
                        <div className="text-sm text-base-content/60">
                            <span className="font-semibold">Created At:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                        <div className="text-sm text-base-content/60">
                            <span className="font-semibold">Last Login:</span> {user.last_log_in ? new Date(user.last_log_in).toLocaleDateString('en-GB') : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserInfo; 