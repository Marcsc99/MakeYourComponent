import styled from 'styled-components';

export const StyledCustomeComponent = styled.div`
    background: white;
    width: 40%;
    height: 400px;

    textarea {
        font-size: 1rem;
        width:calc(100% - 20px);
        height:calc(100% - 20px);
        margin:0;
        padding:10px;
        border:none;
        background: #1e1e1e;
        resize: none;
        color:white;
        

        ::-webkit-scrollbar {
            width: 10px;
        }

        /* Track */
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
`