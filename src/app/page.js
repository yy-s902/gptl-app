'use client';

import { useEffect, useState } from "react";

export default function QuestionPage() {
  const questions = [
    "今の生活にどのくらい満足していますか？",
    "支援活動についてどう思いますか？",
    "食料や水は足りていますか？"
  ];

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[step];

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.lang = "ja-JP";
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }, [step]);

  const handleNext = () => {
    setAnswers([...answers, selected]);

    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  return (
    <main className="p-8 text-center">
      {!finished ? (
        <>
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

          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`mt-4 px-6 py-2 rounded ${
              selected === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            次へ
          </button>
        </>
      ) : (
        <p className="text-xl text-green-700 font-semibold">
          ご協力ありがとうございました！
        </p>
      )}
    </main>
  );
}
