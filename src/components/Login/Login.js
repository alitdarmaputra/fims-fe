import { useRef, useState } from 'react'
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineMail, AiOutlineKey } from 'react-icons/ai'
import FimsLogoText from '../../assets/logo_text.svg';
import LoginImage from '../../assets/login_image.svg';
import PropTypes from 'prop-types'
import { Navigate, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import axios from 'axios'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { notifyError } from '../../utils/toast'
import httpRequest from '../../config/http-request'

export default function Login() {
    const [isHide, setHide] = useState(true);
    const auth = useAuth()
    const [authenticated, setAuth] = useState(false);
    const location = useLocation()

    const redirectPath = location.state?.path || '/dashboard'

    const email = useRef('')
    const password = useRef('')

    const handleLogin = async e => {
        e.preventDefault()

        let data = {
            email: email.current.value,
            password: password.current.value
        }

        if (data.email === "" || data.password === "") {
            notifyError("Email and password must not be empty")
            return
        }

        try {
            const res = await axios.post(`${httpRequest.api.baseUrl}/auth/login`, data).then(res => res.data)
            let token = res.data;
            auth.login(token);
            setAuth(true);
        } catch (err) {
            if (err.response?.status === 401) {
                notifyError("Wrong email and password")
            } else if (err.response?.status === 400) {
                notifyError("Invalid input");
            } else {
                notifyError("Server error")
            }
        }
    }

    const updatePasswordView = e => {
        e.preventDefault();
        setHide(!isHide);
        var input = document.getElementById("password_input");
        input.type = input.type === "password" ? "text" : "password";
    }

    if (authenticated) {
        return <Navigate replace to={redirectPath}></Navigate>
    }

    return (
        <div className="login_container flex h-screen">
            <ToastContainer />

            <div className="login_form_container flex grow justify-center items-center pt-16">
                <div className="box-border login_form">
                    <img src={FimsLogoText} alt="Fims logo" className='h-10 md:absolute top-5 left-5'></img>

                    <h1 className="title text-3xl font-bold">Wellcome back</h1>
                    <p className="sub_title mt-3 text-sm text-slate-500">Please enter your email and password.</p>

                    <form className="mt-8 md:w-96">
                        <div className="email_form">
                            <label className="font-bold text-sm" htmlFor="email_input">Email <span className="text-red-500">*</span></label>
                            <div className="email_input_button flex mt-2 focus-within:shadow-md focus-within:shadow-blue-200 rounded-md items-center">
                                <div className='h-10 bg-blue-50 rounded-l-md flex items-center p-1'><AiOutlineMail className='shadow-sm text-3xl bg-white p-1 rounded-md text-purple-500'></AiOutlineMail></div>
                                <input id="email_input" ref={email} placeholder="Email" className="font-sans bg-blue-50 focus:outline-none w-full h-10 rounded-r-lg p-2" type="email"></input>
                            </div>
                        </div>
                        <div className="mt-5 password-form">
                            <label className="font-bold text-sm" htmlFor="password_input">Password <span className="text-red-500">*</span></label>
                            <div className="password_input_button flex mt-2 focus-within:shadow-md focus-within:shadow-blue-200 rounded-md">
                                <div className='h-10 bg-blue-50 rounded-l-md flex items-center p-1'><AiOutlineKey className='shadow-sm text-3xl bg-white p-1 rounded-md text-purple-500'></AiOutlineKey></div>
                                <input id="password_input" ref={password} placeholder="Password" className="font-sans bg-blue-50 focus:outline-none w-full h-10 rounded-l-lg p-2" type="password"></input>
                                <button className='bg-blue-50 rounded-r-md px-1 text-slate-300' onClick={e => updatePasswordView(e)} type='button'>
                                    {
                                        isHide ? <AiOutlineEyeInvisible size='30px' /> : <AiOutlineEye size='30px' />
                                    }
                                </button>
                            </div>
                        </div>
                        <div className="forget_password mt-5 flex justify-end text-purple-700">
                            <NavLink className="hover:underline" to="/forget-password">Forget password</NavLink>
                        </div>
                        <button className="mt-5 w-full h-10 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-900" onClick={handleLogin}>Log in</button>
                    </form>
                    <p className="mt-8">Don't have an account? <NavLink className="underline text-purple-700" to="/register">Register.</NavLink></p>
                    <p className='self-end text-slate-300 w-full text-center mt-8 text-sm'>
                        © 2023 Fims. All rights reserved.
                    </p>
                </div>
            </div>

            <div className="right_hero_container hidden md:flex h-full w-5/12 group overflow-visible md:justify-center md:flex-col">
                <h1 className='z-10 text-md text-black font-montserrat mb-5'>Figma Management System</h1>
                <h1 className='z-10 text-md font-bold text-3xl text-black mb-6'>Fueling Design Success, <br></br> Simplifying Management</h1>
                <img src={LoginImage} className="w-72" alt="login_image"></img>
            </div>
        </div>
    );
}

Login.propType = {
    setToken: PropTypes.func.isRequired
}
