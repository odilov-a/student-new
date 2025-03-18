import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { useHooks } from "hooks";

interface Answer {
  _id: string;
  answer: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  title: string;
  photoUrl: string;
  answers: Answer[];
}

interface Test {
  _id: string;
  name: string;
  questions: Question[];
}

const SolveTestPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<
    { question: string; answer: string }[]
  >([]);
  const [result, setResult] = useState<any | null>(null);
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("i18nextLng") || "en"
  );
  const [exitCount, setExitCount] = useState(
    () => Number(localStorage.getItem("exitCount")) || 0
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { t } = useHooks();

  useEffect(() => {
    const savedExitCount = Number(localStorage.getItem("exitCount")) || 0;
    setExitCount(savedExitCount);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newCount = exitCount + 1;
        setExitCount(newCount);
        localStorage.setItem("exitCount", newCount.toString());

        if (newCount >= 3) {
          handleSubmit();
        } else {
          setIsModalOpen(true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [exitCount]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setSelectedLang(localStorage.getItem("i18nextLng") || "en");
    };
    window.addEventListener("storage", handleLanguageChange);
    return () => window.removeEventListener("storage", handleLanguageChange);
  }, []);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API}/tests/test/${id}?lang=${selectedLang}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTest(response.data.data);
      } catch (error) {
        console.error("Error fetching test:", error);
      }
    };
    fetchTest();
  }, [id, selectedLang]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const updated = prev.filter((a) => a.question !== questionId);
      return [...updated, { question: questionId, answer }];
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API}/tests/check/${id}?lang=${selectedLang}`,
        { answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResult(response.data);
      setIsModalOpen(true);
      localStorage.removeItem("exitCount");
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < (test?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (!test) return <p>{t("Loading")}...</p>;

  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="container mx-auto p-2">
      <div className="space-y-6">
        <div className="border p-5 rounded-lg shadow-md">
          <p className="mb-2 text-2xl font-semibold text-gray-800">
            {currentQuestion.title}
          </p>
          {currentQuestion.photoUrl?.[0] && (
            <img
              src={currentQuestion.photoUrl[0]}
              alt={currentQuestion.title}
              className="mb-4 w-[25%] h-[25%] max-w-md rounded-md"
            />
          )}

          <div className="space-y-2">
            {currentQuestion.answers.map((a) => (
              <label
                key={a._id}
                className="flex items-center space-x-2 p-1 rounded hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name={currentQuestion._id}
                  value={a._id}
                  className="form-radio h-5 w-5 text-blue-600"
                  onChange={() =>
                    handleAnswerChange(currentQuestion._id, a._id)
                  }
                  checked={answers.some(
                    (ans) =>
                      ans.question === currentQuestion._id &&
                      ans.answer === a._id
                  )}
                />
                <span className="text-lg font-medium text-gray-700">
                  {a.answer}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={`py-2 px-6 rounded-lg text-white font-semibold ${
            isFirstQuestion
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {t("Orqaga")}
        </button>
        {!isLastQuestion ? (
          <button
            onClick={handleNext}
            className="py-2 px-6 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600"
          >
            {t("Oldinga")}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="py-2 px-6 rounded-lg bg-[#222638] text-white font-semibold hover:bg-pink-600"
          >
            {t("Jo'natish")}
          </button>
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-semibold text-red-600 text-center">
              {result
                ? t("Test tugadi!")
                : t("Diqqat! Oynani almashtirish mumkin emas!")}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600 text-center">
              {result ? (
                <>
                  {result?.message} <br />
                  {t("To'g'ri javoblar:")} {result?.correctAnswers}/
                  {result?.totalQuestions} <br />
                  {t("Foiz:")} {result?.percentage}%
                </>
              ) : (
                t("Siz test oynasidan {{count}}-marta chiqdingiz", {
                  count: exitCount,
                }) +
                ". " +
                t("3 martadan ortiq chiqish testni avtomatik tugatadi")
              )}
            </Dialog.Description>
            <button
              onClick={() =>
                result ? navigate("/tests") : setIsModalOpen(false)
              }
              className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              {t("OK")}
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default SolveTestPage;
