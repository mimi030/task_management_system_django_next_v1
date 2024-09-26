"use client";

import { CalendarIcon } from "@heroicons/react/24/outline";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-light-primary text-light-text text-sm">
            <div className="container mx-auto text-center flex items-center justify-center space-x-2">
                <CalendarIcon className="w-5 h-5 inline-block" />
                <span>&copy; {currentYear} mimi030. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
