import React from 'react';

const DashboardHeading = ({ title, icon: Icon }) => {
    return (
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8 text-center flex flex-wrap items-center justify-center gap-2">
            {Icon && <Icon className="text-primary" />} {title}
        </h2>
    );
};

export default DashboardHeading;