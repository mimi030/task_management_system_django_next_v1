"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useRouter, useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BackButton from "@/app/components/Button/BackButton";
import CommentForm from "@/app/components/Comment/CommentForm";
import Date from "@/app/components/Date";
import FormattedTime from "@/app/components/FormattedTime";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

export default function TaskDetailsPage() {
    const router = useRouter();
    const { id: projectId, taskId } = useParams();
    const { data: project, error: projectError } = useSWR(
        `/projects/${projectId}/`,
        fetcher
      );
    const { data: task, error: taskError, isLoading } = useSWR(
        `/projects/${projectId}/tasks/${taskId}/`,
        fetcher
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (taskError) {
            console.error("Task page - Error loading task:", taskError);
            setErrorMessage("Failed to load task. Please try again.");
        }
    }, [taskError])

    // Handle loading and error states
    if (isLoading) return <div>Loading Task...</div>;
    if (taskError) return <div>Error Loading Task.</div>;

    const isOwner = project.is_owner;

    // Navigate to task edit page
    const navigateTaskEditPage = () => {
        router.push(`/projects/${projectId}/tasks/${taskId}/edit`);
    }

    // Return task details page content
    return (
        <div className="my-2">
            <h1 className="my-2 font-bold">{task.name}</h1>

            <div className="my-2 bg-white p-4 rounded-lg shadow-lg">
                <table className="w-full custom-table mb-6">
                    <tbody>
                        <tr>
                            <td className="font-bold">Name:</td>
                            <td>{task.name}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Description:</td>
                            <td>{task.description}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Due Date:</td>
                            <td>
                                <Date dateString={task.due_date} />
                                <br />
                                <FormattedTime dateString={task.due_date} />
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold">Status:</td>
                            <td>{task.status}</td>
                        </tr>
                        <tr>
                            <td className="font-bold">Assignee:</td>
                            <td>
                                <div className="w-full">
                                    {task.assigned_to.map((member: any) => (
                                        <p key={member.id} className="flex items-center mb-2">
                                            <span className="w-8 p-1 rounded-2xl bg-blue-200 text-indigo-900"><FaceSmileIcon /></span>
                                            <span className="ml-2 font-bold">{member.username}</span>
                                        </p>
                                    ))}
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-bold">Tags:</td>
                            <td>
                                <div className="flex flew-row">
                                    {task.tags && task.tags.map((tag: any) => (
                                        <p key={tag.id} className="px-2 py-1 rounded-lg bg-yellow-300">{tag.name}</p>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {isOwner ?? (
                <button
                  onClick={navigateTaskEditPage}
                  className="bg-white border text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                    Edit
                </button>
            )}
            <div className="my-4 p-4 bg-white rounded-lg shadow-lg">
                <h2 className="font-bold border-b-2 border-slate-400">Add a comment</h2>
                <br />
                <CommentForm />
            </div>
            <BackButton />
        </div>
    );
};
