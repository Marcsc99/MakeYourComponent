import styled from 'styled-components';

export const StyledCustomeComponent = styled.div`
    width: 40%;
    height: 400px;

    textarea {
        width:calc(100% - 20px);
        height:calc(100% - 20px);
        padding:10px;
        
        background: #1e1e1e;
        resize: none;
        border:none;

        font-size: 1rem;
        color:white;
        
        ::-webkit-scrollbar { width: 10px }
        ::-webkit-scrollbar-track { box-shadow: inset 0 0 5px grey; border-radius: 10px }
        ::-webkit-scrollbar-thumb { background: lightgrey; border-radius: 10px }
    }
`