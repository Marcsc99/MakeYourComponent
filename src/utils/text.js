export const getLine = (text, index) => text.substring(0, index).split("\n").length;

const setTabsToFinal = (text) => text.split(/\r?\n/).map((item, i) => (i === 0 ? '' : '\t') + item).join('\n')

export const base = (h) => 
`import React from "react";

const CustomComponent = () => {
    return (
        ${setTabsToFinal(h)}
    )
}

export default CustomComponent;
`

export const onKeyDown = async (e,text, setter, setSelection, setter2)  => {
    let result = text;
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const selected = result.substring(start, end);
    const handle = Handle(e, text, selected, start, end, setSelection);
    if(e.key.length === 1){
        if(e.ctrlKey){
            if(e.key === "c") handle.Copy();
            else if(e.key === "x") result = handle.Cut();
            else if(e.key === "v") result = await handle.Paste();
        }
        else result = handle.SingleChar();
    }
    else {
        if(e.shiftKey) {
            if (e.keyCode === 9) result = handle.Tab();
        }
        else {
            if (e.keyCode === 9) result = handle.Tab(); 
            else if (e.keyCode === 8) result = handle.BackSpace(); 
            else if(e.keyCode === 13) result = handle.Enter();
            else if(e.keyCode === 46) result = handle.Delete();
        }
    }
    setter(result);
    setter2(result);
}

const Handle = (e, text, selected, start, end, setSelection) => {
    const split = selected.split(/\r?\n/);
    const selection = start !== end;
    const add = (c, first = start, second = end) => text.substring(0, first) + c + text.substring(second);

    const Enter = () => { setSelection([start + 1, start + 1]); return add("\n"); }
    const SingleChar = () => { e.preventDefault(); setSelection([start + 1, start + 1]); return add(e.key); }
    const BackSpace = () => { setSelection([start-(!selection), start-(!selection)]); return add("", start - (!selection)); }
    const Delete = () => { e.preventDefault(); setSelection([start, start]); return add("", start, end + (!selection)); }
    const removeTabs = () => {
        if(split.length > 1){
            const first = getLine(text, start) - 1;
            const final = getLine(text, end);
            return {texto: text.split(/\r?\n/).map((item, i) => (i >= first && i < final && item.substring(0,1) === "\t") ? item.substring(1, item.length) : item).join('\n'), lenght: split.length}
        }
        else if(text.substring(start-1,start) === "\t") return { texto: text.substring(0,start-1) + text.substring(start, text.length), length: 1 };
        return { texto: text, length: 0 };
    }
    const setTabs = () => {
        if(split.length > 1){
            const first = getLine(text, start) - 1;
            const final = getLine(text, end);
            return {texto: text.split(/\r?\n/).map((item, index) => ((index >= first && index < final) ? "\t" : "") + item).join('\n'), length: split.length }
        }
        return { texto: add("\t" + selected), length: split.length };
    }
    const Tab = () => {
        e.preventDefault();
        const {texto, length} = e.shiftKey ? removeTabs() : setTabs();
        if(texto !== text) setSelection(e.shiftKey ? [start - 1, end - length] : [start + 1, end + length])
        return texto;
    }
    const Cut = () => { Copy(); setSelection([start, start]); return add(""); }
    const Paste = async () => {
        const copied = await navigator.clipboard.readText();
        setSelection([start + copied.length, start + copied.length]);
        return add(copied);
    }
    const Copy = () => { navigator.clipboard.writeText(selected); }
    return { Enter, SingleChar, BackSpace, Delete, Tab, Cut, Paste, Copy };
}

