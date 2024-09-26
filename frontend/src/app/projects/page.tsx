"use client";

import useSWR from "swr";
import axiosService, { fetcher } from "@/app/fetcher";
import { useRouter, useSearchParams } from "next/navigation";
import Date from "@/app/components/Date";
import FormattedTime from "@/app/components/FormattedTime"
import { PencilIcon } from "@heroicons/react/24/outline";

export default function ProjectListPage() {
  const { data: projects, error } = useSWR(
    "/projects/",
    fetcher
  );
  const router = useRouter();

  if (error) return <div>Error loading projects.</div>;
  if (!projects) return <div>Loading...</div>;
  
  // Navigate user to create project page
  const navigateProjectCreationPage = () => {
    router.push("/projects/new")
  }

  // Navigate to project details page
  const navigateProjectDetailsPage = (projectId: string) => {
    router.push(`/projects/${projectId}`)
  }

  // Navigate to project edit page
  const navigateProjectEditPage = (projectId: string) => {
    router.push(`/projects/${projectId}/edit`);
  };

  return (
    <div>
      <h1 className="my-2 font-bold">Projects</h1>
      
      <div className="my-4 flex flex-row">
        <h4 className="align-center py-2">
          Total Project Number: <b>{projects.length}</b>
        </h4>
        <button
          onClick={navigateProjectCreationPage}
          className="bg-blue-500 text-white ml-6 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add Project
        </button>
      </div>
  
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white text-slate-800">
          <thead>
            <tr className="text-left">
              <th className="px-4 py-2 sticky left-0 bg-white text-light-text shadow-lg rounded-tl-lg">Name</th>
              <th className="px-4 py-2">Tasks</th>
              <th className="px-4 py-2">Last Updated</th>
              <th className="px-4 py-2">Edit</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project: any) => {
              const isOwner = project.is_owner; // Check ownership for each project
              
              return (
                <tr key={project.id} className="border-t border-light-primary">
                  <td className="px-4 py-2 sticky left-0 bg-white text-light-text shadow-lg">
                    {project.name}
                  </td>
                  <td className="px-4 py-2">{project.tasks.length}</td>
                  <td className="px-4 py-2">
                    <Date dateString={project.updated_at} />
                    <br />
                    <FormattedTime dateString={project.updated_at} />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={isOwner ? () => navigateProjectEditPage(project.id) : undefined}
                      disabled={!isOwner}
                      className={`flex h-[48px] grow items-center justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3 ${
                        isOwner
                          ? "text-blue-300 hover:text-blue-500 transition-colors"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <PencilIcon className="w-6" />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => navigateProjectDetailsPage(project.id)}
                      className="bg-white text-slate-400 border-2 border-slate-300 px-4 py-2 rounded hover:bg-slate-400 hover:text-white hover:border-slate-400 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );  
}
