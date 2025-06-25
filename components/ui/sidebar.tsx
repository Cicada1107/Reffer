'use client'

import { useEffect, useRef } from "react";
import GitHubIcon from "./github-icon";
import ReceivedReqIcon from "./received-request-icon";
import RupeeIcon from "./rupee-icon";
import SearchIcon from "./search-icon";
import SentReqIcon from "./sent-request-icon";
import { SidebarItem } from "./sidebar-item";


export function Sidebar({ onClose }: { onClose: () => void }) {
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Ensure the click is outside the sidebar and not on a link inside the sidebar
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(target) &&
                !(target instanceof HTMLAnchorElement)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return <div className="h-screen bg-black/20 backdrop-blur-md border-r border-white/10 w-72 flex flex-col justify-between fixed left-0 top-0 py-4 px-2">
        <div ref={sidebarRef} className="flex flex-col items-center justify-center gap-3">
            <SidebarItem text="Search" icon={<SearchIcon/>} link="#" />
            <SidebarItem text="Sent Requests" icon={<SentReqIcon/>} link="#"/>
            <SidebarItem text="Received Requests" icon={<ReceivedReqIcon/>} link="#"/>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
            <SidebarItem text="Arijit Dubey" icon={<GitHubIcon/>} link="https://github.com/Cicada1107"/>
            <SidebarItem text="Support Website" icon={<RupeeIcon/>} link="#"/>
        </div>
    </div>
}