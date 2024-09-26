"use client";

import useSWR from "swr";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { useProjectActions } from "@/app/hooks/project.actions";
import axiosService, { fetcher } from "@/app/fetcher";
import BackButton from "@/app/components/Button/BackButton";

interface FormData {
    name: string;
    description: string;
    member_ids: string[];
}

export default function ProjectEditPage() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        setError,
    } = useForm<FormData>();
    const router = useRouter();
    const { id } = useParams<{ id: string }>(); // Extract project ID from router params
    const { editProject } = useProjectActions();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch project data
    const { data: projectData, error: projectError } = useSWR(
        id ? `${baseURL}/projects/${id}/` : null,
        fetcher
    );

    // Fetch member data
    const { data: members, error: membersError } = useSWR(
        `${baseURL}/users/`,
        fetcher
    );

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    
    useEffect(() => {
        if (projectData) {
            setValue("name", projectData.name);
            setValue("description", projectData.description);
            const assignedMemberIds = projectData.members?.map((member: any) => member.id) || [];
            setSelectedMembers(assignedMemberIds);
            setValue("member_ids", assignedMemberIds);
        }
    }, [projectData, setValue]);

    const handleMemberChange = (memberId: string) => {
        const updatedMembers = selectedMembers.includes(memberId)
          ? selectedMembers.filter((id: string) => id !== memberId)
          : [...selectedMembers, memberId];
        setSelectedMembers(updatedMembers);
        setValue("member_ids", updatedMembers);
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            await editProject(id, data.name, data.description, data.member_ids);
            router.push(`/projects/${id}/`);
        } catch (error: any) {
            console.error("Error updating project: ", error);
            setError("root", { type: "manual", message: error.message });
        }
    };

    if (!projectData || !members) return <div>Loading...</div>;

    return (
        <div className="text-light-text bg-white rounded-lg px-4 py-2 my-2">
            <div className="my-2">
                <h1 className="my-2 font-bold">Edit Project</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-2">
                    <label htmlFor="name">
                        Project Name
                    </label>
                    <input
                      id="name"
                      {...register("name", { required: "Project name is required"})}
                      className="w-full px-4 py-2 mt-2 text-black border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="description">Project Description</label>
                    <textarea 
                      id="description"
                      {...register("description", { required: "Project description is required" })}
                      className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.description && <p>{errors.description.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="members">Select Members</label>
                    <div className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        {members.map((member: any) => (
                            <div key={member.id} className="m-2">
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
                    {errors.member_ids && <p>{errors.member_ids.message}</p>}
                </div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white my-2 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Update
                </button>
            </form>
            <BackButton />
        </div>
    );
};
