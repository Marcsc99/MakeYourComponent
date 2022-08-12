import React, {useState, useEffect} from 'react';
import { onKeyDown, getLine, HandleColor } from '../../utils/text';
import { StyledCodeEditor, StyledCodeEditorHeader,StyledCodeEditorBody } from '../styled-components/StyledCodeEditor';

const CodeEditor = ({lang, setter}) => {
    const [code, setCode] = useState("");
    const [selection, setSelection] = useState([0,0]);
    const [lineNumbers, setLineNumbers] = useState([<span key = "1">1</span>]);

    useEffect(()=> {
        const element = document.getElementById(lang);
        element.selectionStart = selection[0];
        element.selectionEnd = selection[1];

        const lines = getLine(code, code.length + 1);
        setLineNumbers(Array(lines).fill(null).map((_, i) => <span key = {i+1}>{i+1}</span>));
        element.innerHTML = HandleColor(code).innerHTML;

        const sel = window.getSelection();
        const range = document.createRange();
        sel.removeAllRanges();
        range.selectNodeContents(element);
        range.collapse(false);
        sel.addRange(range);

        /*HandleColor(code).childNodes.forEach((item) => {
            element.appendChild(item)
        }
        );*/

    },[code, lang, selection]);

    const handleScroll = (e) => {
        const scroll = e.target.scrollTop;
        e.target.parentElement.firstChild.scrollTop = scroll;
    }

    return (
        <StyledCodeEditor>
        <StyledCodeEditorHeader>
            <h2>{lang}</h2>
        </StyledCodeEditorHeader>
        <StyledCodeEditorBody onScroll={handleScroll}>
            <section>
                {lineNumbers}
            </section>
            
            <div contentEditable = "true"
                id={lang}
                placeholder="Write your code here..." 
                onChange={(e) => { setCode(e.target.value); setter(e.target.value); }} 
                onKeyDown = {(e) => onKeyDown(e, code, setCode, setSelection, setter)}
                onScroll = {handleScroll}
            >
            </div>
        </StyledCodeEditorBody>
        </StyledCodeEditor>
    );
}

export default CodeEditor;