import React from 'react';

const SectionTitle = ({ title, icon }) => {
    return (
        <div className="flex items-center gap-3 justify-center mb-4">
            {icon && <span className="text-primary text-2xl md:text-3xl">{icon}</span>}
            <h2 className="text-2xl md:text-3xl font-bold text-base-content relative inline-block">
                <span className="z-10 relative">{title}</span>
                {/* <span className="absolute left-0 -bottom-1 w-full h-2 bg-primary/20 rounded-md -z-0"></span> */}
            </h2>
        </div>
    );
};

export default SectionTitle;