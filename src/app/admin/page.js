'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

useEffect(() => {
  const auth = localStorage.getItem('gptl-auth');
  if (auth !== 'ok') {
    router.push('/admin/login'); 
  }
}, []);


  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'gptladmin') {
      localStorage.setItem('gptl-auth', 'ok');
      setAuthorized(true);
    } else {
      setError('パスワードが違います');
    }
  };

  if (!authorized) {
    return (
      <main className="p-8 text-center">
        <h1 className="text-xl font-bold mb-4">管理者ログイン</h1>
        <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="border px-4 py-2 w-full rounded"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
            ログイン
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-6">管理画面</h1>
      <p>ここから各種管理操作が可能です。</p>
      <div className="mt-6 space-y-4 flex flex-col items-center">
        <a href="/admin/questions" className="text-blue-500 underline text-lg">📝 質問を編集</a>
        <a href="/admin/answers" className="text-blue-500 underline text-lg">📊 回答を確認</a>
        <a href="/admin/export" className="text-blue-500 underline text-lg">📁 回答のエクスポート</a>
        <a href="/admin/qr" className="text-blue-500 underline text-lg">🔗 QRコード表示</a>
      </div>
    </main>
  );
}
