import React, {useState, useEffect} from "react";
import styled from 'styled-components';
import { ConvertStringToHTML } from "../../utils/text";

const StyledResult = styled.div`
    background: white;
    width: 40%;
    height: 400px;
`
const StyledResultBody = styled.div`${props => props.css}`

const Result = ({html, css}) => {
    const [result, setResult] = useState(html);

    useEffect(() => { setResult(ConvertStringToHTML(html)) }, [html]);

    return (
        <StyledResult >
            <StyledResultBody id="body" dangerouslySetInnerHTML={{ __html: result.innerHTML }} css = {css}></StyledResultBody>
        </StyledResult>
    );
}

export default Result;