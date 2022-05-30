import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter } from "react-router-dom";
import { DAppProvider, TestBNB } from '@usedapp/core'
import "bootstrap/dist/css/bootstrap.min.css";

const config = {
    readOnlyChainId: TestBNB.chainId,
    readOnlyUrls: {
        [TestBNB.chainId]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    },
}

ReactDOM.render(
    <HashRouter>
        <React.StrictMode>
            <DAppProvider config={config}>
                <App />
            </DAppProvider>
        </React.StrictMode>
    </HashRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
