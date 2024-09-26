"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";

type BreadcrumbProps = {
    homeElement: ReactNode;
    separator: ReactNode;
    containerClasses?: string;
    listClasses?: string;
    activeClasses?: string;
    capitalizeLinks?: boolean;
    disabledPaths?: string[];
}

const Breadcrumb = ({
    homeElement,
    separator,
    containerClasses,
    listClasses,
    activeClasses,
    capitalizeLinks = true,
    disabledPaths = [],
}: BreadcrumbProps) => {
    const { id: projectId, taskId } = useParams();
    const paths = usePathname();
    
    // Fetch project and task data
    const { data: project } = useSWR(
        projectId ? `/projects/${projectId}/` : null,
        fetcher
    );

    const { data: task } = useSWR(
        taskId ? `/projects/${projectId}/tasks/${taskId}/` : null,
        fetcher
    );

    // Check if the current path is the home page
    if (paths === "/" || paths.startsWith('/auth/')) {
        return null; // Hide the breadcrumb
    }

    const pathNames = paths.split("/").filter((path) => path);

    return (
        <nav aria-label="breadcrumb">
            <ul className={containerClasses}>
                <li className={listClasses}>
                    <Link href="/">
                        {homeElement}
                    </Link>
                </li>
                {pathNames.length > 0 && separator}
                {pathNames.map((link, index) => {
                    const href = `/${pathNames.slice(0, index + 1).join("/")}`;
                    const isActive = paths === href;
                    const isDisabled = disabledPaths.includes(link);
                    const itemClasses = isActive
                      ? `${listClasses} ${activeClasses}`
                      : listClasses;

                    let itemLink = capitalizeLinks
                      ? link.charAt(0).toUpperCase() + link.slice(1)
                      : link;

                    // Replace ID with actual name if available
                    if (link === projectId && project) {
                        itemLink = project.name;
                    } else if (link === taskId && task) {
                        itemLink = task.name;
                    }

                    return (
                        <React.Fragment key={index}>
                            <li className={itemClasses}>
                                {isDisabled ? (
                                    <span className="text-gray-400 cursor-not-allowed">
                                        {itemLink}
                                    </span>
                                ) : (
                                    <Link href={href}>
                                        {itemLink}
                                    </Link>
                                )}
                            </li>
                            {pathNames.length !== index + 1 && separator}
                        </React.Fragment>
                    );
                })}
            </ul>
        </nav>
    );
};

export default Breadcrumb;
