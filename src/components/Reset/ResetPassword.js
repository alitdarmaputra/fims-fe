import axios from 'axios';
import { useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import AbiwaraLogoText from '../../assets/logo_text.svg'
import httpRequest from '../../config/http-request';
import { notifyError } from '../../utils/toast';
import Success from '../../assets/success.gif';
import { useParams } from 'react-router-dom';

export default function ResetPassword() {
    const newPassword = useRef()
    const confirmPassword = useRef()

    const { token } = useParams()

    const [isSuccess, setSuccess] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const handleResetPassword = async e => {
        e.preventDefault();
        if (newPassword.current.value !== confirmPassword.current.value) {
            notifyError("Password and confirm password must be same")
        }

        const data = {
            token: token,
            new_password: newPassword.current.value
        }

        if (data.new_password === "") {
            notifyError("New password can not be empty");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.patch(`${httpRequest.api.baseUrl}/auth/redeem-reset-token`, data).then(res => res.data)

            if (res.code === 200) {
                setSuccess(true);
                setLoading(false);
            }
        } catch (err) {
            notifyError("Failed reset password");
            setLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="flex w-full justify-center px-10">
                <div className="verifikasi_message_container mt-12">
                    <img className="w-1/5 m-auto mt-20" src={Success} alt="login-animation"></img>
                    <h1 className="mt-5 text-center text-3xl font-semibold">Success Reset Password</h1>
                    <p className="text-center mt-5">Password has been updated.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex justify-center">
            <ToastContainer />
            <div className="register_container">
                <div className="register_header">
                    <img src={AbiwaraLogoText} alt="Abiwara logo" className="m-auto mt-10 w-40"></img>
                    <h1 className="title mt-8 text-3xl">Reset Password</h1>
                </div>

                <div className="register_form">
                    <form className="mt-6 " action="">
                        <div className="new_password_form">
                            <label className="font-bold text-sm" htmlFor="new_password_input">Password Baru <span className="text-red-500">*</span></label>
                            <input ref={newPassword} id="new_password_input" placeholder="Password baru" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 border-2 mt-2 w-full h-10 rounded-md p-2" type="password"></input>
                        </div>
                        <div className="mt-5 confirm_password_form">
                            <label className="font-bold text-sm" htmlFor="confirm_password">Confirm Password <span className="text-red-500">*</span></label>
                            <input ref={confirmPassword} id="confirm_password" placeholder="Confirm password" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 border-2 mt-2 w-full h-10 rounded-md p-2" type="password"></input>
                        </div>

                        {isLoading ?
                            <button disabled type="button" className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900">
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                                Memuat...
                            </button>
                            :
                            <button className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleResetPassword}>Kirim</button>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}
