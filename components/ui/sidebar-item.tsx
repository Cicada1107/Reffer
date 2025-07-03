'use client'
import Link from "next/link";
import { ReactNode } from "react";

interface SidebarItemProps {
    text: string;
    icon: ReactNode;
    link?: string;
    onClick?: () => void;
}

export function SidebarItem({ text, icon, link, onClick }: SidebarItemProps) {
    if (onClick) {
        return (
            <button
                onClick={onClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors w-full text-left text-white"
            >
                {icon}
                <span className="text-sm font-medium">{text}</span>
            </button>
        );
    }

    if (link) {
        return (
            <Link
                href={link}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors w-full text-white"
            >
                {icon}
                <span className="text-sm font-medium">{text}</span>
            </Link>
        );
    }

    return null;
}