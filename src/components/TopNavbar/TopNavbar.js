import { useAuth } from "../../context/auth"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function TopNavbar({ title, path }) {
    const auth = useAuth();
    const [isActive, setActive] = useState(false);
    const navigate = useNavigate();

    const handleDisplayModal = () => {
        setActive(!isActive);
    }

    const handleLogout = e => {
        e.preventDefault();
        auth.logout();
        navigate("/login");
    }

    return (
        <>
            <div className="top__navbar_container montserrat-link flex items-center mt-3 mb-10 bg-white rounded-md border border-gray-200">
                <div className="left__navbar_side w-52 px-4 py-2 rounded-md ">
                    <h2 className="path text-sm font-semibold"><span className="text-slate-500">Pages /</span>{path}</h2>
                    <h1 className="title text-md font-bold">{title}</h1>
                </div>

                <div className="right__navbar_side flex flex-grow items-center justify-end">
                    <div onClick={handleDisplayModal} className="hover:cursor-pointer profile__container flex items-center">
                        <div className="profile__image w-8 h-8 rounded-full md:mr-5 bg-cover" style={{
                            backgroundImage: `url("${auth.user.profile_img}")`
                        }}></div>
                        <div className="profile__name_role mr-5">
                            <h3 className="font-bold md:inline hidden text-xs">{auth.user.name}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${isActive ? "opacity-100" : "opacity-0 scale-0"} transition-opacity modal_menu__container shadow-md absolute right-4 top-20 bg-white w-56 px-5 pt-5 rounded-lg z-50`}>
                <div onClick={() => navigate("/overview")} className="hover:text-purple-900 hover:cursor-pointer text-left p-2 hover:bg-purple-100 rounded-md w-full mb-3">
                    Overview
                </div>
                <hr className="mb-3"></hr>
                <button onClick={handleLogout} className="hover:text-purple-900 text-left p-2 hover:bg-purple-100 rounded-md w-full mb-5">
                    Logout
                </button>
            </div>
        </>
    )
}

