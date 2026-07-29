import React, { useEffect, useState } from 'react';
import { createFaq, deleteFaq, getFaqs, updateFaq, type FAQItem } from '../../services/faqService';

const emptyForm = {
  question: '',
  answer: '',
};

const AdminFaqs: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const response = await getFaqs(1, 100);
      setFaqs(response.data || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFaqs();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      setMessage('Please enter both a question and an answer.');
      return;
    }

    try {
      if (editingId) {
        await updateFaq(editingId, {
          question: form.question.trim(),
          answer: form.answer.trim(),
        });
        setMessage('FAQ updated successfully.');
      } else {
        await createFaq({
          question: form.question.trim(),
          answer: form.answer.trim(),
        });
        setMessage('FAQ created successfully.');
      }

      await loadFaqs();
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save FAQ');
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = window.confirm('Delete this FAQ?');
    if (!confirmed) return;

    try {
      await deleteFaq(id);
      setMessage('FAQ deleted successfully.');
      await loadFaqs();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete FAQ');
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage FAQs</h2>
          <p className="text-sm text-gray-500">Create, edit, and remove FAQ entries shown on the public website.</p>
        </div>
      </div>

      {message && (
        <div className="rounded border border-[#d9a577]/30 bg-[#fdf7f0] px-4 py-3 text-sm text-[#6b472e]">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Question</label>
            <input
              value={form.question}
              onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
              className="w-full rounded border border-gray-300 p-2"
              placeholder="Enter question"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Answer</label>
            <textarea
              value={form.answer}
              onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
              className="min-h-28 w-full rounded border border-gray-300 p-2"
              placeholder="Enter answer"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button type="submit" className="rounded bg-[#6b472e] px-4 py-2 font-semibold text-white hover:bg-[#5a3a24]">
            {editingId ? 'Update FAQ' : 'Add FAQ'}
          </button>
          <button type="button" onClick={resetForm} className="rounded border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Current FAQs</h3>
        {loading ? (
          <p className="text-sm text-gray-500">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-sm text-gray-500">No FAQs yet.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id || faq.question} className="rounded border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{faq.question}</h4>
                    <p className="mt-1 text-sm text-gray-600">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(faq.id || null);
                        setForm({ question: faq.question, answer: faq.answer });
                      }}
                      className="rounded border border-blue-200 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(faq.id)}
                      className="rounded border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFaqs;
