import { usePathname, useRouter } from "next/navigation";

const BackButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    
    const handleBack = () => {
        // Split the current path into segments
        const segments = pathname.split("/").filter(Boolean);

        // Check if one of the segments is "tasks"
        const isTaskPage = segments.includes("tasks");

        if (isTaskPage) {
            // If "tasks" is in the path, navigate to the parent project page
            const taskIndex = segments.indexOf("tasks");
            const parentSegments = segments.slice(0, taskIndex);
            const parentPath = `/${parentSegments.join("/")}`;
            router.push(parentPath);
        } else if (segments.length > 0) {
            // Remove the last segment to get the parent path
            const parentSegments = segments.slice(0, -1);
            const parentPath = `/${parentSegments.join("/")}`;
            router.push(parentPath);
        } else {
            router.push("/projects");
        }
    };

    return (
        <button
          onClick={handleBack}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
            Back
        </button>
    );
};

export default BackButton;
