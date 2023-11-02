import './App.css'

import HomePage from "./pages/home/HomePage.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NewBlogEntry from "./pages/blogentry/NewBlogEntry.tsx";
import EditBlogEntry from "./pages/blogentry/EditBlogEntry.tsx";
import DetailsPage from "./pages/details/DetailsPage.tsx";
export default function App()
{
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/newentry" element={<NewBlogEntry />} />
                    <Route path="/edit-entry/:id" element={<EditBlogEntry />} />
                    <Route path="/details/:id" element={<DetailsPage/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}
