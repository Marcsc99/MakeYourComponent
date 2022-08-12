import React, {useState, useEffect} from "react";
import styled from 'styled-components';

const StyledResult = styled.div`
    background: white;
    width: 40%;
    height: 400px;
    :first-child { 
        ${props => props.css} 
    }
`

const Result = ({js, css}) => {
    const [result, setResult] = useState(js);

    useEffect(() => {
        setResult(ConvertStringToHTML(js))
    }, [js, css]);

    const ConvertStringToHTML = (str) => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
     };

    return (
        <StyledResult css = {css}>
            <div dangerouslySetInnerHTML={{ __html: result.innerHTML }}></div>
        </StyledResult>
    );
}

export default Result;