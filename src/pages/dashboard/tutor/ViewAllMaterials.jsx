import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import {
  FaEdit,
  FaFolderOpen,
  FaTrash,
  FaRegStickyNote,
  FaLink,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaSearch,
  FaImage,
  FaFileAlt,
  FaExternalLinkAlt,
  FaCog,
  FaCalendarAlt
} from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import { inputBase } from '../../../utils/inputBase';

const ViewAllMaterials = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: '', resourceLink: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all materials uploaded by this tutor
  const { data: materials = [], refetch, isLoading } = useQuery({
    queryKey: ['materials', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/materials?tutorEmail=${user.email}`);
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
    material.resourceLink.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="space-y-6">
      <DashboardHeading icon={FaFolderOpen} title='My Uploaded Materials' />

      {/* Search Section */}
      <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
            <div className="relative flex-1 max-w-md w-full">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
              <input
                type="text"
                placeholder="Search materials by title or link..."
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

          {/* Right Side Design Element */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-center lg:justify-start">
            {/* Quick Stats */}
            <div className="flex items-center gap-3 bg-base-200 rounded-md px-4 py-2">
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-primary text-sm" />
                <span className="text-sm font-medium text-base-content/70">Total</span>
                <span className="text-sm font-bold text-primary">{materials.length}</span>
              </div>
              <div className="w-px h-4 bg-base-300"></div>
              <div className="flex items-center gap-2">
                <FaSearch className="text-primary text-sm" />
                <span className="text-sm font-medium text-base-content/70">Found</span>
                <span className="text-sm font-bold text-primary">{filteredMaterials.length}</span>
              </div>
            </div>

            {/* Clear Search Button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-sm btn-outline btn-primary"
                title="Clear search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <FaInfoCircle className="text-6xl text-base-content/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No materials found</h2>
            <p className="text-base-content/70 mb-4">
              {searchTerm
                ? "No materials match your search criteria."
                : "You haven't uploaded any materials yet."
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
      ) : (
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
          {/* Table Header */}
          <div className="bg-base-200 px-6 py-4 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">My Uploaded Materials</h3>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <FaSearch />
                <span>{filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}</span>
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
                      Material
                    </div>
                  </th>
                  <th className="font-semibold">
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-primary" />
                      Title
                    </div>
                  </th>
                  <th className="font-semibold">
                    <div className="flex items-center gap-2">
                      <FaExternalLinkAlt className="text-primary" />
                      Resource Link
                    </div>
                  </th>
                  <th className="font-semibold">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-primary" />
                      Created
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
                {filteredMaterials.map((material) => (
                  <tr key={material._id} className="hover:bg-base-50">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={material.imageUrl}
                            alt="Material"
                            className="w-12 h-12 object-cover rounded-md border-2 border-primary"
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      {editingId === material._id ? (
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
                        <div className="flex items-center gap-2">
                          <FaFileAlt className="text-primary text-sm" />
                          <div className="font-medium">
                            {material.title?.length > 15 ? material.title.slice(0, 15) + '...' : material.title}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {editingId === material._id ? (
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
                        <div className="flex items-center gap-2">
                          <FaExternalLinkAlt className="text-primary text-sm" />
                          <a
                            href={material.resourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-focus underline font-medium"
                          >
                            View Resource
                          </a>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary text-sm" />
                        <div className="text-sm">
                          {material.created_at ? formatDate(material.created_at) : 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center gap-2">
                        {editingId === material._id ? (
                          <>
                            <button
                              onClick={() => handleEditSubmit(material._id)}
                              className="btn btn-sm btn-success btn-outline"
                              title="Save changes"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="btn btn-sm btn-error btn-outline"
                              title="Cancel edit"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(material)}
                              className="btn btn-sm btn-primary btn-outline"
                              title="Edit material"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(material._id)}
                              className="btn btn-sm btn-error btn-outline"
                              title="Delete material"
                            >
                              <FaTrash />
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

          {/* Table Footer */}
          <div className="bg-base-200 px-6 py-3 border-t border-base-300">
            <div className="flex flex-wrap items-center justify-between text-sm text-base-content/70">
              <span>Showing {filteredMaterials.length} of {materials.length} materials</span>
              <span>Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllMaterials; 