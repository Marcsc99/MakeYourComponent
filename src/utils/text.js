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

export const HandleColor = (text) => {
    var tag = document.createElement("div");
    tag = Type.String(text, tag)
    tag = Type.Enter(text, tag)
    return tag
}

const Type = {
    String: (text, parent) => {
        let finalTag = parent;
        let stop = false
        let result = text.indexOf("\"")
        let result2 = text.indexOf("\"", result + 1)

        var tagIni = document.createElement("span");
        var textoIni = document.createTextNode(text.substring(0, result));
        tagIni.appendChild(textoIni);
        finalTag.appendChild(tagIni);

        console.log(tagIni, "tagIni")

        do {
            if(result === -1) {
                stop = true
                var tagFin1 = document.createElement("span");
                var textoFin1 = document.createTextNode(text.substring(result + 1, text.length-1))
                tagFin1.appendChild(textoFin1);
                finalTag.appendChild(tagFin1);
                console.log(tagFin1, "tagFin1")
            }
            else {
                if(result2 === -1) {
                    stop = true
                    finalTag.appendChild(document.createTextNode(text.substring(result + 1, text.length-1)))

                    var tagFin = document.createElement("span");
                    var textoFin = document.createTextNode(text.substring(result + 1, text.length-1))
                    tagFin.appendChild(textoFin);
                    finalTag.appendChild(tagFin);
                    console.log(tagFin, "tagFin")
                }
                else{
                    var tag = document.createElement("p");
                    tag.setAttribute("style", 'color: green;' );
                    var texto = document.createTextNode(text.substring(result, result2 + 1));
                    tag.appendChild(texto);
                    finalTag.appendChild(tag);
                    console.log(tag, "tag")
                    let before = result2 + 1;

                    result = text.indexOf("\"", result2 + 1)
                    result2 = text.indexOf("\"", result + 1)

                    if(result2 !== -1 && result !== -1) {
                        var tagMid = document.createElement("span");
                        var textoMid = document.createTextNode(text.substring(before, result))
                        tagMid.appendChild(textoMid);
                        finalTag.appendChild(tagMid);
                        console.log(tagMid, "tagMid")
                    }
                }
            }
        } while(!stop)

        return finalTag
    },
    Enter: (parent) => {
        let finalTag = parent;
        console.log(parent)
        parent.childNodes.forEach(child => {
            let text = child.nodeValue;
            let result = text.indexOf("\n")
            var tagChild = document.createElement("span");
            do{
                if(result === -1) tagChild.appendChild(document.createTextNode(text))
                else {
                    tagChild.appendChild(document.createTextNode(text.substring(0, result)))
                    let tag = document.createElement("br");
                    tagChild.appendChild(tag)
                    text = text.substring(result + 1, text.length)
                    result = text.indexOf("\n")
                }
                
            } while(result !== -1)
            finalTag.appendChild(tagChild);
        })
        return finalTag;
    }
}
