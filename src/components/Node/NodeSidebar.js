import { formatDateTime, toCapitalize } from "../../utils/formatter";
import axios from "axios";
import httpRequest from "../../config/http-request";
import { useState } from "react";
import AsyncSelect from 'react-select/async';

export default function NodeSidebar({ nodeDetail, status, setHistories }) {
    let [assignee, setAssignee] = useState("")

    const loadAssignee = async search => {
        const res = await axios.get(`${httpRequest.api.baseUrl}/users?search=${search}`)
        const options = res.data?.data?.map(option => {
            return {
                value: option.id,
                label: `${option.name}`
            }
        })
        return options;
    }

    async function changeStatus() {
        const select = document.getElementById("select-node_status");
        select.disabled = true

        const payload = {
            status_id: parseInt(select.value)
        }

        try {
            await axios.patch(`${httpRequest.api.baseUrl}/node/${nodeDetail.id}`, payload);
            const historiesRes = await axios.get(`${httpRequest.api.baseUrl}/node/${nodeDetail.id}/history`);
            select.disabled = false

            if (historiesRes.status === 200) {
                setHistories(historiesRes.data.data);
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="detail_head__container justify-end box-border items-start bg-white p-5 border border-gray-200 rounded-md w-2/5 h-96">
            <select id="select-node_status" className="p-2 rounded-md bg-purple-700 text-white text-sm font-bold" onChange={changeStatus}>
                {
                    status.length > 0 && status.map(item => {
                        return item.name === nodeDetail.status ? (
                            <option selected value={item.id}>{toCapitalize(item.name)}</option>
                        ) : (
                            <option value={item.id}>{toCapitalize(item.name)}</option>
                        )
                    })
                }
            </select>
            <p className="font-bold mt-5">Detail :</p>
            <table className="mt-2 text-xs">
                <tr className="h-10">
                    <td className="w-24">Created By</td>
                    <td className="w-5 text-center"> : </td>
                    <td><span className="px-3 bg-slate-200 rounded-md">{nodeDetail.created_by}</span></td>
                </tr>
                <tr>
                    <td className="w-24">Created At</td>
                    <td className="w-5 text-center"> : </td>
                    <td>{formatDateTime(nodeDetail.created_at)}</td>
                </tr>
                <tr>
                    <td className="w-24">Last Updated</td>
                    <td className="w-5 text-center"> : </td>
                    <td>{formatDateTime(nodeDetail.created_at)}</td>
                </tr>
            </table>
            <p className="font-bold mt-5 mb-5">Developer Assignee :</p>
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
                id="select-assignee"
                cacheOptions
                loadOptions={loadAssignee}
                placeholder="Select assignee"
                noOptionsMessage={() => "User not found"}
                onChange={choice => setAssignee(choice.value)}
            >
            </AsyncSelect>

        </div>
    )
}
