import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "./index.css";

const HtmlCssJsCompiler: React.FC = () => {
  const [htmlCode, setHtmlCode] = useState<string>("");
  const [cssCode, setCssCode] = useState<string>("");
  const [compiledCode, setCompiledCode] = useState<string>("");

  useEffect(() => {
    const compileCode = () => {
      return `
        <style>${cssCode}</style>
        ${htmlCode}
      `;
    };
    setCompiledCode(compileCode());
  }, [htmlCode, cssCode]);

  return (
    <div className="flex flex-col bg-gray-900 text-white font-sans">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col p-4">
          <Tabs>
            <TabList>
              <Tab>HTML</Tab>
              <Tab>CSS</Tab>
            </TabList>

            <TabPanel>
              <CodeMirror
                value={htmlCode}
                options={{
                  mode: "xml",
                  theme: "material",
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  setHtmlCode(value);
                }}
              />
            </TabPanel>
            <TabPanel>
              <CodeMirror
                value={cssCode}
                options={{
                  mode: "css",
                  theme: "material",
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  setCssCode(value);
                }}
              />
            </TabPanel>
          </Tabs>
        </div>

        <div className="w-1/2 bg-gray-900 flex flex-col">
          <div className="bg-gray-800 px-4 py-2 font-semibold text-center">
            Preview
          </div>
          <iframe
            className="w-full h-full bg-white border-l border-gray-700"
            title="Output"
            sandbox="allow-scripts"
            srcDoc={compiledCode}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default HtmlCssJsCompiler;
