import React, { useRef } from 'react';
import TopNavbar from "../TopNavbar/TopNavbar";
import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import httpRequest from "../../config/http-request";
import { Editor } from '@tinymce/tinymce-react';
import { notifyError } from "../../utils/toast";
import { ToastContainer } from 'react-toastify';

export default function NodeCreate() {
    const [isLoading, setLoading] = useState(false);
    const [authenticated, setAuth] = useState(true);
    const descriptionRef = useRef(null);

    let tinyToken = process.env.REACT_APP_TINY_TOKEN
    const navigate = useNavigate();

    const handleSubmitNode = async e => {
        e.preventDefault()

        const title_input = document.querySelector("#input-node_title");
        const figma_key_input = document.querySelector("#input-figma_key");
        const node_id_input = document.querySelector("#input-node_id");

        if (title_input.value === "" || figma_key_input.value === "" || node_id_input.value === "") {
            notifyError("All field must be filled")
            return
        }

        const payload = {
            title: title_input.value,
            figma_key: figma_key_input.value,
            node_id: node_id_input.value,
            description: descriptionRef.current.getContent().replace(/\n|\t/g, ' '),
        }

        try {
            setLoading(true);
            const res = await axios.post(`${httpRequest.api.baseUrl}/node`, payload);
            setLoading(false);

            if (res.status === 201) {
                navigate("/node");
            } else if (res.status === 400) {
                notifyError("Payload invalid");
            } else if (res.status === 401) {
                setAuth(false);
            } else {
                notifyError("Failed create node");
            }
        } catch (err) {
            console.log(err);
            notifyError("Failed create node");
            setLoading(false);
        }
    }

    if (!authenticated) {
        return <Navigate replace to="/login"></Navigate>
    }

    return (
        <div className="flex-grow w-full px-3 md:px-6 md:mt-0 md:ml-52 pb-5">
            <ToastContainer />
            <TopNavbar title="Create Node" path=" Node / Create" className="bg-slate-50"></TopNavbar>

            <div className="detail__container flex gap-3">
                <div className="node_detail__container w-full">
                    <div className="history_detail__container px-5 py-8 bg-white rounded-lg border border-gray-200 shadow-sm w-full">
                        <form>
                            <label htmlFor='input-node-title' className='font-semibold text-sm'>Node Title :</label>
                            <input id="input-node_title" className="w-full mb-3 mt-3 px-2 py-1 rounded-md border border-gray-200"></input>

                            <label htmlFor='input-node-key' className='font-semibold text-sm'>Figma Key :</label>
                            <input id="input-figma_key" className="w-full mb-3 mt-3 px-2 py-1 rounded-md border border-gray-200"></input>

                            <label htmlFor='input-node-key' className='font-semibold text-sm'>Node ID :</label>
                            <input id="input-node_id" className="w-full mb-3 mt-3 px-2 py-1 rounded-md border border-gray-200"></input>
                            <p className="font-bold">Description :</p>
                            <div className="description__container w-full rounded-sm mt-5">
                                <Editor
                                    apiKey={tinyToken}
                                    onInit={(evt, editor) => descriptionRef.current = editor}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                            </div>
                            {isLoading ?
                                <button disabled type="button" className="mt-10 w-30 py-1 px-4 bg-purple-700 text-white font-bold rounded hover:bg-purple-900">
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Loading...
                                </button>
                                :
                                <button className="mt-10 w-30 py-1 bg-purple-700 text-white px-4 font-bold rounded hover:bg-purple-900" onClick={handleSubmitNode}>Create</button>
                            }
                            <button className='text-slate-600 bg-gray-200 hover:bg-gray-300 ml-1 font-bold py-1 px-4 rounded mt-2' onClick={e => {
                                e.preventDefault();
                                navigate(`/node`, { replace: true })
                            }}>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}



