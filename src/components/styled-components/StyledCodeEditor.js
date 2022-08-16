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
    position: relative;
    

    .shownCode {
        position:absolute;
        font-size: 1rem;
        width:calc(100% - 40px);
        height:calc(100% - 50px);
        margin-left:20px;
        padding:10px 10px 40px 10px;
        overflow:hidden;
        display:flex;
        flex-direction: column;
        white-space: pre;

        .line {
            min-height: 21px;
            span{ min-height: 21px; }
        }
        pointer-events: none; 
    }

    textarea {
        z-index: 1;
        position:absolute;
        outline: none;
        font-size: 1rem;
        width:calc(100% - 40px);
        height:calc(100% - 10px);
        margin:0;
        margin-left:20px;
        color: rgba(255,255,255,0);
        caret-color: rgba(255,255,255,1);
        padding:10px 10px 0 10px;
        border:none;
        background: none;
        opacity: 1;
        resize: none;
        overflow-y:scroll;
        overflow-x:hidden;
        white-space: nowrap;
        line-height: 21px;
        letter-spacing: 0px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
        ::-webkit-scrollbar { width: 10px; cursor:pointer;}
        ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 10px grey;
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
        height: calc(100% - 50px);
        background: #1e1e1e;
        display:flex;
        flex-direction: column;
        align-items: center;
        padding-top: 10px;
        padding-bottom:40px;
        overflow-y : hidden;

        span {
            font-size: 1rem; 
            margin:0px;
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