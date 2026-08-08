import React, { useState, useReducer, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

import { clearAdminSession, getStoredAdminSession, resolveAdminRole, saveAdminSession } from '../utils/adminAuth';

import { normalizeBeforeAfterCases } from '../services/beforeAfterService';
import { AdminTreatments } from '../components/admin/AdminTreatments';
import AdminFaqs from '../components/admin/AdminFaqs';
import AdminSiteContent from '../components/admin/AdminSiteContent';
import AdminGallery from '../components/admin/AdminGallery';

interface CaseForm {
    id: number;
    label: string;
    beforeFile: File | null;
    afterFile: File | null;
    treatmentIds: string[]; // New field for multiple treatments
}

type Action =
  | { type: 'ADD_CASE' }
  | { type: 'REMOVE_CASE'; id: number }
  | { type: 'UPDATE_CASE'; id: number; field: string; value: any }
  | { type: 'RESET_FORM' };

const createEmptyCase = (): CaseForm => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  label: '',
  beforeFile: null,
  afterFile: null,
  treatmentIds: [],
});

const initialCases: CaseForm[] = [createEmptyCase()];

function formReducer(state: CaseForm[], action: Action): CaseForm[] {
  switch (action.type) {
    case 'ADD_CASE':
      return [...state, createEmptyCase()];
    case 'REMOVE_CASE':
      return state.filter(c => c.id !== action.id);
    case 'UPDATE_CASE':
      return state.map(c => c.id === action.id ? { ...c, [action.field]: action.value } : c);
    case 'RESET_FORM':
      return [createEmptyCase()];
    default:
      return state;
  }
}

