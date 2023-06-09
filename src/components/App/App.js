import React from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "../../context/auth";
import Book from "../Book/Book";
import BookCreate from "../Book/Create";
import BookEdit from "../Book/Edit";
import Overview from "../Overview/Overview";
import WithNav from "../Layout/WithNav";
import Login from "../Login/Login"
import Team from "../Team/Team";
import { Notfound } from "../Notfound/Notfound";
import ProcessVerification from "../Register/ProcessVerification";
import Register from "../Register/Register"
import Verification from "../Register/Verification";
import ForgetPassword from "../Reset/ForgetPassword";
import ResetPassword from "../Reset/ResetPassword";
import { RouteGuard } from "../RouteGuard/RouteGuard";
import NodeDetail from "../Node/NodeDetail";
import NodeEdit from "../Node/NodeEdit";
import NodeCreate from "../Node/NodeCreate";
import Node from "../Node/Node";

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Navigate to={"/login"} />}></Route>
                <Route element={<RouteGuard><WithNav /></RouteGuard>}>
                    <Route element={<Overview />} path="/overview"></Route>
                    <Route element={<Book />} path="/book"></Route>
                    <Route element={<Book />} path="/book"></Route>
                    <Route element={<Node />} path="/node"></Route>
                    <Route element={<NodeDetail />} path="/node/:id"></Route>
                    <Route element={<NodeEdit />} path="/node/:id/edit"></Route>
                    <Route element={<NodeEdit />} path="/node/:id/edit"></Route>
                    <Route element={<NodeCreate />} path="/node/create"></Route>
                    <Route element={<BookCreate />} path="/book/create"></Route>
                    <Route element={<BookEdit />} path="/book/:id/edit"></Route>
                    <Route element={<Team />} path="/team"></Route>
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
