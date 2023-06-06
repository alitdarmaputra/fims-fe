import React from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "../../context/auth";
import Book from "../Book/Book";
import BookCreate from "../Book/Create";
import BookDetail from "../Book/Detail";
import BookEdit from "../Book/Edit";
import Dashboard from "../Dashboard/Dashboard";
import WithNav from "../Layout/WithNav";
import Login from "../Login/Login"
import User from "../User/User";
import { Notfound } from "../Notfound/Notfound";
import ProcessVerification from "../Register/ProcessVerification";
import Register from "../Register/Register"
import Verification from "../Register/Verification";
import ForgetPassword from "../Reset/ForgetPassword";
import ResetPassword from "../Reset/ResetPassword";
import { RouteGuard } from "../RouteGuard/RouteGuard";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Navigate to={"/login"} />}></Route>
                <Route element={<RouteGuard><WithNav /></RouteGuard>}>
                    <Route element={<Dashboard />} path="/dashboard"></Route>
                    <Route element={<Book />} path="/book"></Route>
                    <Route element={<BookDetail />} path="/book/:id"></Route>
                    <Route element={<BookCreate />} path="/book/create"></Route>
                    <Route element={<BookEdit />} path="/book/:id/edit"></Route>
                    <Route element={<User />} path="/user"></Route>
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/verification" element={<Verification />} />
                <Route path="/register/verification/:token" element={<ProcessVerification />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="*" element={<Notfound />} />
            </Routes>
        </AuthProvider>
    )
}
