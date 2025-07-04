'use client'
import Link from "next/link";
import { ReactNode } from "react";

interface SidebarItemProps {
    text: string;
    icon: ReactNode;
    link?: string;
    onClick?: () => void;
    onClose?: () => void;
}

export function SidebarItem({ text, icon, link, onClick, onClose }: SidebarItemProps) {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        if (onClose) {
            onClose();
        }
    };

    const className = "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-white/10 text-white";

    if (link) {
        return (
            <Link href={link} className={className} onClick={onClose}>
                {icon}
                <span className="text-sm font-medium">{text}</span>
            </Link>
        );
    }

    return (
        <button onClick={handleClick} className={className}>
            {icon}
            <span className="text-sm font-medium">{text}</span>
        </button>
    );
}