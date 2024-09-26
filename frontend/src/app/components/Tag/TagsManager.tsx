import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/app/fetcher";
import { useProjectActions } from "@/app/hooks/project.actions";

export interface Tag {
    id: string;
    name: string;
}

interface TagsManagerProps {
    selectedTags: Tag[];
    onChange: (tags: Tag[]) => void;
}

const TagsManager: React.FC<TagsManagerProps> = ({ selectedTags, onChange }) => {
    const [newTag, setNewTag] = useState("");
    const { createTag } = useProjectActions();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const { data: tagsData, error } = useSWR(
        `${baseURL}/all-tags`,
        fetcher
    );

    const handleTagChange = (tag: Tag) => {
        const updatedTags = selectedTags.some((selectedTag) => selectedTag.id === tag.id)
          ? selectedTags.filter((selectedTag) => selectedTag.id !== tag.id)
          : [...selectedTags, tag];

          onChange(updatedTags);
    };

    const handleAddTag = async () => {
        try {
            if (!newTag.trim()) return;
            const newTagData = await createTag(newTag);
            mutate(`${baseURL}/all-tags`);
            setNewTag("");
            onChange([...selectedTags, newTagData]);
        } catch (error) {
            console.error("Error creating tag: ", error);
        }
    };

    if (error) return <div>Error loading tags.</div>;
    if (!tagsData) return <div>Loading tags...</div>;

    const allTags = tagsData || [];

    return (
        <div>
            <label>
                Tags:
            </label>
            <div>
                {allTags.map((tag: Tag) => (
                    <label
                      key={tag.id}
                      className="inline-flex items-center mt-2 mr-2"
                    >
                        <input
                          type="checkbox"
                          checked={selectedTags.some((selectedTag) => selectedTag.id === tag.id)}
                          onChange={() => handleTagChange(tag)}
                          className="form-checkbox h-5 w-5 text-gray-600"
                        />
                        <span className="ml-2 text-black">
                            {tag.name}
                        </span>
                    </label>
                ))}
            </div>
            <div className="mt-2 mb-6 flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="New tag name"
                  className="w-2/3 px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 px-8 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Add Tag
                </button>
            </div>
        </div>
    );
};

export default TagsManager;
