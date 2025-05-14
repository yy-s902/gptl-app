'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (sessionStorage.getItem('gptl-auth') === 'ok') {
      setAuthorized(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'gptladmin') {
      sessionStorage.setItem('gptl-auth', 'ok');
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
      <p>ここから質問の編集や集計ができます。</p>
      <div className="mt-6 space-y-4 flex flex-col items-center">
        <a href="/admin/questions" className="text-blue-500 underline text-lg">📝 質問を編集</a>
        <a href="/admin/answers" className="text-blue-500 underline text-lg">📊 回答を確認</a>
      </div>
    </main>
  );
}
