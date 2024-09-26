"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useUserActions } from "@/app/hooks/user.actions";
import { removeTokens } from "@/app/auth/utils";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const { data: user, error, isLoading } = useSWR("/auth/users/me", fetcher);

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data.</div>;

    // Navigate the user to project page
    const navigateProjectPage = () => {
        router.push("/projects");
    }

    return (
        <div className="bg-light-primary flex flex-col items-center justify-center">
            <div className="bg-white text-black p-6 rounded-lg shadow-lg w-full text-center">
                <h1 className="text-2xl font-bold mb-4">Hi, {user?.username}!</h1>
                <p className="mb-4">Your account details:</p>
                <ul className="mb-4">
                    <li>Username: {user?.username}</li>
                    <li>Email: {user?.email}</li>
                </ul>
                <button
                    onClick={navigateProjectPage}
                    className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    View Projects
                </button>
            </div>
        </div>
    );
}
