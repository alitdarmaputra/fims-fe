import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { RxDashboard } from 'react-icons/rx';
import { MdClose } from 'react-icons/md';
import { BiUser } from 'react-icons/bi';
import FimsLogoText from '../../assets/logo_text.svg';
import { LuListTree } from 'react-icons/lu';
import { TiThMenu } from 'react-icons/ti';

export default function Navbar() {
    const [navbarActive, setNavbar] = useState(false)

    const menus = [
        {
            id: 0,
            title: "Overview",
            url: "/overview",
            icon: <RxDashboard />,
        }, {
            id: 1,
            title: "Node",
            url: "/node",
            icon: <LuListTree />,
        }, {
            id: 2,
            title: "Team",
            url: "/team",
            icon: <BiUser />,
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
                <button onClick={() => setNavbar(!navbarActive)} className="w-8 h-8 bg-purple-700 text-white shadow-md rounded-md flex justify-center items-center">
                    {
                        navbarActive ? (
                            <MdClose className="font-bold" />
                        ) : (
                            <TiThMenu />
                        )
                    }
                </button>
            </div>

            <div className={`navbar__container z-10 md:w-52 border-r border-gray-200 ${navbarActive ? "w-full" : "w-0"} fixed md:static bg-white h-screen pt-10 transition-all overflow-hidden`}>
                <NavLink to="/overview" className="navbar__header flex items-center justify-center mb-8">
                    <img src={FimsLogoText} alt="fims-text-logo" className="h-7"></img>
                </NavLink>
                <div className="navbar__menus">
                    {
                        menus.map(menu => {
                            return (
                                <div key={menu.id}>
                                    {
                                        !menu.submenus ? (
                                            <NavLink className={({ isActive, isPending }) => {
                                                return isPending ? "pending" : isActive ? "navbar__menu mb-2 flex items-center pl-3 hover:cursor-pointer bg-purple-700 mx-3 h-12 rounded-md text-white" : "navbar__menu mb-2 flex items-center pl-3 hover:cursor-pointer hover:bg-gray-100 mx-3 h-12 rounded-md text-slate-500"
                                            }} to={menu.url} onClick={() => handleSubmenu(menu)} >
                                                <div className="mr-3 text-xl">
                                                    {menu.icon}
                                                </div>
                                                <h3 className="text-sm font-semibold">{menu.title}</h3>
                                            </NavLink>
                                        ) : (
                                            <NavLink className={({ isPending }) => {
                                                return isPending ? "pending" : "h-12 mb-2 mx-3 flex items-center pl-3 hover:cursor-pointer text-slate-500"
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
                                                            return isPending ? "pending" : isActive ? "navbar__menu h-14 mb-2 flex items-center px-6 border-l-4 border-purple-700 hover:cursor-pointer text-purple-700" : "navbar__menu h-14 mb-2 flex items-center px-6 hover:cursor-pointer text-slate-500"
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
