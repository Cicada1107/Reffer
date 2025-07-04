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
            const target = event.target as Element;

            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleSupportClick = () => {
        console.log("Support button clicked!");
        onClose();
        
        setTimeout(() => {
            const footer = document.querySelector('footer');
            if (footer) {
                footer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                const supportButton = footer.querySelector('#footer-support-button');
                if (supportButton) {
                    supportButton.classList.add('animate-pulse', 'bg-white/20', 'rounded-lg', 'px-2', 'py-1');
                    
                    setTimeout(() => {
                        supportButton.classList.remove('animate-pulse', 'bg-white/20', 'rounded-lg', 'px-2', 'py-1');
                    }, 3000);
                }
            }
        }, 200);
    };

    return (
        <div 
            ref={sidebarRef}
            className="h-screen bg-black/80 backdrop-blur-md border-r border-white/20 w-72 flex flex-col justify-between fixed left-0 top-0 py-6 px-4 z-50 overflow-y-auto"
        >
            <div className="flex flex-col items-stretch gap-3">
                <SidebarItem text="Search" icon={<SearchIcon/>} link="/search" onClose={onClose} />
                <SidebarItem text="Sent Requests" icon={<SentReqIcon/>} link="/requests/sent" onClose={onClose} />
                <SidebarItem text="Received Requests" icon={<ReceivedReqIcon/>} link="/requests/received" onClose={onClose} />
            </div>
            
            <div className="flex flex-col items-stretch gap-3 mt-auto">
                <SidebarItem 
                    text="Support Website" 
                    icon={<RupeeIcon/>} 
                    onClick={handleSupportClick}
                    onClose={onClose}
                />
                <SidebarItem text="Arijit Dubey" icon={<GitHubIcon/>} link="https://github.com/Cicada1107" onClose={onClose} />
            </div>
        </div>
    );
}