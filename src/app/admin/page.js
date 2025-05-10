'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem('gptl-auth');
    if (auth === 'ok') {
      setAuthorized(true);
    } else {
      router.push('/login');
    }
  }, [router]);

  if (!authorized) return null;

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>
      <p>ここから質問の編集や集計ができます。</p>
      <div className="mt-6 space-x-4">
        <a href="/admin/questions" className="text-blue-500 underline">質問を編集</a>
        <a href="/admin/answers" className="text-blue-500 underline">回答を確認</a>
      </div>
    </main>
  );
}
