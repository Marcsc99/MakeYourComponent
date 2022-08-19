import styled from 'styled-components';

export const StyledCodeEditor = styled.div`
    width: 40%;
    height: 400px;
`

export const StyledCodeEditorHeader = styled.div`
    width: 100%;
    height: 50px;
    color: white;
    background:black;
    
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
    }

    textarea {
        z-index: 1;
        position:absolute;
        width:calc(100% - 40px);
        height:calc(100% - 10px);
        margin-left:20px;
        padding:10px 10px 0 10px;

        outline: none;
        border:none;
        background: none;
        resize: none;

        font-size: 1rem;
        color: rgba(255,255,255,0);
        caret-color: rgba(255,255,255,1);
        white-space: nowrap;
        line-height: 21px;
        
        overflow-y:scroll;
        overflow-x:hidden;

        ::-webkit-scrollbar { width: 10px}
        ::-webkit-scrollbar-track { box-shadow: inset 0 0 10px grey; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: lightgrey; border-radius: 10px; }
    }
    section {
        width: 20px;
        height: calc(100% - 50px);
        display:flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0 40px 0;
        overflow-y : hidden;
    }
`