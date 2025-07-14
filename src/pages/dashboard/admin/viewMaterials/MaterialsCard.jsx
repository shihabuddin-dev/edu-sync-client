import React from 'react';
import { 
    FaTrash, 
    FaImage, 
    FaFileAlt,
    FaExternalLinkAlt,
    FaCalendarAlt,
    FaEnvelope,
    FaIdBadge,
    FaTh
} from 'react-icons/fa';

const MaterialsCard = ({ 
    filteredMaterials, 
    materials, 
    handleDelete, 
    isDeleting, 
    formatDate 
}) => {
    return (
        <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6">
            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">All Materials</h3>
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <FaTh />
                    <span>{filteredMaterials.length} material{filteredMaterials.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredMaterials.map(material => (
                    <div
                        key={material._id}
                        className="group card bg-base-100 shadow-lg border border-base-300 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative"
                    >
                        {/* Delete Button */}
                        <button
                            className="absolute top-3 right-3 z-10 bg-base-100/90 hover:bg-error/20 border border-base-300 rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            onClick={() => handleDelete(material._id)}
                            disabled={isDeleting}
                            title="Delete Material"
                        >
                            <FaTrash className='text-error text-sm' />
                        </button>

                        {/* Image Section */}
                        <div className="relative h-38 bg-base-200 flex items-center justify-center overflow-hidden">
                            {material.imageUrl ? (
                                <img 
                                    src={material.imageUrl} 
                                    alt={material.title} 
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                                />
                            ) : (
                                <FaImage className="text-6xl text-base-content/30" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-base-300/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 space-y-3">
                            {/* Title */}
                            <div className="flex items-center gap-2">
                                <FaFileAlt className="text-primary text-sm flex-shrink-0" />
                                <h4 className="font-bold text-base-content line-clamp-2">
                                    {material.title}
                                </h4>
                            </div>

                            {/* Tutor Email */}
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <FaEnvelope className="text-primary flex-shrink-0" />
                                <span className="truncate">{material.tutorEmail}</span>
                            </div>

                            {/* Session ID */}
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <FaIdBadge className="text-primary flex-shrink-0" />
                                <span className="font-mono text-xs truncate">{material.sessionId}</span>
                            </div>

                            {/* Created Date */}
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <FaCalendarAlt className="text-primary flex-shrink-0" />
                                <span>{material.created_at ? formatDate(material.created_at) : 'N/A'}</span>
                            </div>

                            {/* Resource Link */}
                            <div className="flex items-center gap-2">
                                <FaExternalLinkAlt className="text-primary text-sm flex-shrink-0" />
                                <a 
                                    href={material.resourceLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-primary hover:text-primary-focus underline font-medium text-sm truncate"
                                >
                                    View Resource
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Card Footer */}
            <div className="mt-6 pt-4 border-t border-base-300">
                <div className="flex flex-wrap items-center justify-between text-sm text-base-content/70">
                    <span>Showing {filteredMaterials.length} of {materials.length} materials</span>
                    <span>Last updated: {new Date().toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
};

export default MaterialsCard;