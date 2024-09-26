"use client";

import { Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import ResetPasswordConfirmation from "@/app/components/Auth/ResetPasswordConfirm";

// Mark the page as dynamic
export const dynamic = 'force-dynamic';

// Fallback for Suspense
function LoadingFallback() {
    return <div>Loading...</div>;
}

function ResetPasswordConfrimPageContent() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    // Redirect to 404 if uid or token are missing
    if (!uid || !token) {
        notFound();
    }

    return <ResetPasswordConfirmation uid={uid} token={token} />;
}


export default function ResetPasswordConfrimPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordConfrimPageContent />
        </Suspense>
    );
}
