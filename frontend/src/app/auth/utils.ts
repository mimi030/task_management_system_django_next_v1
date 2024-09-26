import axios from "axios";
import Cookies from "js-cookie";

// Base API setup for making HTTP requests
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Stores a token in cookies.
 * @param {string} token - The token to be stored.
 * @param {"access" | "refresh"} type - The type of the token (access or refresh).
 */
export const storeToken = (token: string, type: "access" | "refresh") => {
    Cookies.set(type + "Token", token);
};

/**
 * Retrieves a token from cookies.
 * @param {"access" | "refresh"} type - The type of the token to retrieve (access or refresh).
 * @returns {string | undefined} The token, if found.
 */
export const getToken = (type: string) => {
    return Cookies.get(type + "Token");
};

/**
 * Removes both access and refresh tokens from cookies.
 */
export const removeTokens = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
};
