import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useProjectActions } from "@/app/hooks/project.actions";
import { useRouter } from "next/navigation";
import axiosService from "@/app/fetcher";
import BackButton from "@/app/components/Button/BackButton";

interface FormData {
    name: string,
    description: string,
    member_ids: string[];
}

const ProjectForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors},
        setError,
    } = useForm<FormData>();
    const { createProject } = useProjectActions();
    const router = useRouter();
    const [members, setMembers] = useState<any[]>([]); // State to hold the list of members

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    useEffect(() => {
        // Fetch the list of available users
        const fetchMembers = async () => {
            try {
                const response = await axiosService.get(`${baseURL}/users/`);
                setMembers(response.data);
            } catch (error) {
                console.error("Error fetching members:", error);
            }
        };

        fetchMembers();
    }, [baseURL]);

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        try {
            await createProject(data.name, data.description, data.member_ids);
            router.push("/projects");
        } catch (error: any) {
            setError("root", { type: "manual", message: error.message });
        }        
    };
    
    return (
        <div className="text-light-text bg-white rounded-lg px-4 py-2 my-2">
            <div className="my-2">
                <h1 className="my-2 font-bold">Create a New Project</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-2">
                    <label htmlFor="name">
                        Project Name
                    </label>
                    <input
                      id="name"
                      {...register("name", { required: "Project name is required"}
                      )}
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                    {errors.name && <p>{errors.name.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="description">
                        Project Description
                    </label>
                    <textarea
                      id="description"
                      {...register("description", { required: "Project description is required" })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.description && <p>{errors.description.message}</p>}
                </div>
                <div className="my-2">
                    <label htmlFor="members">
                        Select Members
                    </label>
                    <select
                      id="members"
                      {...register("member_ids")}
                      multiple
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        {members.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.username}
                            </option>
                        ))}
                    </select>
                    {errors.member_ids && <p>{errors.member_ids.message}</p>}
                </div>
                <div className="space-x-3">
                    <button type="submit"
                        className="my-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Create Project
                    </button>
                    <BackButton />
                </div>
            </form>
        </div>
    );
};

export default ProjectForm;
