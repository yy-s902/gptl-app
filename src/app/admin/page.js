// ✅ admin/page.js（ログイン後のメニュー）
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminMenuPage() {
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

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>
      <p>ここから質問の編集や集計ができます。</p>
      <div className="mt-6 space-x-4">
        <a href="/admin/questions" className="text-blue-500 underline">質問を編集</a>
        <a href="/admin/answers" className="text-blue-500 underline">回答を確認</a>
        <a href="/admin/export" className="text-blue-500 underline">回答のエクスポート</a>
        <a href="/admin/qr" className="text-blue-500 underline">QRコード表示</a>
      </div>
    </main>
  );
}
