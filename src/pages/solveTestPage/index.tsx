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
  type: number;
  answers: Answer[];
}

interface Test {
  _id: string;
  name: string;
  subject: {
    title: string;
  };
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

  const [exitCount, setExitCount] = useState(() => {
    return Number(localStorage.getItem("exitCount")) || 0;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
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
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [exitCount]);

  useEffect(() => {
    const handleLanguageChange = () => {
      setSelectedLang(localStorage.getItem("i18nextLng") || "en");
    };
    window.addEventListener("storage", handleLanguageChange);
    return () => {
      window.removeEventListener("storage", handleLanguageChange);
    };
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
      } catch (err) {
        console.error("Error fetching test:", err);
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

  if (!test) return <p>{t("Loading")}...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2 text-[#FF0000] text-center">
        {t("Test davomida oynalarni almashtirish mumkin emas!!!")}
      </h1>
      <h1 className="text-2xl font-bold mb-4">{test.name}</h1>
      <div className="space-y-6">
        {test.questions.map((q) => (
          <div key={q._id} className="border p-4 rounded">
            <p className="mb-2">{q.title}</p>
            {q.type === 1 && q.answers ? (
              <div className="space-y-2">
                {q.answers.map((a) => (
                  <label key={a._id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={q._id}
                      value={a._id}
                      onChange={() => handleAnswerChange(q._id, a._id)}
                      className="form-radio"
                    />
                    <span>{a.answer}</span>
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                className="w-full p-2 border rounded"
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {t("Submit")}
      </button>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-96">
            <Dialog.Title className="text-lg font-semibold text-red-600 text-center">
              {t(
                result
                  ? t("Test tugadi!")
                  : t("Diqqat! Oynani almashtirish mumkin emas!")
              )}
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
