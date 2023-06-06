import TopNavbar from "../TopNavbar/TopNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import httpRequest from "../../config/http-request";
import { BsFillPencilFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { parseJWT } from "../../utils/auth";

export default function BookDetail() {
    const [isLoading, setLoading] = useState(false);
    const [bookDetail, setBookDetail] = useState({});
    const { id } = useParams();
    const [authenticated, setAuth] = useState(true);

    const auth = useAuth();
    const token = parseJWT(auth.cookies?.token);

    useEffect(() => {
        async function getBookDetail() {
            const res = await axios.get(`${httpRequest.api.baseUrl}/book/${id}`);
            if (res.status === 200) {
                setBookDetail(res.data.data);

                setLoading(false);
            } else if (res.status === 401) {
                setLoading(false);
                setAuth(false);
            }
        }

        getBookDetail()
    }, [id])

    if (!authenticated) {
        return <Navigate replace to="/login"></Navigate>
    }

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <svg aria-hidden="true" role="status" className="inline w-8 h-8 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
            </div>
        )
    }

    return (
        <div className="flex-grow w-full px-3 md:px-6 pt-10 md:mt-0 md:ml-64 pb-5">
            <TopNavbar title="Detail Buku" path=" Buku / Detail" className="bg-slate-50"></TopNavbar>

            <div className="book__container bg-white rounded-lg shadow-lg p-5 mb-10">
                <div className="detail_head__container flex justify-between p-5 box-border items-center">
                    <p className="text-slate-500 mt-2 font-semibold">Cerita Rakyat</p>

                    {token.role === 1 && (
                        <div className="flex justify-end">
                            <Link to={`/book/${id}/edit`} className="p-2 shadow-lg rounded-lg bg-blue-700 text-white">
                                <BsFillPencilFill size="20px" />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="title__container px-5">
                    <h1 className="font-bold text-3xl">{bookDetail.title}</h1>
                </div>

                <div className="book_detail__container px-5 h-full">
                    <table className="mt-10">
                        <tr>
                            <td>Pengarang</td>
                            <td className="w-10 text-center"> : </td>
                            <td>{bookDetail.authors}</td>
                        </tr>
                        <tr>
                            <td>Penerbit</td>
                            <td className="w-10 text-center"> : </td>
                            <td>{bookDetail.publisher}</td>
                        </tr>
                        <tr>
                            <td>Tahun Terbit</td>
                            <td className="w-10 text-center"> : </td>
                            <td>{bookDetail.published}</td>
                        </tr>
                        <tr>
                            <td>Sisa</td>
                            <td className="w-10 text-center"> : </td>
                            <td>{bookDetail.remain}</td>
                        </tr>
                        <tr>
                            <td>Ringkasan</td>
                            <td className="w-10 text-center"> : </td>
                        </tr>
                    </table>

                    <p className="mt-3">{bookDetail.summary}</p>
                </div>
            </div>
        </div>
    )
}

