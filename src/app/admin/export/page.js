'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ExportPage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [responses, setResponses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('gptl-auth');
    if (auth === 'ok') {
      setAuthorized(true);
    } else {
      router.push('/admin/login');
    }
    setChecking(false);
  }, [router]);

  useEffect(() => {
    if (authorized) {
      getDocs(collection(db, 'responses')).then(snapshot => {
        const data = snapshot.docs.map(doc => doc.data());
        setResponses(data);
      });
    }
  }, [authorized]);

  if (checking || !authorized) return null;

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-6">回答のエクスポート</h1>
      <p className="mb-4 text-sm text-gray-600">※今はダミーデータ構成。CSV出力などは後で追加可能。</p>
      <ul className="space-y-2">
        {responses.map((r, i) => (
          <li key={i} className="border p-2 rounded text-sm">
            回答{i + 1}: {JSON.stringify(r.answers)}
          </li>
        ))}
      </ul>
    </main>
  );
}
