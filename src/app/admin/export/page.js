"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import questions from "@/data/questions.json";

export default function AdminExportPage() {
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

  const exportCSV = () => {
    const headers = ["No", ...questions.map((q, i) => `${i + 1}. ${q.ja}`)];
    const rows = responses.map((r, i) => [i + 1, ...r.answers]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "responses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">回答データのエクスポート</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <>
          <button
            onClick={exportCSV}
            className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            CSVとしてダウンロード
          </button>

          <ul className="space-y-2 text-sm">
            {responses.map((r, i) => (
              <li key={i}>
                回答 {i + 1}: {r.answers.join(", ")}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
