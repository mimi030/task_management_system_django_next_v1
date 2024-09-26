import axiosService from "@/app/fetcher";
import { getToken } from "@/app/auth/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag } from "@/app/components/Tag/TagsManager";

// Define the hook for project and task creation actions
export const useProjectActions = () => {
    const router = useRouter();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Project API
    // View Projects List
    // View Project Details
    // Edit Project Details, such as add tasks or update tasks status

    // Create Project
    const createProject = async (name: string, description: string, member_ids: string[]) => {
        try {
            const response = await axiosService.post(`${baseURL}/projects/`, { name, description, member_ids }, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            router.push(`/projects/${response.data.id}`);
            return response.data;
        } catch (error) {
            console.error("Error creating project:", error);
            throw error;
        }
    };

    // Get Project
    const getProject = async (id: string) => {
        try {
            const response = await axiosService.get(`${baseURL}/projects/${id}`, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching project:", error);
            throw error;
        }
    };

    // Update Project
    const editProject = async (id: string, name: string, description: string, member_ids: string[]) => {
        try {
            const response = await axiosService.put(`${baseURL}/projects/${id}/`, { id, name, description, member_ids }, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("Error editing project:", error);
            if (error.response && error.response.status === 403) {
                alert("You do not have permission to proceed this action.");
                router.push(`/projects/${id}/`);
            }
            throw error;
        }
    };

    // Delete Project
    const deleteProject = async (id: string) => {
        try {
            const response = await axiosService.delete(`${baseURL}/projects/${id}/`, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting project:", error);
            throw error;
        }
    };

    // Task API
    // Create Task
    const createTask = async (name: string, description: string, assigned_to_ids: string[], due_date: string, status: string, tag_ids: string[], projectId: string) => {
        try {
            const response = await axiosService.post(`${baseURL}/projects/${projectId}/tasks/`, { name, description, assigned_to_ids, due_date, status, tag_ids, project: projectId }, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            router.push(`/projects/${response.data.project}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                console.error("Error creating task response: ", error.response.data);
            } else {
                console.error("Error creating task: ", error.message);
            }
            throw error;
        }
    };

    // Get Task
    const getTask =async (projectId: string, taskId: string) => {
        try {
            const response = await axiosService.get(`${baseURL}/projects/${projectId}/tasks/${taskId}`, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching task:", error);
            throw error;
        }
    };

    // Update Task
    const editTask = async (projectId: string, taskId: string, name: string, description: string, assigned_to_ids: string[], due_date: string, status: string, tag_ids: string[]) => {
        try {
            const response = await axiosService.put(`${baseURL}/projects/${projectId}/tasks/${taskId}/`, { project: projectId, id: taskId, name, description, assigned_to_ids, due_date, status, tag_ids }, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error editing task:", error);
            throw error;
        }
    };

    // Delete Task
    const deleteTask = async (projectId: string, taskId: string) => {
        try {
            const response = await axiosService.delete(`${baseURL}/projects/${projectId}/tasks/${taskId}/`, {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    // Comment API
    const createComment =async (projectId: string, taskId: string, content: string) => {
        try {
            const response = await axiosService.post(
                `${baseURL}/projects/${projectId}/tasks/${taskId}/comments/`, 
                { task: taskId, content },
                {
                    headers: {
                        "Authorization": `Bearer ${getToken("access")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    };

    const getAllComments = async (projectId: string, taskId: string) => {
        try {
            const response = await axiosService.get(
                `${baseURL}/projects/${projectId}/tasks/${taskId}/comments/`,
                {
                    headers: {
                        "Authorization": `Bearer ${getToken("access")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching comment: ", error);
            throw error;
        }
    };

    const getComment = async (projectId: string, taskId: string, commentId: string) => {
        try {
            const response = await axiosService.get(
                `${baseURL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${getToken("access")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching comment: ", error);
            throw error;
        }
    };

    const editComment = async (projectId: string, taskId: string, commentId: string, content: string) => {
        try {
            const response = await axiosService.put(
                `${baseURL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`,
                { task: taskId, id: commentId, content },
                {
                    headers: {
                        "Authorization": `Bearer ${getToken("access")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error editing comment: ", error);
            throw error;
        }
    };

    const deleteComment = async (projectId: string, taskId: string, commentId: string) => {
        try {
            const response = await axiosService.delete(
                `${baseURL}/projects/${projectId}/tasks/${taskId}/comments/${commentId}/`,
                {
                    headers: {
                        "Authorization": `Bearer ${getToken("access")}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error deleting comment: ", error);
            throw error;
        }
    };

    // Tag API
    const createTag = async (name: string) => {
        try {
            const response = await axiosService.post(`${baseURL}/all-tags/`,
            { name },
            {
                headers: {
                    "Authorization": `Bearer ${getToken("access")}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating tag:", error);
            throw error;
        }
    };
    
    return {
        createProject,
        getProject,
        editProject,
        deleteProject,
        createTask,
        getTask,
        editTask,
        deleteTask,
        createComment,
        getAllComments,
        getComment,
        editComment,
        deleteComment,
        createTag,
    };
};
