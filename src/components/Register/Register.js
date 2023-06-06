import axios from 'axios';
import { useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import FimsLogoText from '../../assets/logo_text.svg';
import httpRequest from '../../config/http-request';
import { notifyError } from '../../utils/toast';
import { AiFillCheckCircle } from 'react-icons/ai';

export default function Register() {
    const [isHide, setHide] = useState(true);
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [isLen, setLen] = useState(false);
    const [isCase, setCase] = useState(false);
    const [isChar, setChar] = useState(false);

    const email = useRef()
    const name = useRef()
    const password = useRef()
    const confirmPassword = useRef()


    const casePattern = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    const charPattern = /[!@#$%^&*(),.?":{}|<>]/

    const updatePasswordView = e => {
        e.preventDefault();
        setHide(!isHide)
        let passwordInput = document.getElementById("password_input")
        let confirmInput = document.getElementById("confirm_password_input")
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        confirmInput.type = confirmInput.type === "password" ? "text" : "password";
    }

    const handleRegister = async e => {
        e.preventDefault();
        const data = {
            email: email.current.value,
            name: name.current.value,
            password: password.current.value,
            confirm_password: confirmPassword.current.value
        }

        if (data.email === "") {
            notifyError("Email tidak boleh kosong")
            return
        }

        if (data.name === "") {
            notifyError("Nama Lengkap tidak boleh kosong")
            return
        }

        if (data.password === "") {
            notifyError("Password tidak boleh kosong")
            return
        }

        if (data.password !== data.confirm_password) {
            notifyError("Password dan konfirmasi password tidak sama")
            return
        }

        if (data.password.length <= 8 || !casePattern.test(data.password) || !charPattern.test(data.password)) {
            notifyError("Password tidak sesuai")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${httpRequest.api.baseUrl}/auth/register`, data).then(res => res.data)
            setLoading(false)

            if (res.code === 201) {
                navigate("/register/verification")
            }
        } catch (err) {
            setLoading(false)
            notifyError("Gagal melakukan registrasi")
        }
    }

    return (
        <div className="w-full flex justify-center h-screen">
            <ToastContainer />
            <div className="register_container px-5">
                <div className="register_header">
                    <img src={FimsLogoText} alt="Fims logo" className="m-auto mt-10 h-10"></img>
                    <h1 className="title mt-8 text-3xl">Register</h1>
                    <p className="sub_title mt-3 text-sm text-slate-500">Getting start by creating new account.</p>
                </div>

                <div className="register_form">
                    <form className="mt-6" action="">
                        <div className="email_form">
                            <label className="font-bold text-sm" htmlFor="email_input">Email <span className="text-red-500">*</span></label>
                            <input ref={email} id="email_input" placeholder="Email" className="font-sans focus:outline-none focus:shadow-md focus:shadow-purple-200 border-2 mt-2 w-full h-10 rounded-md p-2" type="email"></input>
                        </div>
                        <div className="name_form mt-5">
                            <label className="font-bold text-sm" htmlFor="name_input">Name <span className="text-red-500">*</span></label>
                            <input ref={name} id="name_input" placeholder="Name" className="font-sans focus:outline-none focus:shadow-md focus:shadow-purple-200 border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                        </div>
                        <div className="password_form mt-5">
                            <label className="font-bold text-sm" htmlFor="password_input">Password <span className="text-red-500">*</span></label>
                            <input ref={password} id="password_input" placeholder="Password" className="font-sans focus:outline-none focus:shadow-md focus:shadow-purple-200 border-2 mt-2 w-full h-10 rounded-md p-2" type="password"
                                onChange={() => {
                                    if (password.current.value.length >= 8) {
                                        setLen(true);
                                    } else {
                                        setLen(false);
                                    }

                                    if (casePattern.test(password.current.value)) {
                                        setCase(true);
                                    } else {
                                        setCase(false);
                                    }

                                    if (charPattern.test(password.current.value)) {
                                        setChar(true);
                                    } else {
                                        setChar(false);
                                    }
                                }}>
                            </input>
                            <div className={`len_validation__container flex items-center mt-5 w-full ${isLen ? "text-green-500" : "text-slate-400"}`}>
                                <AiFillCheckCircle className='text-xl'></AiFillCheckCircle>
                                <p className='ml-2'>Minimum length of 8 characters</p>
                            </div>
                            <div className={`case_validation__container flex items-center mt-2 w-full ${isCase ? "text-green-500" : "text-slate-400"}`}>
                                <AiFillCheckCircle className='text-xl'></AiFillCheckCircle>
                                <p className='ml-2'>Containing lower and upper case</p>
                            </div>
                            <div className={`case_validation__container flex items-center mt-2 w-full ${isChar ? "text-green-500" : "text-slate-400"}`}>
                                <AiFillCheckCircle className='text-xl'></AiFillCheckCircle>
                                <p className='ml-2'>Containing combination of alphabet, number,<br></br> and symbol</p>
                            </div>
                        </div>
                        <div className="confirm_password_form mt-5">
                            <label className="font-bold text-sm" htmlFor="confirm_password_input">Confirm Password <span className="text-red-500">*</span></label>
                            <input ref={confirmPassword} id="confirm_password_input" placeholder="Confirm password" className="font-sans focus:outline-none focus:shadow-md focus:shadow-purple-200 border-2 mt-2 w-full h-10 rounded-md p-2" type="password"></input>
                        </div>

                        <div className="view_password_form mt-5">
                            <input id="view_password" onInput={e => updatePasswordView(e)} type="checkbox"></input>
                            <label className="ml-2 text-sm" htmlFor="view_password_input">Show password</label>
                        </div>

                        {isLoading ?
                            <button disabled type="button" className="mt-10 w-full h-10 bg-purple-700 text-white font-bold rounded-lg hover:bg-blue-900">
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                                Loading...
                            </button>
                            :
                            <button className="mt-10 w-full h-10 bg-purple-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleRegister}>Register</button>
                        }

                    </form>

                    <p className="mt-8 mb-32">Already have an account? <NavLink className="underline text-purple-700" to="/login">Login here.</NavLink></p>
                </div>
            </div >
        </div >
    );
}
