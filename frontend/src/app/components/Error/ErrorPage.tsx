"use client";

import Link from "next/link";

interface ErrorPageProps {
    code: string;
    message: string;
}

const ErrorPage = ({ code, message }: ErrorPageProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center text-blue-500">
            <h1 className="text-6xl font-bold">{code}</h1>
            <p className="text-xl mt-4">{message}</p>
            <Link
              href="/"
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Go Home
            </Link>
        </div>
    );
};

export default ErrorPage;
