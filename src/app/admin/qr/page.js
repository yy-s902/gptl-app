'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';

export default function QRCodePage() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
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

  if (checking || !authorized) return null;

  const surveyUrl = 'https://gptl-app.vercel.app/question';

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-bold mb-4">アンケートQRコード</h1>
      <QRCode value={surveyUrl} size={256} />
      <p className="mt-4 text-gray-600">{surveyUrl}</p>
    </main>
  );
}
