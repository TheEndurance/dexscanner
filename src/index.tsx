import React from 'react';
import ReactDOM from 'react-dom';
import Chart from "./components/Chart";
import Sidebar from "./components/Sidebar";
import Infobar from "./components/Infobar";
import Layout from "./components/Layout";


import { AppContextProvider } from './context/AppContext';


function App() {
    return (
        <AppContextProvider>
            <Layout>
                <Sidebar />
                <Chart />
                <Infobar />
            </Layout>
        </AppContextProvider>
    )
}

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
<React.StrictMode>
    <App/>
</React.StrictMode>
)
