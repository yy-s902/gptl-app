'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AnswerLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPassword = 'gptl2024'; // 回答者用パスワード

    if (password === correctPassword) {
      sessionStorage.setItem('gptl-answer', 'ok');
      router.push('/question');
    } else {
      setError('パスワードが違います');
    }
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-bold mb-6">アンケート開始</h1>
      <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワードを入力"
          className="border px-4 py-2 w-full rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded">
          はじめる
        </button>
      </form>
    </main>
  );
}
