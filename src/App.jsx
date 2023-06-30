import React from "react";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';

import {logo} from './assets';
import {ImageCrop} from './page';

const App = () => {
    return (
        <BrowserRouter>
            <header
                className="w-full flex justify-between items-center bg-white shadow-md sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]">
                <Link to="/">
                    <img src={logo}  alt="logo" className="w-28 object-contain" />
                </Link>
                <div className="gap-4 flex">
                    <Link to="/" className="font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md">
                        Image Crop
                    </Link>
                </div>
            </header>
            <main className="w-full sm:p-8 px-4 py-8 bg-[#f9fafe] min-h-[calc(100vh - 73px)]">
                <Routes>
                    <Route path="/" element={<ImageCrop/>} />
                </Routes>
            </main>
        </BrowserRouter>
    );
};

export default App;
