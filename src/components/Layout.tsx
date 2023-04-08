
import React, { useContext } from "react";
import styled from 'styled-components';
import { AppContext, AppState } from '../context/AppContext';


const MainContainer = styled.div`
display: grid;
transition: grid-template-columns 0.3s ease-in-out;
grid-template-columns: ${(props: AppState) => props.sidebarCollapsed ? '7% 1fr 20%' : '15% 1fr 20%'};
`;


export default function Layout({ children } : { children: React.ReactNode }) {
    const state = useContext(AppContext)
    return (
        <MainContainer sidebarCollapsed={state.sidebarCollapsed}>
            {children}
        </MainContainer>
    )
}
