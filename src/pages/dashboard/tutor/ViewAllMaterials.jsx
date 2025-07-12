import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { FaEdit, FaFolderOpen, FaTrash, FaRegStickyNote, FaLink, FaCheck, FaTimes } from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import { inputBase } from '../../../utils/inputBase';

const ViewAllMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', resourceLink: '' });

  // Fetch all materials uploaded by this tutor
  const { data: materials = [], refetch, isLoading } = useQuery({
    queryKey: ['materials', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?tutorEmail=${user.email}`);
      return res.data;
    }
  });

  // Delete material mutation
  const { mutate: deleteMaterial } = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/materials/${id}`);
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Material has been deleted.',
        showConfirmButton: false,
        timer: 1500
      });
      refetch();
    }
  });

  // Update material mutation
  const { mutate: updateMaterial } = useMutation({
    mutationFn: async ({ id, data }) => {
      await axiosSecure.put(`/materials/${id}`, data);
    },
    onSuccess: () => {
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Material has been updated.',
        showConfirmButton: false,
        timer: 1500
      });
      setEditingId(null);
      refetch();
    }
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this material!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMaterial(id);
      }
    });
  };

  const handleEdit = (material) => {
    setEditingId(material._id);
    setEditData({ title: material.title, resourceLink: material.resourceLink });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = (id) => {
    if (!editData.title || !editData.resourceLink) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }
    updateMaterial({ id, data: editData });
  };

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto p-4">
      <DashboardHeading icon={FaFolderOpen} title='My Uploaded Materials' />
      <div className="overflow-x-auto">
        <table className="min-w-full bg-base-100 shadow rounded-md">
          <thead>
            <tr className="bg-base-300/80 rounded-md">
              <th className="py-3 px-4 text-left font-semibold">Image</th>
              <th className="py-3 px-4 text-left font-semibold">Title</th>
              <th className="py-3 px-4 text-left font-semibold">Google Drive Link</th>
              <th className="py-3 px-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((mat) => (
              <tr key={mat._id} className="border-b border-base-content/10 hover:bg-base-200/50 transition">
                <td className="py-2 px-4">
                  <img src={mat.imageUrl} alt="Material" className="w-14 h-14 object-cover rounded-md border border-base-content/10 shadow-sm" />
                </td>
                <td className="py-2 px-4 font-medium text-base-content">
                  {editingId === mat._id ? (
                    <div className="relative">
                      <FaRegStickyNote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                      <input
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        className={inputBase}
                        placeholder="Enter title"
                      />
                    </div>
                  ) : (
                    mat.title.slice(0,15)
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingId === mat._id ? (
                    <div className="relative">
                      <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 text-lg" />
                      <input
                        name="resourceLink"
                        value={editData.resourceLink}
                        onChange={handleEditChange}
                        className={inputBase}
                        placeholder="Enter Google Drive link"
                      />
                    </div>
                  ) : (
                    <a href={mat.resourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2 mt-4 items-center">
                  {editingId === mat._id ? (
                    <>
                      <button onClick={() => handleEditSubmit(mat._id)}>
                        <FaCheck  className='text-green-500 text-lg' />
                      </button>
                      <button onClick={() => setEditingId(null)}>
                        <FaTimes className='text-red-500 text-lg'  />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(mat)}> <FaEdit className='text-green-500 text-xl' /></button>
                      <button onClick={() => handleDelete(mat._id)}> <FaTrash className='cursor-pinter text-red-500' /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-base-content/60">No materials found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllMaterials; 