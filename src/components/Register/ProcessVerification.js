import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Loading from "../../assets/loading.gif"
import Success from "../../assets/success.gif"
import Failed from "../../assets/failed.gif"
import httpRequest from "../../config/http-request"

export default function ProcessVerification() {
    const [isLoading, setLoading] = useState(true)
    const [isSuccess, setSuccess] = useState(false)
    const navigate = useNavigate()
    const { token } = useParams()

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.patch(`${httpRequest.api.baseUrl}/verifyemail/${token}`).then(res => res.data)
                if (res.code === 200) {
                    setSuccess(true)
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            } catch (err) {
                setLoading(false)
            }
        }
        verifyEmail(token).catch(console.error)
    }, [token])

    if (isLoading) {
        return (
            <div className="flex w-full justify-center px-10">
                <img src={Loading} alt="loading-animation" width='500'></img>
            </div>
        )
    }

    const handleToLogin = e => {
        e.preventDefault()
        navigate("/login")
    }

    if (isSuccess) {
        return (
            <div className="flex w-full justify-center px-10">
                <div className="verifikasi_message_container mt-12">
                    <img className="w-1/5 m-auto mt-20" src={Success} alt="login-animation"></img>
                    <h1 className="mt-5 text-center text-3xl font-semibold">Verifikasi Sukses</h1>
                    <p className="text-center mt-5">Akun kamu telah terverifikasi. Silahkan login untuk mulai menggunakan aplikasi.</p>
                    <div className="login_btn_container w-full flex justify-center">
                        <button className="mt-5 m-auto w-56 h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleToLogin}>Ke Halaman Login</button>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex w-full justify-center px-10">
                <div className="verifikasi_message_container mt-12">
                    <img className="w-1/5 m-auto" src={Failed} alt="login-animation"></img>
                    <h1 className="text-center text-3xl font-semibold">Verifikasi Gagal</h1>
                    <p className="text-center mt-5">Tidak dapat melanjutkan proses verifikasi karena tautan tidak valid atau telah kedaluwarsa</p>
                </div>
            </div>
        )
    }
}
