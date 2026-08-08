import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';
import type { SiteAbout, SiteContact, SiteGallery } from '../../types';

const splitLines = (value: string) => value.split('\n').map((item) => item.trim()).filter(Boolean);

const parseJsonArray = <T,>(value: string, fallback: T[]): T[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

const aboutEmpty = {
  badge: '',
  badgeLabel: '',
  tagline: '',
  titlePrefix: '',
  titleSuffix: '',
  paragraphs: '',
  buttonText: '',
  images: '',
};

const contactEmpty = {
  heading: '',
  address: '',
  phone: '',
  website: '',
  mapLink: '',
  timings: '[]',
};

const galleryEmpty = {
  title: '',
  titleSuffix: '',
  subtitle: '',
  note: '',
  images: '[]',
};

const AdminSiteContent: React.FC = () => {
  const [abouts, setAbouts] = useState<SiteAbout[]>([]);
  const [contacts, setContacts] = useState<SiteContact[]>([]);
  const [galleries, setGalleries] = useState<SiteGallery[]>([]);
  const [aboutForm, setAboutForm] = useState(aboutEmpty);
  const [contactForm, setContactForm] = useState(contactEmpty);
  const [galleryForm, setGalleryForm] = useState(galleryEmpty);
  const [selectedAboutId, setSelectedAboutId] = useState('');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [selectedGalleryId, setSelectedGalleryId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fillAboutForm = (record?: SiteAbout) => {
    setSelectedAboutId(record?.id || '');
    setAboutForm(record ? {
      badge: record.badge,
      badgeLabel: record.badgeLabel,
      tagline: record.tagline,
      titlePrefix: record.titlePrefix,
      titleSuffix: record.titleSuffix,
      paragraphs: record.paragraphs.join('\n'),
      buttonText: record.buttonText,
      images: record.images.join('\n'),
    } : aboutEmpty);
  };

  const fillContactForm = (record?: SiteContact) => {
    setSelectedContactId(record?.id || '');
    setContactForm(record ? {
      heading: record.heading,
      address: record.address,
      phone: record.phone,
      website: record.website,
      mapLink: record.mapLink,
      timings: JSON.stringify(record.timings, null, 2),
    } : contactEmpty);
  };

  const fillGalleryForm = (record?: SiteGallery) => {
    setSelectedGalleryId(record?.id || '');
    setGalleryForm(record ? {
      title: record.title,
      titleSuffix: record.titleSuffix,
      subtitle: record.subtitle,
      note: record.note,
      images: JSON.stringify(record.images, null, 2),
    } : galleryEmpty);
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      const [aboutRecords, contactRecords, galleryRecords] = await Promise.all([
        apiClient.getAboutSections(),
        apiClient.getContactSections(),
        apiClient.getGallerySections(),
      ]);

      const nextAbouts = Array.isArray(aboutRecords) ? aboutRecords : [];
      const nextContacts = Array.isArray(contactRecords) ? contactRecords : [];
      const nextGalleries = Array.isArray(galleryRecords) ? galleryRecords : [];
      setAbouts(nextAbouts);
      setContacts(nextContacts);
      setGalleries(nextGalleries);
      fillAboutForm(nextAbouts[0]);
      fillContactForm(nextContacts[0]);
      fillGalleryForm(nextGalleries[0]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load site content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadContent();
  }, []);

  const saveAbout = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...aboutForm,
      paragraphs: splitLines(aboutForm.paragraphs),
      images: splitLines(aboutForm.images),
    };

    try {
      if (selectedAboutId) {
        await apiClient.updateAboutSection(selectedAboutId, payload);
        setMessage('About section updated successfully.');
      } else {
        await apiClient.createAboutSection(payload);
        setMessage('About section created successfully.');
      }
      await loadContent();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save about section');
    }
  };

  const saveContact = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...contactForm,
      timings: parseJsonArray(contactForm.timings, []),
    };

    try {
      if (selectedContactId) {
        await apiClient.updateContactSection(selectedContactId, payload);
        setMessage('Contact section updated successfully.');
      } else {
        await apiClient.createContactSection(payload);
        setMessage('Contact section created successfully.');
      }
      await loadContent();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save contact section');
    }
  };

  const saveGallery = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      ...galleryForm,
      images: parseJsonArray(galleryForm.images, []),
    };

    try {
      if (selectedGalleryId) {
        await apiClient.updateGallerySection(selectedGalleryId, payload);
        setMessage('Gallery section updated successfully.');
      } else {
        await apiClient.createGallerySection(payload);
        setMessage('Gallery section created successfully.');
      }
      await loadContent();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save gallery section');
    }
  };

  const deleteSelected = async (type: 'about' | 'contact' | 'gallery') => {
    const id = type === 'about' ? selectedAboutId : type === 'contact' ? selectedContactId : selectedGalleryId;
    if (!id || !window.confirm(`Delete this ${type} section?`)) return;

    try {
      if (type === 'about') await apiClient.deleteAboutSection(id);
      if (type === 'contact') await apiClient.deleteContactSection(id);
      if (type === 'gallery') await apiClient.deleteGallerySection(id);
      setMessage(`${type} section deleted successfully.`);
      await loadContent();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `Unable to delete ${type} section`);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading site content...</p>;
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Site Content</h2>
        <p className="text-sm text-gray-500">Edit public About, Contact, and Clinic Gallery sections.</p>
      </div>

      {message && (
        <div className="rounded border border-[#d9a577]/30 bg-[#fdf7f0] px-4 py-3 text-sm text-[#6b472e]">
          {message}
        </div>
      )}

      <form onSubmit={saveAbout} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-800">About Section</h3>
          <div className="flex gap-2">
            <select value={selectedAboutId} onChange={(event) => fillAboutForm(abouts.find((item) => item.id === event.target.value))} className="rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="">Create new</option>
              {abouts.map((item) => <option key={item.id} value={item.id}>{item.tagline}</option>)}
            </select>
            <button type="button" onClick={() => void deleteSelected('about')} className="rounded border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50">Delete</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(['badge', 'badgeLabel', 'tagline', 'titlePrefix', 'titleSuffix', 'buttonText'] as const).map((field) => (
            <label key={field} className="text-sm font-medium text-gray-700">
              {field}
              <input value={aboutForm[field]} onChange={(event) => setAboutForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full rounded border border-gray-300 p-2" />
            </label>
          ))}
          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            paragraphs, one per line
            <textarea value={aboutForm.paragraphs} onChange={(event) => setAboutForm((current) => ({ ...current, paragraphs: event.target.value }))} className="mt-1 min-h-32 w-full rounded border border-gray-300 p-2" />
          </label>
          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            image URLs, one per line
            <textarea value={aboutForm.images} onChange={(event) => setAboutForm((current) => ({ ...current, images: event.target.value }))} className="mt-1 min-h-24 w-full rounded border border-gray-300 p-2" />
          </label>
        </div>
        <button type="submit" className="mt-4 rounded bg-[#6b472e] px-4 py-2 font-semibold text-white hover:bg-[#5a3a24]">Save About</button>
      </form>

      <form onSubmit={saveContact} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-gray-800">Contact Section</h3>
          <div className="flex gap-2">
            <select value={selectedContactId} onChange={(event) => fillContactForm(contacts.find((item) => item.id === event.target.value))} className="rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="">Create new</option>
              {contacts.map((item) => <option key={item.id} value={item.id}>{item.heading}</option>)}
            </select>
            <button type="button" onClick={() => void deleteSelected('contact')} className="rounded border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50">Delete</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {(['heading', 'address', 'phone', 'website', 'mapLink'] as const).map((field) => (
            <label key={field} className="text-sm font-medium text-gray-700">
              {field}
              <input value={contactForm[field]} onChange={(event) => setContactForm((current) => ({ ...current, [field]: event.target.value }))} className="mt-1 w-full rounded border border-gray-300 p-2" />
            </label>
          ))}
          <label className="text-sm font-medium text-gray-700 md:col-span-2">
            timings JSON
            <textarea value={contactForm.timings} onChange={(event) => setContactForm((current) => ({ ...current, timings: event.target.value }))} className="mt-1 min-h-40 w-full rounded border border-gray-300 p-2 font-mono text-xs" />
          </label>
        </div>
        <button type="submit" className="mt-4 rounded bg-[#6b472e] px-4 py-2 font-semibold text-white hover:bg-[#5a3a24]">Save Contact</button>
      </form>

    </div>
  );
};

export default AdminSiteContent;
