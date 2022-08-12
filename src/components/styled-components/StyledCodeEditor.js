import styled from 'styled-components';

export const StyledCodeEditor = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 40%;
    height: 400px;
`

export const StyledCodeEditorHeader = styled.div`
    width: 100%;
    height: 50px;
    color: white;
    background:black;
    display:flex;
    justify-content: flex-start;
    align-items: center;
    
    h2 {
        font-size: 1.5rem;
        font-weight: bold;
        padding: 10px;
    }
`

export const StyledCodeEditorBody = styled.div`
    width: 100%;
    height: 350px;
    color: white;
    background: #1e1e1e;
    display:flex;

    div {
        outline: none;
        font-size: 1rem;
        width:calc(100% - 20px);
        height:calc(100% - 10px);
        margin:0;
        padding:10px 10px 0 10px;
        border:none;
        background: #1e1e1e;
        resize: none;
        color:white;
        overflow-y:scroll;
        display:flex;

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px grey;
            border-radius: 10px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: lightgrey;
            border-radius: 10px;
        }
    }
    section {
        width: 20px;
        height: calc(100% - 10px);
        background: #1e1e1e;
        display:flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
        overflow-y : hidden;

        span {
            font-size: 1rem; 
            margin:-1px;
        }

        ::-webkit-scrollbar {
            width: 0px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px grey;
            border-radius: 10px;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            width:0px;
            background: lightgrey;
            border-radius: 0px;
        }
    }
`