import axiosService from "@/app/fetcher";
import axios from "axios";
import { storeToken, getToken, removeTokens } from "@/app/auth/utils";
import { useRouter } from "next/navigation";

// Define the hook for user actions
function useUserActions() {
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Login the user
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${baseURL}/auth/jwt/create`, { email, password });
      const { access, refresh, user } = response.data;

      // Store tokens in HttpOnly cookies
      storeToken(access, "access");
      storeToken(refresh, "refresh");

      // Store user data in sessionStorage for session tracking
      sessionStorage.setItem('user', JSON.stringify(user));

      // Redirect and update a URL
      router.push("/dashboard");
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout the user
  const logout = async () => {
    try {
      await axiosService.post(`${baseURL}/auth/logout/`, { refresh: getRefreshToken() }, {
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
        },
      });
      
      // Remove tokens on logout
      removeTokens();
      sessionStorage.removeItem("user");

      // Redirect and update URL
      router.push("/login");
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Register the user
  const register = async (email: string, username: string, password: string, re_password: string, first_name: string, last_name: string) => {
    try {
      const response = await axios.post(`${baseURL}/auth/users/`, { email, username, password, re_password, first_name, last_name });
      // Redirect to login page after registration
      router.push("/login");
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  // Edit the user
  const edit = async (data: any, userId: string) => {
    try {
      const response = await axiosService.patch(`${baseURL}/user/${userId}/`, data, {
        headers: {
          "Authorization": `Bearer ${getAccessToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Update user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      console.error("Edit error:", error);
      throw error;
    }
  };

  // Request password reset
  const resetPassword = async (email: string) => {
    try {
      const response = await axiosService.post(`${baseURL}/auth/users/reset_password/`, { email });
      return response;
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
    }
  };

  // Confirm password reset
  const resetPasswordConfirm = async (uid: string, token: string, password: string, re_password: string) => {
    try {
      const response = await axiosService.post(`${baseURL}/auth/users/reset_password_confirm/`, {
        uid,
        token,
        new_password: password,
        re_new_password: re_password,
      });
      return response.data;
    } catch (error) {
      console.error("Reset password confirm error:", error);
      throw error;
    }
  };

  // Activate user account
  const activateUserAccount = async (uid: string, token: string) => {
    try {
      const response = await axiosService.post(`${baseURL}/auth/users/activation/`, {
        uid,
        token,
      });
      return response.data;
    } catch (error) {
      console.error("Activation confirm error:", error);
      throw error;
    }
  };

  return {
    login,
    logout,
    register,
    edit,
    resetPassword,
    resetPasswordConfirm,
    activateUserAccount,
  };
}

function getAccessToken() {
  return getToken("access");
}

function getRefreshToken() {
  return getToken("refresh");
}

export {
  useUserActions,
  getAccessToken,
  getRefreshToken,
};
