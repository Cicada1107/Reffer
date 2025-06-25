'use client'
import Link from "next/link";
import type { ReactElement } from "react";

export function SidebarItem(props: {
    text: string;
    icon: ReactElement;
    link: string;
}){
    return <div className="w-full select-none flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-100 hover:bg-gray-700 active:scale-95 cursor-pointer focus:outline-none">
        <span className="mr-3 text-white">{props.icon}</span>
        <Link href={props.link} className="text-white">
            {props.text}
        </Link>
    </div>
}