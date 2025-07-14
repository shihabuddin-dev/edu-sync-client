import React from 'react';
import { 
    FaTrash, 
    FaImage, 
    FaSearch, 
    FaFileAlt,
    FaExternalLinkAlt,
    FaCalendarAlt,
    FaCog,
    FaTable,
    FaEnvelope,
    FaIdBadge
} from 'react-icons/fa';

const MaterialsTable = ({ 
    filteredMaterials, 
    materials, 
    handleDelete, 
    isDeleting, 
    formatDate 
}) => {
    return (
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
            {/* Table Header */}
            <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">All Materials</h3>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <FaTable />
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
                                    <FaEnvelope className="text-primary" />
                                    Tutor
                                </div>
                            </th>
                            <th className="font-semibold">
                                <div className="flex items-center gap-2">
                                    <FaIdBadge className="text-primary" />
                                    Session ID
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
                                            {material.imageUrl ? (
                                                <img 
                                                    src={material.imageUrl} 
                                                    alt="Material" 
                                                    className="w-12 h-12 object-cover rounded-md border-2 border-primary"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-base-200 rounded-md flex items-center justify-center">
                                                    <FaImage className="text-base-content/40" />
                                                </div>
                                            )}
                                            <FaImage className="absolute -top-1 -right-1 text-xs text-primary bg-base-100 rounded-full p-1" />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <FaFileAlt className="text-primary text-sm" />
                                        <div className="font-medium">
                                            {material.title?.length > 15 ? material.title.slice(0, 15) + '...' : material.title}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-primary text-sm" />
                                        <div className="text-sm">
                                            {material.tutorEmail?.length > 20 ? material.tutorEmail.slice(0, 20) + '...' : material.tutorEmail}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <FaIdBadge className="text-primary text-sm" />
                                        <div className="text-sm font-mono">
                                            {material.sessionId?.length > 10 ? material.sessionId.slice(0, 10) + '...' : material.sessionId}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <FaExternalLinkAlt className="text-primary text-sm" />
                                        <a 
                                            href={material.resourceLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-primary hover:text-primary-focus underline font-medium text-sm"
                                        >
                                            View Resource
                                        </a>
                                    </div>
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
                                        <button 
                                            onClick={() => handleDelete(material._id)}
                                            className="btn btn-sm btn-error btn-outline"
                                            title="Delete material"
                                            disabled={isDeleting}
                                        >
                                            <FaTrash />
                                        </button>
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
    );
};

export default MaterialsTable; 