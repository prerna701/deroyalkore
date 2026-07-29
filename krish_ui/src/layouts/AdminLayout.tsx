import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="w-64 bg-white border-r">
                {/* Sidebar content */}
                <div className="p-4 font-bold">Admin Panel</div>
            </aside>
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
