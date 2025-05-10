"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import questions from "@/data/questions.json";

export default function AdminPage() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "responses"));
      const data = snapshot.docs.map((doc) => doc.data());
      setResponses(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getAverageData = () => {
    return questions.map((q, i) => {
      const values = responses.map((r) => r.answers[i]).filter((v) => typeof v === "number");
      const avg = values.length > 0 ? values.reduce((sum, v) => sum + v, 0) / values.length : 0;
      return {
        question: q.ja,
        average: parseFloat(avg.toFixed(2)),
      };
    });
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">アンケート結果（管理画面）</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-lg font-semibold mb-4">平均値（棒グラフ）</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={getAverageData()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 5]} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">全回答一覧</h2>
            <ul className="space-y-4">
              {responses.map((r, i) => (
                <li key={i} className="border p-4 rounded shadow">
                  <h3 className="font-semibold">回答 {i + 1}</h3>
                  <ul className="mt-2 text-sm list-disc list-inside">
                    {r.answers.map((ans, j) => (
                      <li key={j}>
                        {questions[j] ? `${questions[j].ja} → ${ans}` : `質問 ${j + 1} → ${ans}`}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}


