import { useHistory as ua } from "react-router-dom";
import { useHistory } from "react-router-dom";
import React  from 'react'
import React1  from 'react'

let c = React1
c= 13
const d = c
const e = c
const f = d
function App() {
    const { go, goBack, goForward } = React1.useHistory();

    return (
        <>
            <button onClick={() => go(-2)}>
                Go 2 pages back
            </button>
            <button onClick={goBack}>Go back</button>
            <button onClick={goForward}>Go forward</button>
            <button onClick={() => go(2)}>
                Go 2 pages forward
            </button>
        </>
    );
}
