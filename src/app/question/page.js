'use client';

import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, Timestamp } from "firebase/firestore";

export default function QuestionPage() {
  const [questions, setQuestions] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [language, setLanguage] = useState("ja");

  const recognitionRef = useRef(null);
  const currentQuestion = questions[step]?.[language] || "";

  // 質問を Firestore から取得
  useEffect(() => {
    const fetchQuestions = async () => {
      const snapshot = await getDocs(collection(db, "questions"));
      const data = snapshot.docs.map((doc) => doc.data());
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  // 音声読み上げ
  useEffect(() => {
    if (!currentQuestion) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.lang = language === "ja" ? "ja-JP" : "en-US";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [currentQuestion, language]);

  // 音声入力のセットアップ
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language === "ja" ? "ja-JP" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      const num = parseInt(result);
      if (num >= 1 && num <= 5) {
        setSelected(num);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopRecognition = () => {
    recognitionRef.current?.stop();
  };

  const handleNext = async () => {
    stopRecognition();
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
      } catch (err) {
        console.error("保存失敗:", err);
      }
      setFinished(true);
    }
  };

  return (
    <main className="p-8 text-center">
      {/* 言語切り替え */}
      <div className="mb-6">
        <button onClick={() => setLanguage("ja")} className={`px-4 py-2 rounded-l ${language === "ja" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>日本語</button>
        <button onClick={() => setLanguage("en")} className={`px-4 py-2 rounded-r ${language === "en" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>English</button>
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
                  selected === num ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setSelected(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={startRecognition}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              🎤 {language === "ja" ? "音声入力" : "Speak"}
            </button>
            <button
              onClick={handleNext}
              disabled={selected === null}
              className={`px-6 py-2 rounded ${
                selected === null ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {language === "ja" ? "次へ" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-xl text-green-700 font-semibold mb-6">
            {language === "ja" ? "ご協力ありがとうございました！" : "Thank you for your response!"}
          </p>
          <h2 className="text-lg font-bold mb-2">{language === "ja" ? "あなたの回答" : "Your Answers"}</h2>
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
