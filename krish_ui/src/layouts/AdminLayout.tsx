import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col">
            <Outlet />
        </div>
    );
};

export default AdminLayout;
