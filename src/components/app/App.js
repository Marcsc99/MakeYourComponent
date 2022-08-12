import CodeEditor from "../code-editor/CodeEditor.js";
import {useState} from "react";
import Result from "../result/Result.js";
import CustomComponent from "../custom-component/CustomComponent.js";

function App() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");

  return (
      <main>
        <CodeEditor lang ="HTML" setter={setHtml}/>
        <CodeEditor lang ="CSS" setter={setCss}/>
        <CustomComponent html={html} css={css}/>
        <Result js={html} css={css}/>
      </main>
  );
}

export default App;
