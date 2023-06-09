import { formatDateTime, toCapitalize } from "../../utils/formatter";
import axios from "axios";
import httpRequest from "../../config/http-request";

export default function NodeSidebar({ nodeDetail, status, setHistories }) {
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
        <div className="detail_head__container justify-end box-border items-start bg-white p-5 border border-gray-200 rounded-md w-2/5 h-72">
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
        </div>
    )
}
