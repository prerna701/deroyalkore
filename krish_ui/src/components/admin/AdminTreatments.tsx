import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTreatments } from '../../hooks/useTreatments';
import { apiClient } from '../../services/apiClient';
import { treatmentSchema, TreatmentFormValues, emptyTreatmentForm } from '../../schemas/treatmentSchema';

export const AdminTreatments: React.FC = () => {
    const { treatments, loading, refetch } = useTreatments();
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [editId, setEditId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<TreatmentFormValues>({
        resolver: zodResolver(treatmentSchema),
        defaultValues: emptyTreatmentForm,
    });

    const resetForm = () => {
        setEditId(null);
        setImageFile(null);
        reset(emptyTreatmentForm);
        setIsEditing(false);
    };

    const handleEdit = (t: any) => {
        setEditId(t._id);
        reset({
            title: t.title || '',
            about: t.about || '',
            sessions: t.sessions || '',
            price: t.price || '',
            duration: t.duration || '',
            protocol: t.protocol || '',
            bestFor: Array.isArray(t.bestFor) ? t.bestFor.join(', ') : '',
            benefits: Array.isArray(t.benefits) ? t.benefits.join(', ') : '',
        });
        setImageFile(null);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this treatment?')) return;
        try {
            await apiClient.deleteTreatment(id);
            refetch();
        } catch (err: any) {
            alert(err.message || 'Failed to delete');
        }
    };

    const onSubmit = async (values: TreatmentFormValues) => {
        if (!editId && !imageFile) {
            setStatus({ type: 'error', msg: 'An image file is required for new treatments.' });
            return;
        }

        setStatus({ type: 'info', msg: 'Saving...' });
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, val]) => {
                if (val !== undefined && val !== null) formData.append(key, String(val));
            });
            if (imageFile) {
                formData.append('image', imageFile);
            }

            if (editId) {
                await apiClient.updateTreatment(editId, formData);
            } else {
                await apiClient.createTreatment(formData);
            }
            
            setStatus({ type: 'success', msg: 'Success!' });
            resetForm();
            refetch();
            setTimeout(() => setStatus({ type: '', msg: '' }), 3000);
        } catch (err: any) {
            setStatus({ type: 'error', msg: err.message || 'Failed to save treatment' });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage Treatments</h2>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-[#6b472e] text-white px-4 py-2 rounded font-bold hover:bg-[#5a3a24]"
                    >
                        Add New Treatment
                    </button>
                )}
            </div>

            {status.msg && (
                <div className={`mb-4 p-3 rounded ${status.type === 'error' ? 'bg-red-100 text-red-800' : status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {status.msg}
                </div>
            )}

            {isEditing ? (
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{editId ? 'Edit Treatment' : 'Add Treatment'}</h3>
                        <button onClick={resetForm} className="text-gray-500 hover:text-gray-800">Cancel</button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                                <input {...register('title')} className={`w-full border p-2 rounded ${errors.title ? 'border-red-500' : ''}`} />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price</label>
                                <input {...register('price')} className="w-full border p-2 rounded" placeholder="e.g. 250.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Sessions</label>
                                <input {...register('sessions')} className="w-full border p-2 rounded" placeholder="e.g. 1-2 Sessions" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                                <input {...register('duration')} className="w-full border p-2 rounded" placeholder="e.g. 60 Mins" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">About (Short Description) *</label>
                            <textarea {...register('about')} className={`w-full border p-2 rounded h-24 ${errors.about ? 'border-red-500' : ''}`} />
                            {errors.about && <p className="text-red-500 text-xs mt-1">{errors.about.message}</p>}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Protocol</label>
                            <textarea {...register('protocol')} className="w-full border p-2 rounded h-32" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Best For (Comma separated)</label>
                                <input {...register('bestFor')} className="w-full border p-2 rounded" placeholder="Acne, Dull Skin, etc." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Benefits (Comma separated)</label>
                                <input {...register('benefits')} className="w-full border p-2 rounded" placeholder="Hydrates, Clears pores, etc." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Image {editId ? '(Leave blank to keep existing)' : '*'}</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setImageFile(e.target.files?.[0] || null)} 
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="mt-4 bg-[#6b472e] text-white py-3 rounded font-bold hover:bg-[#5a3a24] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Treatment'}
                        </button>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        <p>Loading treatments...</p>
                    ) : treatments.length === 0 ? (
                        <p className="text-gray-500">No treatments found.</p>
                    ) : (
                        treatments.map((t: any) => (
                            <div key={t._id} className="bg-white p-4 rounded-xl shadow border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {t.image && <img src={t.image} alt={t.title} className="w-16 h-16 object-cover rounded-lg" />}
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800">{t.title}</h4>
                                        <p className="text-sm text-gray-500">{t.price} | {t.duration}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold text-gray-700">Edit</button>
                                    <button onClick={() => handleDelete(t._id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-bold">Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
