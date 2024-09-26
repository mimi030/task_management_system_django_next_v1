"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useProjectActions } from "@/app/hooks/project.actions";
import { fetcher } from "@/app/fetcher";
import TagsManager, { Tag } from "@/app/components/Tag/TagsManager";
import BackButton from "@/app/components/Button/BackButton";

interface FormData {
    name: string;
    description: string;
    assigned_to_ids: string[];
    due_date: string;
    status: string;
    tag_ids: string[]
}

export default function TaskEditPage() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        setError,
    } = useForm<FormData>();

    const router = useRouter();
    const { id: projectId, taskId } = useParams();
    const { editTask, deleteTask } = useProjectActions();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch task data
    const { data: taskData, error: taskError } = useSWR(
        projectId && taskId ? `${baseURL}/projects/${projectId}/tasks/${taskId}` : null,
        fetcher
    );

    // Fetch project members
    const { data: projectData, error: projectError } = useSWR(
        projectId ? `${baseURL}/projects/${projectId}` : null,
        fetcher
    );

    // Fetch tags
    const { data: tagsData, error: tagsError } = useSWR(
        `${baseURL}/all-tags/`,
        fetcher
    );

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    useEffect(() => {
        if (taskData) {
            setValue("name", taskData.name);
            setValue("description", taskData.description);
            const assignedMemberIds = taskData.assigned_to?.map((member: any) => member.id) || [];
            setValue("assigned_to_ids", assignedMemberIds);
            setSelectedMembers(assignedMemberIds);
            setValue("due_date", taskData.due_date);
            setValue("status", taskData.status);
            setSelectedTags(taskData.tags);
        }
    }, [taskData, setValue]);

    const handleTagChange = (tags: Tag[]) => {
        setSelectedTags(tags);
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            await editTask(
                projectId as string,
                taskId as string,
                data.name,
                data.description,
                data.assigned_to_ids,
                data.due_date,
                data.status,
                selectedTags.map((tag) => tag.id) // Use selectedTags to get tag IDs
            );
            router.push(`/projects/${projectId}/`);
        } catch (error: any) {
            console.error("Error updating task: ", error);
            setError("root", { type: "manual", message: error.message || "Failed to update task. Please try again." });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask(projectId as string, taskId as string);
            router.refresh();
            router.push(`/projects/${projectId}`);
        } catch (error: any) {
            console.error("Error deleting task: ", error);
            setError("root", { type: "manual", message: error.message || "Failed to update task. Please try again." });
        }
    };

    const handleMemberChange = (memberId: string) => {
        const updatedMembers = selectedMembers.includes(memberId)
          ? selectedMembers.filter(id => id !== memberId)
          : [...selectedMembers, memberId];
        setSelectedMembers(updatedMembers);
        setValue("assigned_to_ids", updatedMembers);
    };

    if (!taskData || !projectData || !tagsData) {
        return <div>Loading...</div>
    }

    if (taskError || projectError || tagsError) {
        return <div>Error loading data.</div>
    }

    const members = projectData.members || [];
    const tags = tagsData || [];

    return (
        <div className="text-light-text bg-white rounded-lg px-4 py-2 my-2">
            <div className="my-2">
                <h1 className="my-2 font-bold">Edit Task</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-2">
                    <label htmlFor="name">
                        Task Name
                    </label>
                    <input 
                      id="name"
                      {...register("name", { required: "Task name is required" })}
                      className="w-full px-4 py-2 mt-2 text-black border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="description">
                        Task Description
                    </label>
                    <textarea 
                      id="description"
                      {...register("description", { required: "Task description is required" })}
                      className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.description && <p>{errors.description.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="status">
                        Select Status
                    </label>
                    <select
                      id="status"
                      {...register("status")}
                      className="w-full px-4 py-2 mt-2 text-black border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    {errors.status && <p>{errors.status.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="due_date">
                        Due Date
                    </label>
                    <input
                      id="due_date"
                      type="datetime-local"
                      {...register("due_date")}
                      className="w-full px-4 py-2 mt-2 text-black border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.due_date && <p>{errors.due_date.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="members">
                        Select Members
                    </label>
                    <div
                        className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {members.map((member: any) => (
                            <div
                                key={member.id}
                                className="m-2"
                            >
                                    <label>
                                        <input
                                          type="checkbox"
                                          value={member.id}
                                          checked={selectedMembers.includes(member.id)}
                                          onChange={() => handleMemberChange(member.id)}
                                          className="mb-4"
                                        />
                                        <span 
                                          className={selectedMembers.includes(member.id)
                                            ? "bg-sky-400 text-white p-2 ml-2 rounded-lg"
                                            : "text-black p-2 ml-2"}
                                        >
                                            {member.username}
                                        </span>
                                    </label>
                            </div>
                        ))}
                    </div>
                    {errors.assigned_to_ids && <p>{errors.assigned_to_ids.message}</p>}
                </div>
                <div className="my-2">
                    <TagsManager
                      selectedTags={selectedTags}
                      onChange={handleTagChange}
                    />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white my-2 mr-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Update
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-light-danger text-white my-2 px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                    Delete
                </button>
            </form>
            <BackButton />
        </div>
    );
};
