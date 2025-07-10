import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const AllMaterials = () => {
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
      Swal.fire('Deleted!', 'Material has been deleted.', 'success');
      refetch();
    }
  });

  // Update material mutation
  const { mutate: updateMaterial } = useMutation({
    mutationFn: async ({ id, data }) => {
      await axiosSecure.put(`/materials/${id}`, data);
    },
    onSuccess: () => {
      Swal.fire('Updated!', 'Material has been updated.', 'success');
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Uploaded Materials</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-base-100 shadow rounded-lg">
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
                    <input
                      name="title"
                      value={editData.title}
                      onChange={handleEditChange}
                      className="input input-bordered"
                    />
                  ) : (
                    mat.title
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingId === mat._id ? (
                    <input
                      name="resourceLink"
                      value={editData.resourceLink}
                      onChange={handleEditChange}
                      className="input input-bordered"
                    />
                  ) : (
                    <a href={mat.resourceLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                  )}
                </td>
                <td className="py-2 px-4 flex gap-2 items-center">
                  {editingId === mat._id ? (
                    <>
                      <button className="btn btn-xs btn-success" onClick={() => handleEditSubmit(mat._id)}>Save</button>
                      <button className="btn btn-xs btn-ghost" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-xs btn-info" onClick={() => handleEdit(mat)}>Edit</button>
                      <button className="btn btn-xs btn-error" onClick={() => handleDelete(mat._id)}>Delete</button>
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

export default AllMaterials; 