const Code = () => {
    const HTML = () => {
        const Color = (text) => {
            let finalTag = document.createElement("div");;
            let sections = [];
            let done = false;
            let lastIndex = 0;
            let indexMinor = text.indexOf("<")
            let indexGreater = text.indexOf(">")
            do {
                if(lastIndex < indexMinor){
                    sections = [...sections, {type: "text", text: text.substring(lastIndex, indexMinor)}]
                }
                if(indexGreater === -1 && indexMinor === -1) {
                    sections = [...sections, {type: "text", text: text.substring(lastIndex, text.length)}]
                    done = true;
                }
                if(indexGreater === -1 && indexMinor !== -1) {
                    sections = [...sections, {type: "text", text: text.substring(indexMinor, text.length)}]
                    done = true;
                }
                if(indexGreater !== -1 && indexMinor !== -1){
                    sections = [...sections, {type: "tag", text: text.substring(indexMinor + 1, indexGreater)}]
                    lastIndex = indexGreater + 1;
                }
                indexMinor = text.indexOf("<", indexGreater + 1);
                indexGreater = text.indexOf(">", indexGreater + 1);
            } while(!done)
        
            sections.forEach(section => {
                if(section.type === "tag") finalTag = MakeTag(section.text, finalTag, true);
                else if(section.type === "text") finalTag.appendChild(document.createTextNode(section.text))
            })
            return finalTag;
        }
        
        const MakeSpan = (text, color) => {
            let span = document.createElement("span");
            span.setAttribute("style", 'color:'+ color );
            span.appendChild(document.createTextNode(text));
            return span;
        }
        
        const MakeTag = (tag, toTag, completed) => {
            const splited = tag.split(" ");
            let finalTag = toTag;
            finalTag.appendChild(document.createTextNode("<"));
            finalTag.appendChild(MakeSpan(splited[0], "red"));
            finalTag.appendChild(MakeProps(splited.slice(1).join('\u00a0'), splited[1] !== undefined));
            if(completed)finalTag.appendChild(document.createTextNode(">"));
            return finalTag;
        }
        
        const MakeProps = (info, space) => {
            let first = space;
            let infoCopy = info;
            const tag = MakeSpan("", "orange")
            let index1, index2;
            do {
                index1 = infoCopy.indexOf("\"");
                index2 = infoCopy.indexOf("\"", index1 + 1);
        
                if(index1 === -1 || index2 === -1){
                    tag.appendChild(document.createTextNode((first ? '\u00a0' : "") + infoCopy)); first = false;
                    return tag;
                }
                else {
                    tag.appendChild(document.createTextNode((first ? '\u00a0' : "") + infoCopy.substring(0, index1))); first = false;
                    tag.appendChild(MakeSpan(infoCopy.substring(index1, index2 + 1), "green"));
                    infoCopy = infoCopy.substring(index2 + 1, infoCopy.length);
                }
                
            } while(index1 !== -1 && index2 !== -1);
        
            return tag;
        }
        return {
            Color, MakeSpan, MakeTag, MakeProps
        }
    };

    const CSS = () => {
        const Color = (text) => {
            let finalTag = document.createElement("div");;
            let sections = [];
            let i1 = 0, i2 = 0, count = 0, start = false;
            text.split("").forEach((char, index) => {
                if(char === "}") count--;
                if(char === "{") { count++; start = true}
                if(count === 0 && start) {
                    i2 = index;
                    sections = [...sections, text.substring(i1, i2+1)];
                    i1 = i2 + 1;
                    start = false;
                }
                if(index === text.length - 1) sections = [...sections, text.substring(i1, text.length)];
            });
            sections.forEach(section => {
                finalTag = resolveSection(section, finalTag)
            })
            return finalTag;
        }
        
        const resolveSection = (section, div) => {
            let finalTag = div;
            const index1 = section.indexOf("{");
            finalTag = resolveOut(section.substring(0, index1 === -1 ? section.length : index1), finalTag);
            if(index1 !== -1){
                finalTag.appendChild(document.createTextNode("{"))
                finalTag = resolveIn(section.substring(index1 + 1, section.length), finalTag);
            }
            return finalTag;
        }
        
        const resolveOut = (text, div) => {
            let finalTag = div;
            const splited = text.indexOf(",") !== -1 ? text.split(",") : [text]
            splited.forEach((item, i)=> {
                const splited2 = item.split(":")
                finalTag.appendChild(HTML().MakeSpan(splited2[0], "red"));
                splited2.forEach((item2, index) => {
                    if(index !== 0){
                        finalTag.appendChild(document.createTextNode(":"));
                        finalTag.appendChild(HTML().MakeSpan(item2, "lightblue"));
                    }
                })
                if(i < splited.length - 1) finalTag.appendChild(document.createTextNode(","));
            })
            return finalTag;
        }
        
        const resolveIn = (text, div) => {
            let finalTag = div;
        
            let open = false;
            let i1 = 0, i2 = 0, count = 0, lastSemiColon = 0, lastTwoPoints = 0;
            const splited = text.split("");
            splited.forEach((char, i) => {
                const colon = lastSemiColon >= lastTwoPoints
                const colonVal = lastSemiColon === 0 ? 0 : lastSemiColon + 1
                if(!open){
                    if(char === ":"){
                        finalTag.appendChild(HTML().MakeSpan(text.substring(colon ? (colonVal) : (lastTwoPoints + 1), i), colon ? "lightgrey": "orange"))
                        lastTwoPoints = i;
                        finalTag.appendChild(document.createTextNode(":"));
                    }
                    else if(char === ";"){
                        if(lastTwoPoints === 0) finalTag.appendChild(HTML().MakeSpan(text.substring(lastSemiColon, i), "lightgrey"));
                        else finalTag.appendChild(HTML().MakeSpan(text.substring(Math.max(lastSemiColon, lastTwoPoints) + 1, i), "orange"))
                        lastSemiColon = i;
                        finalTag.appendChild(document.createTextNode(";"));
                    }
                    else if(i === splited.length - 1 && char !== "{"){
                        if(lastTwoPoints > lastSemiColon) {
                            if(char === "}") {
                                finalTag.appendChild(HTML().MakeSpan(text.substring(lastTwoPoints + 1, i), "orange"))
                                finalTag.appendChild(document.createTextNode("}"));
                            }
                            else finalTag.appendChild(HTML().MakeSpan(text.substring(lastTwoPoints + 1, i + 1), "orange"))
                        }
                        else{
                            if(char === "}") {
                                finalTag.appendChild(HTML().MakeSpan(text.substring(lastSemiColon === 0 ? 0 : lastSemiColon + 1, i), "lightgrey"))
                                finalTag.appendChild(document.createTextNode("}"));
                            }
                            else finalTag.appendChild(HTML().MakeSpan(text.substring(lastSemiColon === 0 ? 0 : lastSemiColon + 1, i+1), "lightgrey"))
                        }
                    }
                }
                
                if(char === "{") { 
                    if(!open) i1 = lastSemiColon === 0 ? 0 : lastSemiColon + 1
                    open = true; count++;
                    if(i === splited.length - 1) finalTag = resolveSection(text.substring(i1, i + 1), finalTag);
                    
                }
                else if(char === "}") count--;
                else {
                    if(i === splited.length - 1 && open) finalTag = resolveSection(text.substring(i1, i + 1), finalTag);
                }
                if(open && count === 0) {
                    i2 = i;
                    finalTag = resolveSection(text.substring(i1, i2 + 1), finalTag);
                    i1 = i2 + 1;
                    open = false;
                    lastSemiColon = lastTwoPoints = i;
                }
            });
            return finalTag;
        }
        return { Color, resolveSection, resolveOut, resolveIn }
    };

    const MultipleLines = (parent, html) => {
        const tag = document.createElement("div");
        const array = [...parent.childNodes]
        let lineTag = document.createElement("div");
        lineTag.classList.add('line');
        if(array.length === 0) tag.appendChild(lineTag)
        else {
            let arrayFinal = []
            if(html){
                array.forEach((node) => {
                    const arr = node.nodeName === "#text" ? [node] : [...[...ConvertStringToHTML(OneToMany(node).innerHTML).childNodes]]
                    arrayFinal = [...arrayFinal, ...arr];
                })
            }
            else arrayFinal = array;
            arrayFinal.forEach((item)=>{
                const toSplit = item.nodeName === "SPAN" ? item.textContent : item.nodeValue;
                const splited = toSplit.split(/\r?\n|\r|\n/g);
                const last = splited.length - 1;
                if(last === 0) lineTag.appendChild(item);
                else {
                    splited.forEach((line, i) => {
                        const toAdd = item.nodeName === "SPAN" ? HTML().MakeSpan(line, item.style.color) : document.createTextNode(line);
                        lineTag.appendChild(toAdd);
                        
                        if(i !== last) {
                            tag.appendChild(lineTag)
                            lineTag = document.createElement("div");
                            lineTag.classList.add('line');
                        }
                    })
                }
            })
            tag.appendChild(lineTag)
        }
        return tag;
    }
    
    const OneToMany = (parent) =>{
        let result = parent;
        let tag = document.createElement("div");
        const array = [...ConvertStringToHTML(result.innerHTML).childNodes]
        array.forEach((item) => {
            if([...ConvertStringToHTML(item.innerHTML).childNodes].length > 1)  [...OneToMany(item).innerHTML.childNodes].forEach((item2) => { tag.appendChild(item2) })
            else {
                const x = item.nodeName === "#text" ? [item.nodeValue, result.style.color] : [item.textContent, item.style.color]
                tag.appendChild(HTML().MakeSpan(x[0], x[1]));
            }
        })
        return tag;
    }

    return {
        HTML,
        CSS,
        MultipleLines,
        OneToMany
    };
};

export const HandleColor = (text, lang) => {
    let tmpTag;
    if(lang === "HTML") tmpTag = Code().HTML().Color(text)
    else if(lang === "CSS") tmpTag = Code().CSS().Color(text)
    return Code().MultipleLines(tmpTag, lang === "HTML");
}

export const ConvertStringToHTML = (str) => new DOMParser().parseFromString(str, 'text/html').body