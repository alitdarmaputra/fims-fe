import React, { useRef } from 'react';
import TopNavbar from "../TopNavbar/TopNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import httpRequest from "../../config/http-request";
// import { useAuth } from "../../context/auth";
// import { parseJWT } from "../../utils/auth";
import { HistoryTypeCreate, HistoryTypeStatusChange, HistoryTypeUpdate } from "../../constanta/history-type";
import moment from "moment";
import NodeSidebar from "./NodeSidebar";
import { Editor } from '@tinymce/tinymce-react';
import { notifyError } from '../../utils/toast';
import { ToastContainer } from 'react-toastify';

export default function NodeEdit() {
    const [isLoading, setLoading] = useState(true);
    const [nodeDetail, setNodeDetail] = useState({});
    const { id } = useParams();
    const [authenticated, setAuth] = useState(true);
    const [status, setStatus] = useState([]);
    const [histories, setHistories] = useState([]);
    const descriptionRef = useRef(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    let tinyToken = process.env.REACT_APP_TINY_TOKEN
    const navigate = useNavigate();

    const handleEditNode = async e => {
        e.preventDefault()
        const title_input = document.querySelector("#input-node_title");

        if (title_input.value === "") {
            notifyError("All field must be filled")
            return
        }

        const payload = {
            title: title_input.value,
            description: descriptionRef.current.getContent().replace(/\n|\t/g, ' '),
        }

        try {
            setSubmitLoading(true);
            const res = await axios.put(`${httpRequest.api.baseUrl}/node/${nodeDetail.id}`, payload);

            if (res.status === 200) {
                navigate(`/node/${nodeDetail.id}`);
            } else if (res.status === 400) {
                notifyError("Payload invalid");
            } else if (res.status === 401) {
                setAuth(false);
            } else {
                notifyError("Failed edit node");
            }
            setSubmitLoading(false);
        } catch (err) {
            console.log(err);
            notifyError("Failed edit node");
            setSubmitLoading(false);
        }
    }

    useEffect(() => {
        async function getNodeDetail() {
            const res = await axios.get(`${httpRequest.api.baseUrl}/node/${id}`);
            const statusRes = await axios.get(`${httpRequest.api.baseUrl}/status`);
            const historiesRes = await axios.get(`${httpRequest.api.baseUrl}/node/${id}/history`);

            if (res.status === 200 && statusRes.status === 200 && historiesRes.status === 200) {
                setNodeDetail(res.data.data);
                setStatus(statusRes.data.data);
                setHistories(historiesRes.data.data);
                setLoading(false);
            } else if (res.status === 401) {
                setLoading(false);
                setAuth(false);
            }
        }

        getNodeDetail()
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
        <div className="flex-grow w-full px-3 md:px-6 md:mt-0 md:ml-52 pb-5">
            <ToastContainer />
            <TopNavbar title="Edit Node" path=" Node / Edit" className="bg-slate-50"></TopNavbar>

            <div className="detail__container flex gap-3">
                <div className="node_detail__container w-full">
                    <div className="history_detail__container px-5 py-8 bg-white rounded-lg border border-gray-200 shadow-sm w-full">
                        <form>
                            <div className="title_head_container flex justify-between items-start w-full mb-1">
                                <div className="title__container w-full mb-3">
                                    <input id="input-node_title" className="w-full mb-1 px-2 py-2 rounded-md border border-gray-200 text-xl" defaultValue={nodeDetail.title}></input>
                                    <a href={nodeDetail.figma_url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-700 pl-1">{nodeDetail.figma_url}</a>
                                </div>
                            </div>
                            <p className="font-bold pl-1">Description :</p>
                            <div className="description__container w-full rounded-sm mt-5">
                                <Editor
                                    apiKey={tinyToken}
                                    onInit={(_, editor) => descriptionRef.current = editor}
                                    initialValue={nodeDetail.description}
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
                                        content_style: 'body { font-size:14px }'
                                    }}
                                />
                            </div>

                            {submitLoading ?
                                <button disabled type="button" className="mt-10 w-30 py-1 px-4 bg-purple-700 text-white font-bold rounded hover:bg-purple-900">
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Loading...
                                </button>
                                :
                                <button className="mt-10 w-30 py-1 bg-purple-700 text-white px-4 font-bold rounded hover:bg-purple-900" onClick={handleEditNode}>Save</button>
                            }
                            <button className='bg-gray-200 hover:bg-gray-300 ml-1 font-bold py-1 px-4 rounded mt-2 text-slate-600' onClick={e => {
                                e.preventDefault();
                                navigate(`/node/${id}`, { replace: true })
                            }}>Cancel</button>
                        </form>
                    </div>
                    <div className="histories__container pl-5 mt-10">

                        <ol className="relative border-l border-gray-200">
                            {
                                histories.length > 0 && histories.map(history => {
                                    if (history.history_type === HistoryTypeCreate) {
                                        return (
                                            <li className="mb-10 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    <img className="rounded-full shadow-lg" src={history.updated_by_profile} alt="User profile" />
                                                </span>
                                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{moment(history.created_at).fromNow()}</time>
                                                    <div className="text-sm font-normal"><span className="font-bold text-purple-500">{history.updated_by}</span> created the node</div>
                                                </div>
                                            </li>
                                        )
                                    } else if (history.history_type === HistoryTypeUpdate) {
                                        return (
                                            <li className="mb-10 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    <img className="rounded-full shadow-lg" src={history.updated_by_profile} alt="User profile" />
                                                </span>
                                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{moment(history.created_at).fromNow()}</time>
                                                    <div className="text-sm font-normal"><span>{history.updated_by}</span> updated the node</div>
                                                </div>
                                            </li>
                                        )
                                    } else if (history.history_type === HistoryTypeStatusChange) {
                                        return (
                                            <li className="mb-10 ml-6">
                                                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                                                    <img className="rounded-full shadow-lg" src={history.updated_by_profile} alt="User profile" />
                                                </span>
                                                <div className="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">{moment(history.created_at).fromNow()}</time>
                                                    <div className="text-sm font-normal"><span>{history.updated_by}</span> changed the <span className="font-bold">status</span></div>
                                                </div>
                                                <div className="p-3 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg bg-gray-50">
                                                    <div className="status_change__container"><span className="text-purple-500 bg-purple-200 p-1 rounded-md mr-2">{history.status_from}</span> → <span className="ml-2 text-purple-500 bg-purple-200 p-1 rounded-md">{history.status_to}</span></div>
                                                </div>
                                            </li>
                                        )
                                    }
                                    return <></>
                                })
                            }
                        </ol>
                    </div>
                </div>

                <NodeSidebar nodeDetail={nodeDetail} status={status} />
            </div>

        </div>
    )
}


