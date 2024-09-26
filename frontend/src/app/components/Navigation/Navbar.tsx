"use client";

import { useEffect, useState } from "react";
import { useUserActions } from "@/app/hooks/user.actions";
import { removeTokens, getToken } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const router = useRouter();
    const { logout } = useUserActions();
    const [isOpen, setIsOpen] = useState(false);
    const [authState, setAuthState] = useState<"loading" | "loggedIn" | "loggedOut">("loading");

    // Define the links
    const links = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/projects", label: "Projects" },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Check if user is logged in
    const isLoggedIn = () => {
        return !!getToken("access");
    };

    useEffect(() => {
        const loggedIn = isLoggedIn();
        setAuthState(loggedIn? "loggedIn" : "loggedOut");
    }, []);

    if (authState === "loading") {
        return null;
    }

    // Logout the user and redirect to home page
    const handleLogout = async () => {
        try {
            await logout();
            router.push("/");
        } catch (error) {
            console.error("Logout failed: ", error);
        } finally {
            removeTokens();
            setIsOpen(false);
        }
    };

    // Handle sign in (redirect to sign in page)
    const handleSignIn = () => {
        setIsOpen(false);
        router.push("/");
    };

    // General function to handle link clicks and close the menu
    const handleLinkClick = () => setIsOpen(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 w-full z-30 bg-white p-4 md:p-3 border-b-2 shadow-lg ${
            isOpen ? "h-full transition-all duration-300" : ""
        }`}>
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-light-secondary text-lg font-bold">
                    <Link href="/">
                        Logo
                    </Link>
                </div>
                <div className="hidden md:flex space-x-4">
                    {links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="px-4 py-2 text-gray-300 hover:text-light-secondary"
                          onClick={handleLinkClick}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div>
                        {authState === "loggedIn" ? (
                            <button
                              onClick={handleLogout}
                              className="bg-light-royal text-light-skyblue px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                              onClick={handleSignIn}
                              className="bg-light-royal text-light-skyblue px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
                <div className="md:hidden flex items-center">
                    <button
                        onClick={toggleMenu}
                        className="text-gray-300 hover:text-light-secondary focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>
            {isOpen && (
                <div
                  className="md:hidden flex flex-col text-center space-y-4 mt-4"
                >
                    {links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="px-4 py-2 text-gray-300 hover:text-light-secondary"
                          onClick={handleLinkClick}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div>
                        {authState === "loggedIn" ? (
                            <button
                              onClick={handleLogout}
                              className="bg-light-royal text-light-skyblue px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <button
                              onClick={handleSignIn}
                              className="bg-light-royal text-light-skyblue px-4 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );

};

export default Navbar;
