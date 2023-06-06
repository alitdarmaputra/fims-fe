import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { MdOutlineHistory, MdClose } from 'react-icons/md';
import { BiBook, BiUser } from 'react-icons/bi';
import AbiwaraLogoText from '../../assets/logo_text.svg';
import { TiThMenu } from 'react-icons/ti';
import { useAuth } from "../../context/auth";
import { parseJWT } from "../../utils/auth";

export default function Navbar() {
    const [navbarActive, setNavbar] = useState(false)
    const [bookSubmenu, setBookSubmenu] = useState(false)
    const auth = useAuth();

    const token = parseJWT(auth.cookies?.token);

    const menus = [
        {
            id: 0,
            title: "Beranda",
            url: "/dashboard",
            icon: <RxDashboard />,
            roles: [1, 2, 3]
        }, {
            id: 1,
            title: "Kunjungan",
            url: "/visitor",
            icon: <MdOutlineHistory />,
            roles: [1, 2, 3]
        }, {
            id: 2,
            title: "Buku",
            icon: <BiBook />,
            submenus: [
                {
                    title: "Daftar Buku",
                    url: "/book"
                }, {
                    title: "Pinjam Buku",
                    url: "/borrow"
                }
            ],
            submenu: bookSubmenu,
            setSubmenu: setBookSubmenu,
            roles: [1, 2, 3]
        }, {
            id: 3,
            title: "Anggota",
            url: "/member",
            icon: <BiUser />,
            roles: [1, 3]
        }
    ]

    const handleSubmenu = (menu) => {
        if (!menu.submenus) setNavbar(false)
        if (menu.submenus) menu.setSubmenu(!menu.submenu);
    }

    const handleDisplaySubmenuBtn = (menu) => {
        if (menu.submenus !== undefined) {
            return menu.submenu ? (
                <div className="navbar__submenu_trigger w-full flex justify-end text-2xl text-slate-400 pr-5">
                    <MdKeyboardArrowUp />
                </div>
            ) : (
                <div className="navbar__submenu_trigger w-full flex justify-end text-2xl text-slate-400 pr-5">
                    <MdKeyboardArrowDown />
                </div>
            )
        }
    }

    return (
        <div className="fixed montserrat-link">
            <div className="menu__button_container w-full md:hidden absolute box-border pt-2 pl-2 z-20">
                <button onClick={() => setNavbar(!navbarActive)} className="w-8 h-8 bg-blue-700 text-white shadow-md rounded-md flex justify-center items-center">
                    {
                        navbarActive ? (
                            <MdClose className="font-bold" />
                        ) : (
                            <TiThMenu />
                        )
                    }
                </button>
            </div>

            <div className={`navbar__container z-10 md:w-64 ${navbarActive ? "w-full" : "w-0"} fixed md:static bg-white h-screen shadow-md pt-10 transition-all overflow-hidden`}>
                <NavLink to="/dashboard" className="navbar__header flex items-center justify-center">
                    <img src={AbiwaraLogoText} alt="abiwara-text-logo" className="w-44 -mt-10"></img>
                </NavLink>
                <div className="navbar__menus">
                    {
                        menus.map(menu => {
                            if (!menu.roles.includes(token.role)) return <></>;

                            return (
                                <div key={menu.id}>
                                    {
                                        !menu.submenus ? (
                                            <NavLink className={({ isActive, isPending }) => {
                                                return isPending ? "pending" : isActive ? "hover:underline navbar__menu h-14 mb-2 flex items-center pl-10 border-l-4 border-blue-700 hover:cursor-pointer text-blue-700" : "hover:underline navbar__menu h-14 mb-2 flex items-center pl-10 hover:cursor-pointer text-slate-500"
                                            }} to={menu.url} onClick={() => handleSubmenu(menu)} >
                                                <div className="mr-3 text-xl">
                                                    {menu.icon}
                                                </div>
                                                <h3 className="font-semibold">{menu.title}</h3>
                                            </NavLink>
                                        ) : (
                                            <NavLink className={({ isPending }) => {
                                                return isPending ? "pending" : "hover:underline navbar__menu h-14 mb-2 flex items-center pl-10 hover:cursor-pointer text-slate-500"
                                            }} to={menu.url} onClick={() => handleSubmenu(menu)} >
                                                <div className="mr-3 text-xl">
                                                    {menu.icon}
                                                </div>
                                                <h3 className="font-semibold">{menu.title}</h3>

                                                {handleDisplaySubmenuBtn(menu)}
                                            </NavLink>
                                        )
                                    }

                                    <div className={`navbar__submenu_container ${!menu.submenu ? "max-h-0" : "max-h-96"} overflow-hidden transition-all`}>
                                        {
                                            menu.submenus?.map(submenu => {
                                                return (
                                                    <div key={submenu.title} className="navbar__submenu text-xl">
                                                        <NavLink onClick={() => setNavbar(false)} className={({ isActive, isPending }) => {
                                                            return isPending ? "pending" : isActive ? "navbar__menu h-14 mb-2 flex items-center px-6 border-l-4 border-blue-700 hover:cursor-pointer text-blue-700" : "navbar__menu h-14 mb-2 flex items-center px-6 hover:cursor-pointer text-slate-500"
                                                        }} to={submenu.url}>
                                                            <h3 className="ml-10 font-semibold text-sm text-slate-400">{submenu.title}</h3>
                                                        </NavLink>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}
