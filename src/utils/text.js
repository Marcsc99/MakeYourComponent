export const getLine = (text, index) => text.substring(0, index).split("\n").length;

const removeTabs = (text, start, end) => {
    const split = text.substring(start, end).split(/\r?\n/);
    if(split.length > 1){
        const first = getLine(text, start) -1;
        const final = getLine(text, end);
        return {text: text.split(/\r?\n/).map((item, i) => (i >= first && i < final && item.substring(0,1) === "\t") ? item.substring(1, item.length) : item).join('\n'), lenght: split.length}
    }
    else if(text.substring(start-1,start) === "\t") return{ text: text.substring(0,start-1) + text.substring(start, text.length), length: 1 };
    
    return {text: text, length: 0};
}

const setTabs = (text, start, end) => {
    let result;
    let selected = text.substring(start, end);

    const split = selected.split(/\r?\n/);
    if(split.length > 1){
        const first = getLine(text, start) - 1;
        const final = getLine(text, end);
        result = text.split(/\r?\n/).map((item, index) => ((index >= first && index < final) ? "\t" : "") + item).join('\n');
    }
    else result = add(text, start, end, "\t" + selected);
    
    return { text: result, length: split.length };
}

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
    if(e.key.length === 1){
        if(e.ctrlKey){
            if(e.key === "c") Handle.Copy(selected);
            else if(e.key === "x") result = Handle.Cut(result, start, end, setSelection);
            else if(e.key === "v") result = await Handle.Paste(result, start, end, setSelection);
        }
        else result = Handle.SingleChar(e, text, start, end, setSelection);
    }
    else {
        if(e.shiftKey) {
            if (e.keyCode === 9) result = Handle.Tab(e, text, start, end, setSelection);
        }
        else {
            if (e.keyCode === 9) result = Handle.Tab(e, text, start, end, setSelection); 
            else if (e.keyCode === 8) result = Handle.BackSpace(e, text, start, end, setSelection); 
            else if(e.keyCode === 13) result = Handle.Enter(e, text, start, end, setSelection);
        }
    }
    setter(result);
    setter2(result);
}

const add = (text, start, end, c) => text.substring(0, start) + c + text.substring(end);

const Handle = {
    Enter: (e, text, start, end, setSelection) => {
        e.preventDefault();
        setSelection([start + 1, start + 1])
        return add(text, start, end, "\n");
    },
    SingleChar: (e, text, start, end, setSelection) => {
        e.preventDefault();
        setSelection([start + 1, start + 1]);
        return add(text, start, end, e.key);
    },
    BackSpace: (e, text, start, end, setSelection) => {
        e.preventDefault();
        let result, sum = 1;
        if(start !== end) { result = add(text, start, end, ""); sum = 0;}
        else result = add(text, start - 1, end, "");;
        setSelection([start-sum, start-sum])
        return result;
    },
    Tab: (e, text, start, end, setSelection) => {
        e.preventDefault();
        let result = e.shiftKey ? removeTabs(text, start, end) : setTabs(text, start, end);
        if(result.text !== text) setSelection(e.shiftKey ? [start - 1, end - result.length] : [start + 1, end + result.length])
        return result.text;
    },
    Cut: (text, start, end, setSelection) => {
        const selected = text.substring(start, end);
        navigator.clipboard.writeText(selected);
        setSelection([start, start]);
        return add(text, start, end, "");
    },
    Paste: async (text, start, end, setSelection) => {
        const selected = await navigator.clipboard.readText();
        setSelection([start + selected.length, start + selected.length]);
        return add(text, start, end, selected);
    },
    Copy: (text) => {
        navigator.clipboard.writeText(text);
    }
}

export const HandleColor = (text, lang) => {
    var tag = document.createElement("div");
    if(lang === "HTML"){
        const splited = text.split(/\r?\n|\r|\n/g);
        splited.forEach(line => {
            var lineTag = document.createElement("div");
            lineTag.classList.add('line');
            lineTag = ColorHTML(line, lineTag) 
            tag.appendChild(lineTag);
        })
    }
    else if(lang === "CSS"){
        var lineTag = document.createElement("div");
        lineTag.classList.add('line');
        lineTag = ColorCSS(text, lineTag) 
        console.log(lineTag)
        tag.appendChild(lineTag);
    }
    
    return tag
}

const ColorHTML = (text, div) => {
    let finalTag = div;

    const index1 = text.indexOf("<");
    const index2 = text.indexOf(">");
    if(index1 !== 0) {
        if(index1 === -1){ 
            finalTag.appendChild(document.createTextNode(text))
            return finalTag; 
        }
        finalTag.appendChild(document.createTextNode(text.substring(0, index1)))
    }
    if(index2 === -1) {
        let subs = text.substring(index1 + 1, text.length);
        finalTag = MakeTag(subs, finalTag, false);
        return finalTag;
    }

    const tag = text.substring(index1 + 1, index2);
    finalTag = MakeTag(tag, finalTag, true);
    const texto = text.substring(index2 + 1, text.length);
    return ColorHTML(texto, finalTag);
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
    
    let infoCopy = info;
    const tag = MakeSpan(space ? " " : "" , "orange")
    let index1, index2;
    do {
        index1 = infoCopy.indexOf("\"");
        index2 = infoCopy.indexOf("\"", index1 + 1);

        if(index1 === -1 || index2 === -1){
            tag.appendChild(document.createTextNode(infoCopy));
            return tag;
        }
        else {
            tag.appendChild(document.createTextNode(infoCopy.substring(0, index1)));
            tag.appendChild(MakeSpan(infoCopy.substring(index1, index2 + 1), "green"));
            infoCopy = infoCopy.substring(index2 + 1, infoCopy.length);
        }
        
    } while(index1 !== -1 && index2 !== -1);

    return tag;
}

const ColorCSS = (text, div) => {
    let finalTag = div;
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
    console.log(sections, "sections")
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
        finalTag.appendChild(MakeSpan(splited2[0], "red"));
        splited2.forEach((item2, index) => {
            if(index !== 0){
                finalTag.appendChild(document.createTextNode(":"));
                finalTag.appendChild(MakeSpan(item2, "lightblue"));
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
                finalTag.appendChild(MakeSpan(text.substring(colon ? (colonVal): (lastTwoPoints + 1), i), colon ? "lightgrey": "orange"))
                lastTwoPoints = i;
                finalTag.appendChild(document.createTextNode(":"));
            }
            else if(char === ";"){
                finalTag.appendChild(MakeSpan(text.substring(Math.max(lastSemiColon, lastTwoPoints) + 1, i), "orange"))
                lastSemiColon = i;
                finalTag.appendChild(document.createTextNode(";"));
            }
            else if(i === splited.length - 1){
                if(lastTwoPoints > lastSemiColon) {
                    finalTag.appendChild(MakeSpan(text.substring(lastTwoPoints + 1, i + 1), "orange"))
                }
                else{
                    finalTag.appendChild(MakeSpan(text.substring(lastSemiColon === 0 ? 0 : lastSemiColon + 1, i+1), "lightgrey"))
                }

            }
        }

        if(char === "{") { 
            if(!open) i1 = lastSemiColon === 0 ? 0 : lastSemiColon + 1
            open = true; count++;
        }
        if(char === "}") count--;
        //if(char === "}" && !open) finalTag.appendChild(document.createTextNode("}"));
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

const reverseString = (str) => str.split("").reverse().join("");