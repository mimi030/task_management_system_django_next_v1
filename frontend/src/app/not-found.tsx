"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ErrorPage from "./components/Error/ErrorPage";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error');

  let code = "404";
  let message = "Sorry, the page you're looking for cannot be found.";

  if (errorType === "403") {
    code = "403";
    message = "You do not have permission to access this page.";
  }

  if (errorType === "500") {
    code = "500";
    message = "Internal Server Error. Please try it again later.";
  }

  return <ErrorPage code={code} message={message} />;
}

// Wrap the NotFoundContent with Suspense
export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
