import React from 'react';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { FaBullhorn } from 'react-icons/fa';

const Announcements = () => {
    return (
        <div>
            <DashboardHeading icon={FaBullhorn} title='Announcements' />

        </div>
    );
};

export default Announcements;