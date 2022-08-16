import React, {useState, useEffect} from 'react';
import { onKeyDown, getLine, HandleColor } from '../../utils/text';
import { StyledCodeEditor, StyledCodeEditorHeader,StyledCodeEditorBody } from '../styled-components/StyledCodeEditor';

const CodeEditor = ({lang, setter}) => {
    const [code, setCode] = useState("");
    const [selection, setSelection] = useState([0,0]);
    const [lineNumbers, setLineNumbers] = useState([<span key = "1">1</span>]);

    useEffect(()=> {
        const div = document.getElementById(lang);
        const textarea = document.getElementById(lang + 1);
        const lines = getLine(code, code.length + 1);
        setLineNumbers(Array(lines).fill(null).map((_, i) => <span key = {i+1}>{i+1}</span>));
        div.innerHTML = HandleColor(code, lang)?.innerHTML;
        const line = getLine(code, selection[0]);
        div.childNodes[line-1].style.backgroundColor = "rgba(0,0,0,0.5)";
        textarea.selectionStart = selection[0];
        textarea.selectionEnd = selection[1];
    },[code, lang, selection]);

    const handleScroll = (e) => {
        const scroll = e.target.scrollTop;
        e.target.parentElement.firstChild.scrollTop = scroll;
        e.target.parentElement.lastChild.scrollTop = scroll;
    }

    return (
        <StyledCodeEditor>
        <StyledCodeEditorHeader>
            <h2>{lang}</h2>
        </StyledCodeEditorHeader>
        <StyledCodeEditorBody>
            <section>
                {lineNumbers}
            </section>
            
            <textarea contentEditable = "true"
                spellCheck="false"
                id={lang + 1}
                placeholder="Write your code here..." 
                onKeyDown = {(e) => onKeyDown(e, code, setCode, setSelection, setter)}
                onScroll = {handleScroll}
                value = {code}
                cols="10000"
            >
            </textarea>
            <div id={lang} className="shownCode"></div>
        </StyledCodeEditorBody>
        </StyledCodeEditor>
    );
}

export default CodeEditor;