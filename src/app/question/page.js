"use client";

import { useEffect, useRef, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";

export default function QuestionPage() {
  const [language, setLanguage] = useState("ja");
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const data = snapshot.docs.map((doc) => doc.data());
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[step]?.[language] || "";

  useEffect(() => {
    if (!currentQuestion) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.lang = language === "ja" ? "ja-JP" : "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [step, currentQuestion, language]);

  const startSpeechRecognition = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window)) {
      alert("音声認識はこのブラウザではサポートされていません。");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === "ja" ? "ja-JP" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const number = parseInt(transcript, 10);
      if (!isNaN(number) && number >= 1 && number <= 5) {
        setSelected(number);
      } else {
        alert(`認識結果「${transcript}」は有効な1〜5の数字ではありません。`);
      }
    };

    recognition.onerror = (event) => {
      console.error("音声認識エラー:", event.error);
      alert("音声認識エラーが発生しました。");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      try {
        await addDoc(collection(db, "responses"), {
          answers: newAnswers,
          createdAt: Timestamp.now()
        });
        console.log("保存成功");
      } catch (error) {
        console.error("保存失敗:", error);
      }
      setFinished(true);
    }
  };

  if (questions.length === 0) {
    return <main className="p-8 text-center">質問を読み込み中...</main>;
  }

  return (
    <main className="p-8 text-center">
      <div className="mb-6">
        <button
          onClick={() => setLanguage("ja")}
          className={`px-4 py-2 rounded-l ${
            language === "ja"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          日本語
        </button>
        <button
          onClick={() => setLanguage("en")}
          className={`px-4 py-2 rounded-r ${
            language === "en"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          English
        </button>
      </div>

      {!finished ? (
        <>
          <h1 className="text-xl font-bold mb-4">
            {language === "ja" ? "アンケート" : "Survey"}（{step + 1} / {questions.length}）
          </h1>
          <p className="mb-6">{currentQuestion}</p>

          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`px-4 py-2 rounded border w-12 ${
                  selected === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelected(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <button
              onClick={startSpeechRecognition}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              🎤 音声入力で答える
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`mt-4 px-6 py-2 rounded ${
              selected === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {language === "ja" ? "次へ" : "Next"}
          </button>
        </>
      ) : (
        <>
          <p className="text-xl text-green-700 font-semibold mb-6">
            {language === "ja"
              ? "ご協力ありがとうございました！"
              : "Thank you for your response!"}
          </p>
          <h2 className="text-lg font-bold mb-2">
            {language === "ja" ? "あなたの回答" : "Your Answers"}
          </h2>
          <ul className="text-left inline-block">
            {questions.map((q, i) => (
              <li key={i} className="mb-4">
                <span className="font-semibold">
                  {i + 1}. {q[language]}
                </span>
                <br />
                → {language === "ja" ? "回答" : "Answer"}: {answers[i]}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
  