const AdminDashboard: React.FC = () => {
    const storedSession = getStoredAdminSession();
    const [token, setToken] = useState(storedSession?.token || '');
    const [isAdmin, setIsAdmin] = useState(Boolean(storedSession));
    const [isReady, setIsReady] = useState(Boolean(storedSession));
    // New state for treatments and existing cases
    const [treatments, setTreatments] = useState<any[]>([]);
    const [existingCases, setExistingCases] = useState<any[]>([]);
    const [editingCaseId, setEditingCaseId] = useState<string | null>(null);

    
    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Sidebar State
    const [activeTab, setActiveTab] = useState('before-after');
    const [appointments, setAppointments] = useState<any[]>([]);
    const [appointmentsLoading, setAppointmentsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Upload State
    const [cases, dispatch] = useReducer(formReducer, initialCases);
    const [status, setStatus] = useState('');
  

    const loadAppointments = async () => {
        setAppointmentsLoading(true);
        try {
            const data = await apiClient.getAppointments();
            setAppointments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setAppointmentsLoading(false);
        }
    };

    useEffect(() => {
        if (token && isAdmin) {
            // Fetch categories for the select dropdown
            apiClient.getBeforeAfterCases().then(payload => {
                dispatch({ type: 'RESET_FORM' });
            }).catch(console.error);
            // Fetch treatments for multi-select
            apiClient.getTreatments().then(tData => setTreatments(tData)).catch(console.error);
            // Fetch existing cases to display
            apiClient.getBeforeAfterCases().then(cData => {
                const normalized = normalizeBeforeAfterCases(cData);
                setExistingCases(normalized);
            }).catch(console.error);
        }
    }, [token, isAdmin]);

    useEffect(() => {
        if (token && isAdmin) {
            void loadAppointments();
        }
    }, [token, isAdmin]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setStatus('');
        try {
            const data = await apiClient.login({ email, password });
            const newToken = data.tokens?.access?.token || data.token;
            const role = resolveAdminRole(data, email, password);

            if (role !== 'admin') {
                clearAdminSession();
                setToken('');
                setIsAdmin(false);
                setIsReady(false);
                setLoginError('Only admin accounts can access this dashboard.');
                return;
            }

            saveAdminSession(newToken, email);
            setToken(newToken);
            setIsAdmin(true);
            setIsReady(true);
        } catch (err: any) {
            clearAdminSession();
            setToken('');
            setIsReady(true);
        }
    };

  // Handle upload for creating or updating before-after cases
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    // Validate that all cases have before and after images
    for (const c of cases) {
      if (!c.beforeFile || !c.afterFile) {
        setStatus('Please provide both before and after images for all cases.');
        return;
      }
    }

    try {
      const formData = new FormData();
      cases.forEach((c, idx) => {

        formData.append(`cases[${idx}][label]`, c.label);
        formData.append(`cases[${idx}][before]`, c.beforeFile as Blob);
        formData.append(`cases[${idx}][after]`, c.afterFile as Blob);
        c.treatmentIds.forEach((tid: string) => {
          formData.append(`cases[${idx}][treatmentIds][]`, tid);
        });
      });

      if (editingCaseId) {
        await apiClient.updateBeforeAfterCase(editingCaseId, formData);
      } else {
        await apiClient.uploadBeforeAfterCase(formData);
      }

      setStatus('Upload Success');
      // Refresh existing cases list
      const refreshed = await apiClient.getBeforeAfterCases();
      setExistingCases(normalizeBeforeAfterCases(refreshed));
      // Reset form
      dispatch({ type: 'RESET_FORM' });
      setEditingCaseId(null);
    } catch (err) {
      console.error(err);
      setStatus('Upload Error: ' + (err as any).message);
    }
  };


    if (!isReady || !token || !isAdmin) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>
                {loginError && <div className="text-red-500 mb-4">{loginError}</div>}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input 
                        type="email" 
                        placeholder="Admin Email"
                        className="border p-2 rounded"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="border p-2 rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="bg-[#6b472e] text-white p-2 rounded font-bold hover:bg-[#5a3a24]">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setIsSidebarOpen(false); // close drawer on mobile when navigating
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-90px)] bg-gray-50 relative">
            {/* Mobile Header Toggle Bar */}
            <div className="md:hidden flex items-center justify-between bg-[#2b2520] text-white p-4 sticky top-[64px] z-30 shadow-md">
                <span className="font-bold tracking-wide">Admin Panel</span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="flex items-center justify-center p-2 rounded-lg bg-[#3a312a] hover:bg-[#4a3f36] text-[#EADBCA] transition-colors"
                >
                    <span className="material-symbols-outlined">{isSidebarOpen ? 'close' : 'menu'}</span>
                </button>
            </div>

            {/* Backdrop Overlay for Mobile Drawer */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    style={{ top: '110px' }}
                />
            )}

            {/* Sidebar (Responsive: sliding drawer on mobile, fixed side block on desktop) */}
            <div className={`
                fixed md:sticky top-[110px] md:top-[90px] left-0 h-[calc(100vh-110px)] md:h-[calc(100vh-90px)] w-64 bg-[#2b2520] text-white flex flex-col shrink-0 z-40 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="hidden md:block p-6 text-xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'dashboard' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'before-after' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('before-after')}
                    >
                        Before &amp; After
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'treatments' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('treatments')}
                    >
                        Treatments
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'appointments' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('appointments')}
                    >
                        Appointments
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'site-content' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('site-content')}
                    >
                        Site Content
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'gallery' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('gallery')}
                    >
                        Gallery Images
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'faqs' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => handleTabChange('faqs')}
                    >
                        FAQs
                    </button>
                </div>
                <div className="p-4 border-t border-gray-700">
                    <button 
                        onClick={() => { clearAdminSession(); setToken(''); setIsAdmin(false); setIsReady(false); }}
                        className="text-sm text-red-400 hover:text-red-300 w-full text-left p-2"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto relative w-full">
                {status && (
                    <div className="fixed top-4 right-4 bg-gray-800 text-white p-4 rounded shadow-lg z-50 animate-fade-in-up flex items-center gap-3">
                        {status.includes('Uploading') ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : status.includes('Success') ? (
                            <span className="material-symbols-outlined text-green-400">check_circle</span>
                        ) : (
                            <span className="material-symbols-outlined text-red-400">error</span>
                        )}
                        <span className="font-medium">{status}</span>
                    </div>
                )}

                {activeTab === 'dashboard' && (
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, Admin</h2>
                        <p className="text-gray-600 mb-8">Select a module from the sidebar to manage content.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('before-after')}>
                                <span className="material-symbols-outlined text-4xl text-[#D9A577] mb-3">compare</span>
                                <h3 className="text-xl font-bold text-gray-800">Before &amp; After</h3>
                                <p className="text-sm text-gray-500 mt-2">Manage success stories and transformations.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('treatments')}>
                                <span className="material-symbols-outlined text-4xl text-[#D9A577] mb-3">spa</span>
                                <h3 className="text-xl font-bold text-gray-800">Treatments</h3>
                                <p className="text-sm text-gray-500 mt-2">Manage clinic treatments and protocols.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('faqs')}>
                                <span className="material-symbols-outlined text-4xl text-[#D9A577] mb-3">quiz</span>
                                <h3 className="text-xl font-bold text-gray-800">FAQs</h3>
                                <p className="text-sm text-gray-500 mt-2">Manage public FAQs for the website.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('site-content')}>
                                <span className="material-symbols-outlined text-4xl text-[#D9A577] mb-3">web</span>
                                <h3 className="text-xl font-bold text-gray-800">Site Content</h3>
                                <p className="text-sm text-gray-500 mt-2">Manage about, contact, and clinic gallery sections.</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('appointments')}>
                                <span className="material-symbols-outlined text-4xl text-[#D9A577] mb-3">calendar_month</span>
                                <h3 className="text-xl font-bold text-gray-800">Appointments</h3>
                                <p className="text-sm text-gray-500 mt-2">View and manage client appointment requests.</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeTab === 'treatments' && (
                    <AdminTreatments />
                )}

                {activeTab === 'faqs' && (
                    <AdminFaqs />
                )}

                {activeTab === 'site-content' && (
                    <AdminSiteContent />
                )}

                {activeTab === 'gallery' && (
                    <AdminGallery />
                )}

                {activeTab === 'appointments' && (
                    <div className="max-w-6xl bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Appointment Requests</h2>
                            <button onClick={() => void loadAppointments()} className="rounded-full border border-[#E7D8BF] px-4 py-2 text-sm font-semibold text-[#3A2D23]">Refresh</button>
                        </div>
                        {appointmentsLoading ? <p className="text-gray-500">Loading appointments...</p> : appointments.length === 0 ? <p className="text-gray-500">No appointment requests yet.</p> : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Client</th>
                                            <th className="px-4 py-3 text-left">Phone</th>
                                            <th className="px-4 py-3 text-left">Treatment</th>
                                            <th className="px-4 py-3 text-left">Preferred Slot</th>
                                            <th className="px-4 py-3 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {appointments.map((appointment) => (
                                            <tr key={appointment.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold text-gray-900">{appointment.name}</div>
                                                    <div className="text-gray-500">{appointment.email}</div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">{appointment.phone}</td>
                                                <td className="px-4 py-3 text-gray-700">{appointment.treatmentName || appointment.treatmentId}</td>
                                                <td className="px-4 py-3 text-gray-700">{appointment.preferredDate} · {appointment.preferredTime}</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-[#F2E9D8] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#3A2D23]">{appointment.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'before-after' && (
                    <div className="max-w-4xl bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Upload Before &amp; After Cases</h2>
                        </div>
                        
                        {status && (
                            <div className={`mb-6 p-4 rounded ${status.includes('Error') || status.includes('failed') || status.includes('Please provide') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                {status}
                            </div>
                        )}
                        
                        <form onSubmit={handleUpload} className="flex flex-col gap-6">
                            
                            {cases.map((c, index) => (
                                <div key={c.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative">
                                    <h3 className="font-bold text-gray-700 mb-4">Case #{index + 1}</h3>
                                    {cases.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => dispatch({ type: 'REMOVE_CASE', id: c.id })}
                                            className="absolute top-6 right-6 text-red-500 text-sm hover:underline font-medium"
                                        >
                                            Remove
                                        </button>
                                    )}
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                                            <select
                                                value={c.treatmentIds[0] || ''}
                                                onChange={e => {
                                                    const selectedId = e.target.value;
                                                    const selectedTreatment = treatments.find((t: any) => (t.id || t._id) === selectedId);
                                                    const treatmentTitle = selectedTreatment?.title || selectedTreatment?.name || '';
                                                    dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'treatmentIds', value: selectedId ? [selectedId] : [] });
                                                    dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'label', value: treatmentTitle });
                                                }}
                                                className="w-full border border-gray-300 p-2 rounded focus:ring-[#6b472e] focus:border-[#6b472e]"
                                                required
                                            >
                                                <option value="">Select a treatment...</option>
                                                {treatments.map((t: any) => (
                                                    <option key={t.id || t._id} value={t.id || t._id}>{t.title || t.name || t.id || t._id}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Before Image</label>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'beforeFile', value: e.target.files ? e.target.files[0] : null })}
                                                className="w-full border border-gray-300 p-2 rounded bg-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">After Image</label>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'afterFile', value: e.target.files ? e.target.files[0] : null })}
                                                className="w-full border border-gray-300 p-2 rounded bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-4 border-t pt-6">
                                <button 
                                    type="button" 
                                    onClick={() => dispatch({ type: 'ADD_CASE' })}
                                    className="px-4 py-2 border-2 border-[#6b472e] text-[#6b472e] rounded font-bold hover:bg-[#f9f5f0] transition-colors"
                                >
                                    + Add Another Case
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className="px-8 py-2 bg-[#6b472e] text-white rounded font-bold hover:bg-[#5a3a24] transition-colors shadow-md"
                                >
                                    Submit All Cases
                                </button>
                            </div>
                        </form>
                        
                        {/* Existing Cases List */}
                        {existingCases.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Existing Before & After Cases</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {existingCases.map((caseItem) => (
                                        <div key={caseItem._id} className="p-4 border border-gray-200 rounded bg-white flex justify-between items-center">
                                            <div>
                                                <div className="font-semibold">{caseItem.label}</div>
                        
                                            </div>
                                            <div className="flex items-center">
                                                <button
                                                    onClick={() => {
                                                        setEditingCaseId(caseItem._id);
                                                        // Reset form to edit mode with existing data
                                                        dispatch({ type: 'RESET_FORM' });
                                                        // After resetting, update fields (using setTimeout to wait for state)
                                                        setTimeout(() => {
                                                            const newId = cases[0]?.id;
                                                            if (newId) {
                                                                dispatch({ type: 'UPDATE_CASE', id: newId, field: 'label', value: caseItem.label });

                                                                dispatch({ type: 'UPDATE_CASE', id: newId, field: 'treatmentIds', value: caseItem.treatmentIds || [] });
                                                            }
                                                        }, 0);
                                                    }}
                                                    className="text-blue-600 hover:underline mr-4">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        await apiClient.deleteBeforeAfterCase(caseItem._id);
                                                        const refreshed = await apiClient.getBeforeAfterCases();
                                                        setExistingCases(normalizeBeforeAfterCases(refreshed));
                                                    }}
                                                    className="text-red-600 hover:underline">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
            </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
