'use client';

import { useState, useEffect } from 'react';

interface Subscriber {
  id: number;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await fetch('/api/newsletter');
        if (res.ok) {
          const data = await res.json();
          setSubscribers(data);
        }
      } catch (error) {
        console.error('Failed to fetch subscribers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  const exportToCSV = () => {
    const headers = 'Email,Date d\'inscription\n';
    const rows = subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString('fr-FR')}`).join('\n');
    const csv = headers + rows;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  if (loading) {
    return <div className="text-center text-stone-400">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase">
          Newsletter
        </h1>
        <button
          onClick={exportToCSV}
          className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-6 py-2 text-xs tracking-[0.25em] uppercase transition"
        >
          Exporter CSV
        </button>
      </div>

      <div className="bg-stone-900 border border-amber-900/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-800 border-b border-amber-900/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Email</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Date d'inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {subscribers.map((subscriber: any) => (
              <tr key={subscriber.id} className="hover:bg-stone-800/50">
                <td className="px-6 py-4 text-amber-100">{subscriber.email}</td>
                <td className="px-6 py-4 text-stone-400">{new Date(subscriber.createdAt).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
