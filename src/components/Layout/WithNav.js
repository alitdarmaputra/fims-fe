import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function WithNav() {
    const [active, setActive] = React.useState(0);

    return (
        <div className="flex">
            <Navbar active={active} setActive={setActive} />
            <Outlet></Outlet>
        </div>
    );
}
