import React, { useState, useReducer, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { BeforeAfterCase } from '../types';
import { clearAdminSession, getStoredAdminSession, resolveAdminRole, saveAdminSession } from '../utils/adminAuth';
import { normalizeBeforeAfterCases } from '../services/beforeAfterService';
import { AdminTreatments } from '../components/admin/AdminTreatments';
import AdminFaqs from '../components/admin/AdminFaqs';
import AdminSiteContent from '../components/admin/AdminSiteContent';

interface CaseForm {
    id: number;
    category: string;
    isNewCategory: boolean;
    label: string;
    beforeFile: File | null;
    afterFile: File | null;
}

type Action = 
  | { type: 'ADD_CASE' }
  | { type: 'REMOVE_CASE'; id: number }
  | { type: 'UPDATE_CASE'; id: number; field: string; value: any }
  | { type: 'TOGGLE_NEW_CATEGORY'; id: number; isNew: boolean }
  | { type: 'RESET_FORM'; defaultIsNew: boolean; defaultCategory?: string };

const createEmptyCase = (isNewCategory = true, category = ''): CaseForm => ({
  id: Date.now() + Math.floor(Math.random() * 10000),
  category,
  isNewCategory,
  label: '',
  beforeFile: null,
  afterFile: null,
});

const initialCases: CaseForm[] = [createEmptyCase()];

function formReducer(state: CaseForm[], action: Action): CaseForm[] {
  switch (action.type) {
    case 'ADD_CASE':
      return [...state, createEmptyCase(state.length > 0 ? state[0].isNewCategory : true)];
    case 'REMOVE_CASE':
      return state.filter(c => c.id !== action.id);
    case 'UPDATE_CASE':
      return state.map(c => c.id === action.id ? { ...c, [action.field]: action.value } : c);
    case 'TOGGLE_NEW_CATEGORY':
      return state.map(c => c.id === action.id ? { ...c, isNewCategory: action.isNew, category: '' } : c);
    case 'RESET_FORM':
      return [createEmptyCase(action.defaultIsNew, action.defaultCategory || '')];
    default:
      return state;
  }
}

const AdminDashboard: React.FC = () => {
    const storedSession = getStoredAdminSession();
    const [token, setToken] = useState(storedSession?.token || '');
    const [isAdmin, setIsAdmin] = useState(Boolean(storedSession));
    const [isReady, setIsReady] = useState(Boolean(storedSession));
    
    // Login State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    // Sidebar State
    const [activeTab, setActiveTab] = useState('before-after');

    // Upload State
    const [cases, dispatch] = useReducer(formReducer, initialCases);
    const [status, setStatus] = useState('');
    const [existingCategories, setExistingCategories] = useState<string[]>([]);

    useEffect(() => {
        if (token && isAdmin) {
            // Fetch categories for the select dropdown
            apiClient.getBeforeAfterCases().then(payload => {
                const data = normalizeBeforeAfterCases(payload);
                const cats = Array.from(new Set(data.map((item: BeforeAfterCase) => item.category?.trim()).filter(Boolean))) as string[];
                setExistingCategories(cats);
                dispatch({
                    type: 'RESET_FORM',
                    defaultIsNew: cats.length === 0,
                    defaultCategory: cats[0] || '',
                });
            }).catch(console.error);
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
            setIsAdmin(false);
            setIsReady(false);
            setLoginError(err.message || 'Login failed');
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        for (let i = 0; i < cases.length; i++) {
            const c = cases[i];
            if (!c.category.trim() || !c.label.trim() || !c.beforeFile || !c.afterFile) {
                setStatus(`Please provide all fields for case #${i + 1}`);
                return;
            }
        }

        setStatus('Uploading...');
        
        try {
            // Upload sequentially
            for (const c of cases) {
                const formData = new FormData();
                formData.append('category', c.category.trim());
                formData.append('label', c.label.trim());
                formData.append('before', c.beforeFile!);
                formData.append('after', c.afterFile!);
                await apiClient.uploadBeforeAfterCase(formData);
            }
            setStatus('Success! All cases have been uploaded.');
            window.dispatchEvent(new Event('before-after-updated'));
            
            // Refresh categories
            const payload = await apiClient.getBeforeAfterCases();
            const data = normalizeBeforeAfterCases(payload);
            const cats = Array.from(new Set(data.map((item: BeforeAfterCase) => item.category?.trim()).filter(Boolean))) as string[];
            setExistingCategories(cats);
            
            dispatch({ type: 'RESET_FORM', defaultIsNew: cats.length === 0, defaultCategory: cats[0] || '' });

        } catch (err: any) {
            setStatus(err.message || 'Upload failed');
        }
    };

    useEffect(() => {
        if (storedSession?.token) {
            setToken(storedSession.token);
            setIsAdmin(true);
            setIsReady(true);
        }
    }, [storedSession?.token]);

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

    return (
        <div className="flex min-h-[calc(100vh-90px)] bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-[#2b2520] text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-gray-700">
                    Admin Panel
                </div>
                <div className="flex-1 p-4 flex flex-col gap-2">
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'dashboard' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'before-after' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => setActiveTab('before-after')}
                    >
                        Before &amp; After
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'treatments' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => setActiveTab('treatments')}
                    >
                        Treatments
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'site-content' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => setActiveTab('site-content')}
                    >
                        Site Content
                    </button>
                    <button 
                        className={`text-left p-3 rounded transition-colors ${activeTab === 'faqs' ? 'bg-[#4a3f36]' : 'hover:bg-[#3a312a]'}`}
                        onClick={() => setActiveTab('faqs')}
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
            <div className="flex-1 p-8 overflow-y-auto relative">
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
                                            <div className="flex justify-between items-end mb-1">
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                {c.isNewCategory ? (
                                                    <button type="button" onClick={() => dispatch({ type: 'TOGGLE_NEW_CATEGORY', id: c.id, isNew: false })} className="text-xs text-blue-600 hover:underline">Select Existing</button>
                                                ) : (
                                                    <button type="button" onClick={() => dispatch({ type: 'TOGGLE_NEW_CATEGORY', id: c.id, isNew: true })} className="text-xs text-blue-600 hover:underline">+ Add New Category</button>
                                                )}
                                            </div>
                                            {c.isNewCategory || existingCategories.length === 0 ? (
                                                <input 
                                                    type="text" 
                                                    value={c.category}
                                                    onChange={e => dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'category', value: e.target.value })}
                                                    className="w-full border border-gray-300 p-2 rounded focus:ring-[#6b472e] focus:border-[#6b472e]"
                                                    placeholder="Type new category..."
                                                    required
                                                />
                                            ) : (
                                                <select
                                                    value={c.category}
                                                    onChange={e => dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'category', value: e.target.value })}
                                                    className="w-full border border-gray-300 p-2 rounded focus:ring-[#6b472e] focus:border-[#6b472e]"
                                                    required
                                                >
                                                    <option value="" disabled>Select a category</option>
                                                    {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Case Label</label>
                                            <input 
                                                type="text" 
                                                value={c.label}
                                                onChange={e => dispatch({ type: 'UPDATE_CASE', id: c.id, field: 'label', value: e.target.value })}
                                                className="w-full border border-gray-300 p-2 rounded focus:ring-[#6b472e] focus:border-[#6b472e]"
                                                placeholder="e.g. Patient A or Severe Acne"
                                                required
                                            />
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
