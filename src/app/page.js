'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">GPTLアンケート</h1>
      <p className="mb-8">以下から該当するページに進んでください</p>

      <div className="space-y-4">
        <button
          onClick={() => router.push('/question')}
          className="bg-green-600 text-white px-6 py-3 rounded text-lg hover:bg-green-700"
        >
          回答者としてアンケートに進む
        </button>
        <br />
        <button
          onClick={() => router.push('/admin')}
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
        >
          管理者としてログイン
        </button>
      </div>
    </main>
  );
}
