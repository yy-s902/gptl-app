'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function QuestionAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ ja: "", en: "" });
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const ref = collection(db, "questions");

  // 🔐 localStorageベースのログイン状態チェック
  useEffect(() => {
    const auth = localStorage.getItem('gptl-auth');
    if (auth === 'ok') {
      setAuthorized(true);
    } else {
      router.push('/admin'); // 未ログインならadminトップに戻す
    }
    setLoadingAuth(false);
  }, [router]);

  const fetchQuestions = async () => {
    const snapshot = await getDocs(ref);
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authorized) {
      fetchQuestions();
    }
  }, [authorized]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ja || !form.en) return;
    await addDoc(ref, form);
    setForm({ ja: "", en: "" });
    fetchQuestions();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "questions", id));
    fetchQuestions();
  };

  if (loadingAuth || !authorized) return null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">質問の管理</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4 max-w-xl mx-auto">
        <input
          type="text"
          name="ja"
          value={form.ja}
          onChange={handleChange}
          placeholder="質問（日本語）"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          name="en"
          value={form.en}
          onChange={handleChange}
          placeholder="Question (English)"
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          追加
        </button>
      </form>

      <section className="max-w-xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">登録済みの質問</h2>
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={q.id} className="border p-4 rounded flex justify-between items-start">
                <div>
                  <p className="font-semibold">{i + 1}. {q.ja}</p>
                  <p className="text-sm text-gray-600">{q.en}</p>
                </div>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
