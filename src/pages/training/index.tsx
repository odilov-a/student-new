import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { Container } from "modules";
import { useHooks } from "hooks";

const CodeExecutor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const { t } = useHooks();

  const handleLanguageChange = (e: any) => {
    setLanguage(e.target.value);
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

  const handleFormSubmit = (response: any) => {
    if (response.status === "error") {
      setError(response.message);
      setOutput("");
    } else {
      setOutput(response.data.output);
      setError(response.data.error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Container.Form
        url="/problems/run"
        name="problems"
        method="post"
        fields={[
          {
            type: "string",
            required: true,
            name: "code",
            value: code,
          },
          {
            type: "string",
            required: true,
            name: "language",
            value: language,
          },
        ]}
        onSuccess={handleFormSubmit}
        onError={handleFormSubmit}
      >
        {() => (
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="mb-4">
                <select
                  value={language}
                  onChange={handleLanguageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="javascript">JavaScript v20.18.1</option>
                  <option value="python">Python v3.10.12</option>
                  <option value="java">Java v17.0.13</option>
                  <option value="cpp">C++ v11.4.0</option>
                </select>
              </div>
              <div className="mb-5">
                <CodeMirror
                  value={code}
                  onChange={(value: any) => setCode(value)}
                  extensions={[getLanguageExtension()]}
                  theme={dracula}
                  basicSetup={{ lineNumbers: true }}
                  className="border border-gray-300 rounded-md"
                  height="350px"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                {t("Run Code")}
              </button>
            </div>

            <div className="flex-1">
              {output && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{t("Output:")}</h3>
                  <pre className="bg-gray-100 p-3 rounded-md mt-2 whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              )}
              {error && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-red-500">
                    {t("Error:")}
                  </h3>
                  <pre className="bg-red-100 p-3 rounded-md mt-2 whitespace-pre-wrap">
                    {error}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </Container.Form>
    </div>
  );
};

export default CodeExecutor;
