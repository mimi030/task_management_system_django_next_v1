import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useProjectActions } from "@/app/hooks/project.actions";
import { useRouter, useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import TagsManager, {Tag} from "@/app/components/Tag/TagsManager";
import BackButton from "@/app/components/Button/BackButton";

interface FormData {
    name: string;
    description: string;
    assigned_to_ids: string[];
    due_date: string;
    status: string;
}

const TaskForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        setError,
    } = useForm<FormData>();
    
    const router = useRouter();
    const { id: projectId } = useParams();
    const { createTask } = useProjectActions();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch project members
    const { data: projectData, error: projectError } = useSWR(
        projectId ? `${baseURL}/projects/${projectId}` : null,
        fetcher
    );

    // Fetch tags
    const { data: tagsData, error: tagsError } = useSWR(
        `${baseURL}/all-tags`,
        fetcher
    );

    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    const handleTagChange = (tags: Tag[]) => {
        setSelectedTags(tags);
    };

    const onSubmit = async (data: FormData) => {
        try {
            await createTask(
                data.name,
                data.description,
                data.assigned_to_ids,
                data.due_date,
                data.status,
                selectedTags.map((tag) => tag.id),
                projectId as string);
        } catch (error: any) {
            setError("root", { type: "manual", message: error.message });
        }        
    };

    const handleMemberChange = (memberId: string) => {
        const updatedMembers = selectedMembers.includes(memberId)
          ? selectedMembers.filter(id => id !== memberId)
          : [...selectedMembers, memberId];
        setSelectedMembers(updatedMembers);
        setValue("assigned_to_ids", updatedMembers);
    };

    if (!projectData || !tagsData) {
        return <div>Loading...</div>;
    }

    if (projectError || tagsError) {
        return <div>Error loading data.</div>;
    }

    const members = projectData.members || [];
    const tags = tagsData || [];

    return (
        <div className="text-black bg-white rounded-lg px-4 py-2 my-2">
            <div className="my-2">
                <h1 className="my-2 font-bold">Create A New Task</h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="my-2">
                    <label htmlFor="name">
                        Task Name
                    </label>
                    <input
                      id="name"
                      {...register("name", { required: "Task name is required"}
                      )}
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                              className="mb-2"
                            >
                                    <label>
                                        <input
                                          type="checkbox"
                                          value={member.id}
                                          checked={selectedMembers.includes(member.id)}
                                          onChange={() => handleMemberChange(member.id)}
                                          className="mb-2"
                                        />
                                        <span
                                          className={selectedMembers.includes(member.id) ? "bg-sky-400 text-white p-2" : "text-black p-2"}
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
                <div className="space-x-3">
                    <button type="submit"
                        className="my-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Create Task
                    </button>
                    <BackButton />
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
