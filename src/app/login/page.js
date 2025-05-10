'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    const correctPassword = 'gptladmin'; // ← ここでパスワード固定

    if (password === correctPassword) {
      sessionStorage.setItem('gptl-auth', 'ok'); // 簡易なログイン状態保存
      router.push('/admin');
    } else {
      setError('パスワードが違います');
    }
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-bold mb-4">ログイン</h1>
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

