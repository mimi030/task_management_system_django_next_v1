"use client";

import useSWR from "swr";
import axiosService, { fetcher } from "@/app/fetcher";
import { useRouter, useParams } from "next/navigation";
import { useProjectActions } from "@/app/hooks/project.actions";
import { useEffect, useState } from "react";
import BackButton from "@/app/components/Button/BackButton";
import Date from "@/app/components/Date";
import FormattedTime from "@/app/components/FormattedTime";
import { FaceSmileIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { deleteProject } = useProjectActions();
  const { data: project, error, isLoading } = useSWR(
    `/projects/${id}/`,
    fetcher
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (error) {
      console.error("Project page - Error loading project:", error);
      setErrorMessage("Failed to load project. Please try again.");
    }
  }, [error])

  // Handle loading and error states
  if (isLoading) return <div>Loading Project...</div>;
  if (error) return <div>Error loading projects.</div>;

  const isOwner = project.is_owner;

  // Check if a member is part of the project
  const isMemberOfProject = (memberId: string) => {
    return project.members.some((member: any) => member.id === memberId);
  }

  // Determine the style for a member based on task status
  const getMemberStyleForTask = (isMemberInProject: boolean, isCompletedTask: boolean) => {
    if (isMemberInProject) {
      return "text-black";
    }
    return isCompletedTask ? "text-gray-500" : "hidden";
  };

  // Render the task assignees with the appropriate conditions and styles.
  const renderAssignee = (task: any) => {
    if (task.assigned_to.length === 0) {
      return <p>No assignee</p>;
    }

    const memberElements = task.assigned_to.map((member: any) => {
      const isMemberInProject = isMemberOfProject(member.id);
      const isCompletedTask = task.status === "completed";
      const memberStyle = getMemberStyleForTask(isMemberInProject, isCompletedTask);

      return (
        <p key={member.id} className={memberStyle}>
          {member.username}
        </p>
      );
    });

    const hasVisibleMembers = memberElements.some((memberElement: any) => memberElement.props.className !== "hidden");

    return (
      <>
        {memberElements}
        {!hasVisibleMembers && <p>No assignee</p>}
      </>
    );
  };

  // Navigate to project edit page
  const navigateProjectEditPage = (projectId: string) => {
    router.push(`/projects/${projectId}/edit`);
  };

  // Navigate the user to tasks creation page from the corresponding project page
  const navigateTaskCreationPage = async (projectId: string) => {
    router.push(`/projects/${projectId}/tasks/new`);
  };

  // Navigate to task edit page
  const navigateTaskEditPage = async (projectId: string, taskId: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}/edit`);
  };

  // Navigate to task details page
  const navigateTaskDetailsPage = (projectId: string, taskId: string) => {
    router.push(`/projects/${projectId}/tasks/${taskId}`);
  };

  // Handle deletion of a menu item
  const handleDelete = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      // Refresh the page after deletion
      router.refresh();
      router.push("/projects/")
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return(
    <div>
      <h1 className="my-2 font-bold">{project.name}</h1>
      <div className="tabs">
        <div className="flex flex-row border-b border-gray-300">
          <button
            className={`p-4 ${activeTab === 0 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab(0)}
          >
            Project Details
          </button>
          <button
            className={`p-4 ${activeTab === 1 ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTab(1)}
          >
            Tasks List
          </button>
        </div>

        <div className="my-4 overflow-auto rounded-lg">
          {activeTab === 0 && 
            <div className="bg-white p-4">
              <table className="w-full custom-table mb-6">
                <tbody>
                  <tr>
                    <td className="font-bold">Name:</td>
                    <td>{project.name}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Description:</td>
                    <td>{project.description}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Project Leader:</td>
                    <td>{project.owner}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Members:</td>
                    <td>
                      <div className="text-sm mb-4">
                        <span className="px-3 py-1 rounded-2xl bg-amber-300">{project.members.length}</span> members
                      </div>
                      <div className="mt-2 w-full">
                        {project.members.map((member: any) => (
                          <p key={member.id} className="flex items-center mb-2">
                            <span className="w-8 p-1 rounded-2xl bg-blue-200 text-indigo-900"><FaceSmileIcon /></span>
                            <span className="ml-2 font-bold">{member.username}</span>
                          </p>
                        ))}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              {isOwner && (
                <>
                  <button
                    onClick={() => navigateProjectEditPage(project.id)}
                    className="bg-blue-300 text-white my-2 ml-0 mr-2 px-4 py-2 rounded hover:bg-blue-500 transition-colors"
                  >
                    Edit Project
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-light-rock text-white px-4 py-2 rounded hover:bg-yellow-900 transition-colors"
                  >
                    Delete Project
                  </button>
                </>
              )}
            </div>
          }
          {activeTab === 1 && 
            <div>
                <table className="bg-white text-slate-800">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2 sticky left-0 bg-white shadow-lg rounded-tl-lg">Task Name</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Assigned To</th>
                      <th className="px-4 py-2">Due Date</th>
                      <th className="px-4 py-2">Status</th>
                      {isOwner && (
                        <th className="px-4 py-2">Edit</th>
                      )}
                      <th className="px-4 py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.tasks.map((task: any) => (
                      <tr key={task.id} className="border-t">
                        <td className="px-4 py-2 sticky left-0 bg-white shadow-lg">{task.name}</td>
                        <td className="px-4 py-2">{task.description}</td>
                        <td className="px-4 py-2">
                          {renderAssignee(task)}
                        </td>
                        <td className="px-4 py-2">
                          <Date dateString={task.due_date} />
                          <br />
                          <FormattedTime dateString={task.due_date} />
                        </td>
                        <td className="px-4 py-2">{task.status}</td>
                        {isOwner && (
                          <td className="px-4 py-2">
                            <button
                              onClick={() => navigateTaskEditPage(project.id, task.id)}
                              className="text-blue-300 hover:text-blue-500 transition-colors"
                            >
                              <PencilIcon className="w-6" />
                            </button>
                          </td>
                        )}
                        <td className="px-4 py2">
                          <button
                            onClick={() => navigateTaskDetailsPage(project.id, task.id)}
                            className="bg-white text-slate-400 border-2 border-slate-300 px-4 py-2 rounded hover:bg-slate-400 hover:text-white hover:border-slate-400 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          }
        </div>
      </div>
      
      <div className="my-2">
        {isOwner && (
          <button
            onClick={() => navigateTaskCreationPage(project.id)}
            className="bg-blue-500 text-white mr-3 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
          Add Task
          </button>
        )}
        <BackButton />
      </div>
    </div>
  );
};
