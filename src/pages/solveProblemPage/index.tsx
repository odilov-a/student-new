import { useState, useEffect } from "react";
import { Fireworks } from "@fireworks-js/react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { message, Tabs, Select, Button, Spin, Typography, Divider } from "antd";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useHooks } from "hooks";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Paragraph } = Typography;

const SolveProblemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { t } = useHooks();
  const [loading, setLoading] = useState(true);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  const selectedLang = localStorage.getItem("i18nextLng") || "en";

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_ROOT_API}/problems/${id}?lang=${selectedLang}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProblem(response.data.data);
        setLoading(false);
      } catch (err) {
        message.error(t("Failed to fetch problem details"));
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id, selectedLang]);

  useEffect(() => {
    const fetchTestCases = async () => {
      if (problem && problem.testCases) {
        const fetchedTestCases = await Promise.all(
          problem.testCases.map(async (testCase: any) => {
            const inputResponse = await axios.get(testCase.inputFileUrl);
            const outputResponse = await axios.get(testCase.outputFileUrl);
            return {
              ...testCase,
              inputContent: inputResponse.data,
              outputContent: outputResponse.data,
            };
          })
        );
        setTestCases(fetchedTestCases);
      }
    };
    fetchTestCases();
  }, [problem]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const getLanguageExtension = () => {
    switch (language) {
      case "javascript":
        return javascript();
      case "python":
        return python();
      case "java":
        return java();
      case "cpp":
        return cpp();
      default:
        return javascript();
    }
  };

  const handleRunCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error(t("Token not found"));
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API}/problems/run`,
        { code, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const output = response.data.data.output;
      const error = response.data.data.error;
      setOutput(output);
      setError(error);
      if (output) {
        message.success(t("Code executed successfully!"));
      }
      if (error) {
        message.error(error);
      }
    } catch (err) {
      const errorMessage =
        (err as any).response?.data?.message?.[t("language")] ||
        (err as any).message;
      setError(errorMessage);
      message.error(`Failed to run the code: ${errorMessage}`);
    }
  };

  const handleSubmitCode = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.error(t("Token not found"));
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_ROOT_API}/problems/${id}/submit`,
        { code, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { correct } = response.data.data;
      if (correct) {
        message.success(t("The problem solved"));
        setShowFireworks(true);
        setTimeout(() => {
          setShowFireworks(false);
          navigate("/problems");
        }, 3000);
      } else {
        message.error(t("Your solution is wrong, try again"));
      }
    } catch (err) {
      const errorMessage =
        (err as any).response?.data?.message?.[t("language")] ||
        (err as any).message;
      setError(errorMessage);
      message.error(`Failed to submit the code: ${errorMessage}`);
    }
  };

  if (loading) {
    return <Spin tip={t("Loading...")} />;
  }

  return (
    <div className="flex">
      {showFireworks && (
        <Fireworks
          key={Date.now()}
          options={{ intensity: 30 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        />
      )}
      <div className="md:w-1/2 p-4">
        <Tabs defaultActiveKey="1">
          <TabPane tab={t("Description")} key="1">
            <Title level={2} className="text-gray-800">
              {problem.title}
            </Title>
            <Paragraph className="mb-4">
              <b>{problem.subject.title}</b>
            </Paragraph>
            <Paragraph className="mb-4">{problem.description}</Paragraph>
          </TabPane>
          <TabPane tab={t("Test cases")} key="2" className="scrollable">
            <div className="scrollable-container">
              {testCases.map((testCase: any, index: number) => (
                <div key={testCase._id}>
                  <Paragraph>
                    <b>{t("Input")}:</b>
                    <pre>{testCase.inputContent}</pre>
                  </Paragraph>
                  <Paragraph>
                    <b>{t("Output")}:</b>
                    <pre>{testCase.outputContent}</pre>
                  </Paragraph>
                  <Divider />
                </div>
              ))}
            </div>
          </TabPane>
          <TabPane tab={t("Tutorial")} key="3">
            <Paragraph className="mb-4">
              <div className="mb-4">
                {problem.tutorials ? (
                  problem.tutorials.includes("youtu") ? (
                    <iframe
                      width="420"
                      height="345"
                      src={problem.tutorials.replace(
                        "youtu.be/",
                        "www.youtube.com/embed/"
                      )}
                      allowFullScreen
                    />
                  ) : (
                    <a
                      href={problem.tutorials}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {t("Watch Tutorial")}
                    </a>
                  )
                ) : (
                  <p>{t("No tutorial available")}</p>
                )}
              </div>
            </Paragraph>
          </TabPane>
        </Tabs>
      </div>
      <Divider type="vertical" className="hidden md:block" />
      <div className="md:w-1/2 p-4">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            {t("Language:")}
          </label>
          <Select
            value={language}
            onChange={handleLanguageChange}
            className="w-full"
          >
            <Option value="javascript">JavaScript v20.18.1</Option>
            <Option value="python">Python v3.10.12</Option>
            <Option value="java">Java v17.0.13</Option>
            <Option value="cpp">C++ v11.4.0</Option>
          </Select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            {t("Code:")}
          </label>
          <CodeMirror
            value={code}
            onChange={(value: any) => setCode(value)}
            extensions={[getLanguageExtension()]}
            theme={dracula}
            basicSetup={{ lineNumbers: true }}
            className="border border-gray-300 rounded-md"
            height="300px"
          />
        </div>

        <div className="flex justify-between mb-4">
          <Button type="primary" className="bg-black" onClick={handleRunCode}>
            {t("Run Code")}
          </Button>
          <Button
            type="primary"
            onClick={handleSubmitCode}
            style={{ backgroundColor: "#9c27b0" }}
          >
            {t("Submit Code")}
          </Button>
        </div>
        {output && (
          <div className="mt-4">
            <p>
              <strong>{t("Output:")}</strong>
            </p>
            <pre className="p-2 bg-gray-100 rounded-md">{output}</pre>
          </div>
        )}
        {error && (
          <div className="mt-4">
            <p>
              <strong>{t("Error:")}</strong>
            </p>
            <pre className="p-2 bg-red-100 rounded-md">{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolveProblemPage;
