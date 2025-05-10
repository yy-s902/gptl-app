"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PASSWORD = "gptl2025"; // ← ここを自分の好きなパスワードに変更

export default function AdminProtectedPage({ children }) {
  const [authorized, setAuthorized] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === ADMIN_PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("パスワードが間違っています。");
    }
  };

  if (authorized) return children;

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-bold mb-4">管理者ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="パスワードを入力"
          className="border px-4 py-2 rounded w-64"
        />
        <br />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ログイン
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </main>
  );
}