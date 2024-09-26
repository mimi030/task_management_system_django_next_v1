"use client";

import { Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import ActivateUser from "@/app/components/Auth/ActivateUser";

// Force the page to be dynamically rendered
export const dynamic = "force-dynamic";

// Fallback for Suspense
function LoadingFallback() {
    return <div>Loading...</div>;
}

function ActivationPageContent() {
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");

    // Redirect to 404 if uid or token are missing
    if (!uid || !token) {
        notFound();
    }

    return <ActivateUser uid={uid} token={token} />;
}

export default function ActivationPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <ActivationPageContent />
        </Suspense>
    );
}
