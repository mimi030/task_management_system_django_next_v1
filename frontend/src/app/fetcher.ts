/**
 * This file sets up the Axios instance for making HTTP requests to the backend API.
 * It includes configuration for base URL, headers, and token management.
 * It also handles JWT token refreshing using axios-auth-refresh.
 */

import axios, { AxiosError } from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {
    getAccessToken,
    getRefreshToken,
} from "@/app/hooks/user.actions";

// Creating an Axios instance with a predefined base URL and headers.
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosService = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercept requests to attach the Authorization header with the access token.
// This ensures that all outgoing requests have the JWT access token.
axiosService.interceptors.request.use((config) => {
    /**
     * Retrieving the access and refresh tokens from the local storage
     */
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Intercept responses to handle global error management.
// Here, we're primarily checking for unauthorized errors (status 401)
// and logging out the user if necessary.
axiosService.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized access, logging out...");
      }
      return Promise.reject(error);
    }
);

// Refresh authentication logic to handle token expiration.
// This function is called when a request fails due to an expired token.
// It attemps to refresh the token and retry the failed request.
const refreshAuthLogic = (failedRequest: any) => {
  return axios
    .post(`${baseURL}/auth/refresh/`, {
        refresh: getRefreshToken(),
      })
    .then((response) => {
      const { access } = response.data;
      failedRequest.response.config.headers["Authorization"] = `Bearer ${access}`;
      return Promise.resolve();
    })
    .catch((error) => {
      // Handle case where refresh token is also invalid or expired
      return Promise.reject(error);
    });
};

// Set up interceptor to refresh JWT tokens using axios-auth-refresh library.
createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

/**
 * A utility function for making GET requests using the configured Axios instance.
 * This function can be used in application to fetch data from API.
 * 
 * @param {string} url - The URL endpoint to make the GET request to.
 * @returns {Promise<any>} - The response data from the API.
 */
export function fetcher(url: string) {
    return axiosService.get(url).then((res) => res.data);
}

export default axiosService;
