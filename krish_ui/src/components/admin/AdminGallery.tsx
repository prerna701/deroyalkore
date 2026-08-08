import React, { useEffect, useRef, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import { resolveImageUrl } from '../../utils/resolveImageUrl';
import type { SiteGallery } from '../../types';

interface GalleryImageEntry {
    id: string;
    url: string;
    title: string;
    sortOrder: number;
    isNew?: boolean; // locally added, not yet saved
    previewUrl?: string; // blob URL for preview before upload
    file?: File;
}

const AdminGallery: React.FC = () => {
    const [gallery, setGallery] = useState<SiteGallery | null>(null);
    const [images, setImages] = useState<GalleryImageEntry[]>([]);
    const [meta, setMeta] = useState({ title: 'Clinical', titleSuffix: 'Gallery', subtitle: 'Experience The Luxury', note: 'World-Class Infrastructure - Advanced Skin Technology - Luxury Care' });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | ''; msg: string }>({ type: '', msg: '' });
    const fileRef = useRef<HTMLInputElement>(null);

    const showStatus = (type: 'success' | 'error' | 'info', msg: string) => {
        setStatus({ type, msg });
        setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
    };

    const load = async () => {
        try {
            const records = await apiClient.getGallerySections();
            const record: SiteGallery | undefined = Array.isArray(records) ? records[0] : undefined;
            if (record) {
                setGallery(record);
                setMeta({ title: record.title, titleSuffix: record.titleSuffix, subtitle: record.subtitle, note: record.note });
                setImages(record.images.map(img => ({ ...img, isNew: false })));
            }
        } catch {
            showStatus('error', 'Failed to load gallery');
        }
    };

    useEffect(() => { void load(); }, []);

    // Handle multiple file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const newEntries: GalleryImageEntry[] = files.map((file, i) => ({
            id: `new-${Date.now()}-${i}`,
            url: '',
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            sortOrder: images.length + i + 1,
            isNew: true,
            previewUrl: URL.createObjectURL(file),
            file,
        }));

        setImages(prev => [...prev, ...newEntries]);
        // reset input
        if (fileRef.current) fileRef.current.value = '';
    };

    const removeImage = (id: string) => {
        setImages(prev => {
            const entry = prev.find(img => img.id === id);
            if (entry?.previewUrl) URL.revokeObjectURL(entry.previewUrl);
            return prev.filter(img => img.id !== id);
        });
    };

    const updateTitle = (id: string, title: string) => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, title } : img));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Upload any new files first
            const newEntries = images.filter(img => img.isNew && img.file);
            let uploadedMap: Record<string, string> = {};

            if (newEntries.length > 0) {
                setUploading(true);
                showStatus('info', `Uploading ${newEntries.length} new image(s)...`);
                const files = newEntries.map(e => e.file!);
                const uploaded = await apiClient.uploadGalleryImages(files);
                // Map local id → server url
                newEntries.forEach((entry, i) => {
                    uploadedMap[entry.id] = uploaded[i]?.url || '';
                });
                setUploading(false);
            }

            // 2. Build final images array
            const finalImages = images.map((img, idx) => ({
                id: img.isNew ? `gallery-${Date.now()}-${idx}` : img.id,
                url: img.isNew ? (uploadedMap[img.id] || '') : img.url,
                title: img.title || 'Gallery Image',
                sortOrder: idx + 1,
            })).filter(img => img.url);

            // 3. Save gallery section
            const payload = { ...meta, images: finalImages };

            if (gallery) {
                await apiClient.updateGallerySection(gallery.id, payload);
            } else {
                await apiClient.createGallerySection(payload);
            }

            showStatus('success', 'Gallery saved successfully!');
            await load(); // reload to get clean state from server
        } catch (err: any) {
            showStatus('error', err.message || 'Failed to save gallery');
        } finally {
            setSaving(false);
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Clinic Gallery</h2>
                    <p className="text-sm text-gray-500 mt-1">Upload multiple images — they appear on the home page gallery section.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || uploading}
                    className="flex items-center gap-2 bg-[#6b472e] text-white px-5 py-2.5 rounded-lg font-bold hover:bg-[#5a3a24] disabled:opacity-50 transition-colors"
                >
                    {saving ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {uploading ? 'Uploading...' : 'Saving...'}
                        </>
                    ) : (
                        'Save Gallery'
                    )}
                </button>
            </div>

            {/* Status Banner */}
            {status.msg && (
                <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
                    status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                    status.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                    {status.msg}
                </div>
            )}

            {/* Gallery Metadata */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-widest">Section Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    {(['title', 'titleSuffix', 'subtitle', 'note'] as const).map(field => (
                        <label key={field} className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{field}</span>
                            <input
                                value={meta[field]}
                                onChange={e => setMeta(prev => ({ ...prev, [field]: e.target.value }))}
                                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6b472e]/30"
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[#6b472e]/30 rounded-xl p-10 text-center cursor-pointer hover:border-[#6b472e]/60 hover:bg-[#6b472e]/5 transition-all duration-200 bg-white"
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#6b472e]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#6b472e] text-3xl">add_photo_alternate</span>
                    </div>
                    <div>
                        <p className="font-bold text-[#6b472e]">Click to upload images</p>
                        <p className="text-xs text-gray-400 mt-1">Select multiple photos at once — JPG, PNG, WebP up to 8MB each</p>
                    </div>
                </div>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {/* Image Grid */}
            {images.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-700 text-sm">{images.length} image{images.length !== 1 ? 's' : ''}</h3>
                        <p className="text-xs text-gray-400">Edit titles below each image</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img) => (
                            <div key={img.id} className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                {/* Image Preview */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                                    <img
                                        src={img.isNew ? img.previewUrl : resolveImageUrl(img.url)}
                                        alt={img.title}
                                        className="w-full h-full object-contain"
                                    />
                                    {img.isNew && (
                                        <span className="absolute top-2 left-2 bg-[#6b472e] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                            New
                                        </span>
                                    )}
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                                {/* Title input */}
                                <div className="p-2">
                                    <input
                                        value={img.title}
                                        onChange={e => updateTitle(img.id, e.target.value)}
                                        placeholder="Image title"
                                        className="w-full text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#6b472e]/40"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-200">
                    <span className="material-symbols-outlined text-5xl block mb-2 opacity-30">photo_library</span>
                    <p className="text-sm">No images yet. Upload some above.</p>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
