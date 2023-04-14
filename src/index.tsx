import React from 'react';
import ReactDOM from 'react-dom/client';
import Layout from "./components/Layout";


import { AppContextProvider } from './context/AppContext';


function App() {
    return (
        <AppContextProvider>
            <Layout></Layout>
        </AppContextProvider>
    )
}

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
<React.StrictMode>
    <App/>
</React.StrictMode>
)
