'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import questions from '@/data/questions.json';

export default function AdminAnswersPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'responses'));
      const data = snapshot.docs.map((doc) => doc.data());
      setResponses(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">回答一覧</h1>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <ul className="space-y-4">
          {responses.map((r, i) => (
            <li key={i} className="border p-4 rounded shadow">
              <h2 className="font-semibold mb-2">回答 {i + 1}</h2>
              <ul className="text-sm list-disc list-inside">
                {r.answers.map((ans, j) => (
                  <li key={j}>
                    {questions[j] ? `${questions[j].ja} → ${ans}` : `質問${j + 1} → ${ans}`}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
