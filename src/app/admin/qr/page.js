"use client";

import { useState } from "react";
import QRCode from "react-qr-code";

export default function QRPage() {
  const [url, setUrl] = useState("http://localhost:3000/question");

  return (
    <main className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">アンケートQRコード生成</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full max-w-lg border px-4 py-2 rounded mb-6"
      />
      <div className="inline-block bg-white p-4 border rounded">
        <QRCode value={url} size={200} />
      </div>
      <p className="mt-4 text-sm text-gray-500">上のQRコードをスマホで読み取るとアンケートページに移動できます。</p>
    </main>
  );
}
