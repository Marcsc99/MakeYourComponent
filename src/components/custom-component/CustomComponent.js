import React, {useState, useEffect} from "react";
import { base } from "../../utils/text";
import {StyledCustomeComponent} from "../styled-components/StyledCustomeComponent";

const CustomComponent = ({html, css}) => {
    const [text, setText] = useState(base(html));

    useEffect(()=> {
        setText(base(html));
    }, [html, css]);

    return (
        <StyledCustomeComponent>
            <textarea readOnly value = {text}></textarea>
        </StyledCustomeComponent>
    );
}

export default CustomComponent;