"use client";

import { useState, useEffect } from "react";

export default function QuestionPage() {
  const questions = [
    "今の生活にどのくらい満足していますか？",
    "支援活動についてどう思いますか？",
    "食料や水は足りていますか？"
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [listening, setListening] = useState(false);

  const currentQuestion = questions[step];

  // 読み上げ
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion);
      utterance.lang = "ja-JP";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }, [step]);

  // 音声認識スタート
  const handleVoiceInput = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("このブラウザでは音声入力に対応していません。");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const number = parseInt(transcript.match(/[1-5]/));
      if (number >= 1 && number <= 5) {
        setSelected(number);
      } else {
        alert("1〜5の数字を言ってください");
      }
      setListening(false);
    };

    recognition.onerror = () => {
      alert("音声認識エラーが発生しました");
      setListening(false);
    };
  };

  const handleNext = () => {
    setAnswers([...answers, selected]);
    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      alert("アンケート完了！");
    }
  };

  return (
    <main className="p-8 text-center">
      <h1 className="text-xl font-bold mb-4">アンケート（{step + 1} / {questions.length}）</h1>
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

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={handleVoiceInput}
          className="px-4 py-2 bg-yellow-400 text-black rounded"
          disabled={listening}
        >
          {listening ? "認識中…" : "マイクで答える"}
        </button>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className={`px-6 py-2 rounded ${
            selected === null
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          次へ
        </button>
      </div>
    </main>
  );
}

  
