'use client'

import { useState } from "react";

interface ProfileImageProps{
    src?: string | null;
    alt: string;
    className?: string;
    fallbackClassName?: string;
    onClick?: () => void;
    title?: string;
}

export default function ProfileImage({
    src, 
    alt, 
    className = "", 
    fallbackClassName = "",
    onClick,
    title 
}: ProfileImageProps){
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    //if no src, show fallback image
    if(!src || imageError){
        return (
            <img
                src="/default-avatar.png"
                alt={alt}
                className={className}
                onClick={onClick}
                title={title}
            />
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={handleImageError}
            onLoad={handleImageLoad}
            onClick={onClick}
            title={title}
        />
    );
}