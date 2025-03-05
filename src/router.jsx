import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/main';
import Login from './pages/login';
import Check from './pages/check';
import Bingo from './pages/bingo';
import Setting from './pages/setting';

const RouterComponent = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Setting />} />
                <Route path="/main" element={<Main />} />
                <Route path="/login" element={<Login />} />
                <Route path="/check" element={<Check />} />
                <Route path="/bingo" element={<Bingo />} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouterComponent;