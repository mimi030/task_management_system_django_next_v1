import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import axiosService from "./app/fetcher";

export async function middleware(request: NextRequest) {
    const isDev = process.env.NODE_ENV === 'development';
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    // CSP header configuration for HTTP only now.
    // When migrating to HTTPS, add "upgrade-insecure-requests;" directive. 
    // For dev, use 'unsafe-eval'.
    // When integrating a new domain into the app, include them in the "connnect-src".
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""};
        style-src 'self' 'nonce-${nonce}';
        img-src 'self' blob: data:;
        font-src 'self';
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        connect-src 'self' http://localhost:8000  http://127.0.0.1:8000 http://localhost:3000  http://127.0.0.1:3000;
    `
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim()
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)
    
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    const pathname = request.nextUrl.pathname;
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Extract the project ID from the URL if it exists
    const projectIdMatch = pathname.match(/\/projects\/(\d+)/);
    const projectId = projectIdMatch ? projectIdMatch[1] : null;

    if (!accessToken && pathname !== "/") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (accessToken && pathname == "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Check permission if URL ends with /edit or /new and projectId exists
    if (projectId && (pathname.endsWith("/edit") || pathname.endsWith("/new"))) {
        if (accessToken) {
            try {
                const accessTokenValue = accessToken?.value;

                const response = await axiosService.get(`${baseURL}/projects/${projectId}/check_permission/`, {
                    headers: {
                        Authorization: `Bearer ${accessTokenValue}`,
                    },
                });
            } catch (error: any) {
                // Handle potential errors
                if (error.response?.status === 403) {
                    return NextResponse.redirect(new URL(`/not-found?error=403`, request.url));
                }

                if (error.response?.status === 500) {
                    return NextResponse.redirect(new URL(`/not-found?error=500`, request.url));
                }

                return NextResponse.redirect(new URL(`/not-found?error=404`, request.url));
            }
        } else {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Configure Content Security Policy setting with random nonce
    const response = NextResponse.next({
        request: {
        headers: requestHeaders,
        },
    })
    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )
    
    return response;
}

export const config = {
    matcher: ["/((?!api|auth|_next/static|_next/image|.*\\.png$).*)"],
};
