import { numToIDR } from "../../utils/formatter";
import TopNavbar from "../TopNavbar/TopNavbar";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import httpRequest from "../../config/http-request";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyError } from "../../utils/toast";
import { Navigate, useNavigate } from "react-router-dom";

export default function BookCreate() {
    const [category, setCategory] = useState("");
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [authenticated, setAuth] = useState(true);

    const handleSubmitBook = async e => {
        e.preventDefault()

        const title_input = document.querySelector("#title_input");
        const price_input = document.querySelector("#price_input");
        const authors_input = document.querySelector("#authors_input");
        const publisher_input = document.querySelector("#publisher_input");
        const published_input = document.querySelector("#published_input");
        const quantity_input = document.querySelector("#quantity_input");
        const page_input = document.querySelector("#page_input");
        const buy_date_input = document.querySelector("#buy_date_input");
        const summary_input = document.querySelector("#summary_input");

        if (title_input.value === "" || authors_input.value === "" || published_input.value === "" || quantity_input.value === "" || category === "") {
            notifyError("Pastikan semua field sudah terisi")
            return
        }

        if (published_input.value !== "" && isNaN(published_input.value)) {
            notifyError("Format tahun terbit tidak sesuai");
            return
        }

        if (page_input.value !== "" && isNaN(page_input.value)) {
            notifyError("Format jumlah halaman tidak sesuai");
            return
        }

        if (quantity_input.value !== "" && isNaN(quantity_input.value)) {
            notifyError("Format jumlah buku tidak sesuai");
            return
        }

        const payload = {
            title: title_input.value,
            price: parseInt(price_input.value.replace("Rp. ", "").replace(/\./, "")),
            authors: authors_input.value,
            publisher: publisher_input.value,
            published: parseInt(published_input.value),
            quantity: parseInt(quantity_input.value),
            page: parseInt(page_input.value),
            buy_date: new Date(buy_date_input.value).toISOString(),
            summary: summary_input.value,
            category_id: category,
        }

        try {
            setLoading(true);
            const res = await axios.post(`${httpRequest.api.baseUrl}/book`, payload);
            setLoading(false);

            if (res.status === 201) {
                navigate("/book");
            } else if (res.status === 400) {
                notifyError("Masukkan tidak sesuai");
            } else if (res.status === 401) {
                setAuth(false);
            } else {
                notifyError("Gagal membuat data buku");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const formatValue = e => {
        e.target.value = numToIDR(e.target.value);
    }

    const loadCategory = async search => {
        const res = await axios.get(`${httpRequest.api.baseUrl}/category?search=${search}`)
        const options = res.data?.data?.map(option => {
            return {
                value: option.id,
                label: `${option.id} | ${option.name}`
            }
        })
        return options;
    }

    if (!authenticated) {
        return <Navigate replace to="/dashboard"></Navigate>
    }

    return (
        <div className="flex-grow w-full px-3 md:px-6 pt-10 md:mt-0 md:ml-64 pb-5">
            <ToastContainer />
            <TopNavbar path=" Buku / Buat Buku" title="Buat Buku" className="bg-slate-50"></TopNavbar>

            <div className="book__container bg-white rounded-lg mb-10 shadow-lg p-5">
                <form onSubmit={handleSubmitBook}>
                    <div className="title_form mb-3">
                        <label className="font-bold text-sm" htmlFor="title_input">Judul <span className="text-red-500">*</span></label>
                        <input id="title_input" placeholder="Ketik judul" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="price_form mb-3">
                        <label className="font-bold text-sm" htmlFor="price_input">Harga</label>
                        <input onChange={formatValue} id="price_input" placeholder="Ketik harga" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="authors_form mb-3">
                        <label className="font-bold text-sm" htmlFor="authors_input">Pengarang <span className="text-red-500">*</span></label>
                        <input id="authors_input" placeholder="Ketik pengarang" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="publisher_form mb-3">
                        <label className="font-bold text-sm" htmlFor="publisher_input">Penerbit <span className="text-red-500">*</span></label>
                        <input id="publisher_input" placeholder="Ketik penerbit" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="published_form mb-3">
                        <label className="font-bold text-sm" htmlFor="published_input">Tahun Terbit <span className="text-red-500">*</span></label>
                        <input id="published_input" placeholder="Ketik tahun terbit" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="page_form mb-3">
                        <label className="font-bold text-sm" htmlFor="page_input">Jumlah Halaman</label>
                        <input id="page_input" placeholder="Ketik jumlah halaman" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="quantity_form mb-3">
                        <label className="font-bold text-sm" htmlFor="quantity_input">Jumlah Buku <span className="text-red-500">*</span></label>
                        <input id="quantity_input" placeholder="Ketik jumlah buku" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                    </div>

                    <div className="buy_date_form mb-3">
                        <label className="font-bold text-sm" htmlFor="buy_date_input">Tanggal Pembelian <span className="text-red-500">*</span></label>
                        <input id="buy_date_input" placeholder="Tanggal pembelian" className="font-sans focus:outline-black border-2 mt-2 w-full h-10 rounded-md p-2" type="date"></input>
                    </div>

                    <div className="summary_form mb-3">
                        <label className="font-bold text-sm" htmlFor="summary_input">Ringkasan</label>
                        <textarea id="summary_input" placeholder="Ketik ringkasan" className="font-sans focus:outline-black border-2 mt-2 w-full h-72 rounded-md p-2"></textarea>
                    </div>

                    <div className="category_form mb-3">
                        <label className="font-bold text-sm" htmlFor="category_input">Kategori <span className="text-red-500">*</span></label>
                        <AsyncSelect
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: state.isFocused ? '#E5E7EB' : '#E5E7EB',
                                    borderWidth: state.isFocused ? '2px' : '2px',
                                }),
                            }}
                            classNames={{
                                control: (state) => state.isFocused ? 'mt-2 rounded-md' : 'mt-2 rounded-md',
                            }}
                            id="category_input"
                            cacheOptions
                            loadOptions={loadCategory}
                            placeholder="Pilih kategori"
                            noOptionsMessage={() => "Kategori tidak ditemukan"}
                            onChange={choice => setCategory(choice.value)}
                        >
                        </AsyncSelect>
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
                        <button className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleSubmitBook}>Buat</button>
                    }
                </form>
            </div>
        </div>
    )
}

