import { useState } from "react";
import { useProjectActions } from "@/app/hooks/project.actions";
import { useParams } from "next/navigation";
import { fetcher } from "@/app/fetcher";
import useSWR from "swr";
import Date from "../Date";
import FormattedTime from "../FormattedTime";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

const CommentForm = () => {
    const { createComment, editComment, deleteComment } = useProjectActions();    
    const { id: projectId, taskId } = useParams();
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const { data: comments, error, mutate } = useSWR(
        projectId && taskId ? `${baseURL}/projects/${projectId}/tasks/${taskId}/comments/` : null,
        fetcher
    );
    
    const [newComment, setNewComment] = useState("");
    const [editCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    const handleCreateComment = async () => {
        if (newComment.trim() === "") return;
        try {
          await createComment(projectId as string, taskId as string, newComment);
          setNewComment("");
          await mutate(); // Re-fetch comments after creating a new one
        } catch (error) {
          console.error("Error creating comment: ", error);
        }
    };

    const handleEditComment = async (commentId: string) => {
        if (editingText.trim() === "") return;
        try {
          await editComment(projectId as string, taskId as string, commentId, editingText);
          setEditingCommentId(null);
          setEditingText("");
          await mutate(); // Re-fetch comments after editing
        } catch (error) {
          console.error("Error editing comment: ", error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
      try {
        await deleteComment(projectId as string, taskId as string, commentId);      
        await mutate(); // Re-fetch comments after deletion
      } catch (error) {
        console.error("Error deleting comment: ", error);
      }
    };

    if (error) return <div>Error loading comments.</div>;
    if (!comments) return <div>Loading comments...</div>

    return (
        <div>
            <div className="text-left border-b-2 pb-6 border-slate-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="text-black w-full md:w-1/2 p-2 mb-1 rounded-lg border-2 border-slate-300"
              />
              <br />
              <button
                onClick={handleCreateComment}
                className="bg-white px-3 py-1 border-2 border-slate-600 text-slate-600 hover:border-blue-600 hover:text-blue-600 rounded-2xl"
              >
                Submit
              </button>
            </div>
            <div className="mt-4 py-2 w-full md:w-1/2">
              {comments.map((comment: any) => (
                  <div key={comment.id} className="p-2 mb-4 bg-blue-100 rounded-lg">
                      <div className="flex flex-row my-2 items-center justify-between">
                        <p className="flex flex-row my-2 items-center">
                          <span className="w-8 p-1 rounded-2xl bg-blue-200 text-indigo-900"><FaceSmileIcon /></span>
                          <span className="ml-2 font-bold">{comment.author}</span>
                        </p>
                        <p className="space-x-2">
                          <Date dateString={comment.created_at} />
                          <FormattedTime dateString={comment.created_at} />
                        </p>
                      </div>
                      {editCommentId === comment.id ? (
                          <>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              placeholder={comment.content}
                              className="text-black w-full p-2 mb-1 rounded-lg border-2 border-slate-300"
                            />
                            <br />
                            <div className="text-right">
                              <button
                                onClick={() => handleEditComment(comment.id)}
                                className="hover:text-blue-600"              
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingText("");
                                }}
                                className="ml-2 hover:text-blue-600"   
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                      ) : (
                          <>
                            <p className="bg-white p-2 my-1 rounded-lg">
                              {comment.content}
                            </p>
                            <div className="text-right">
                              <button
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingText(comment.content);
                                }}
                                className="hover:text-blue-600"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="ml-2 hover:text-blue-600"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                      )}
                  </div>
              ))}
            </div>
        </div>
    );
};

export default CommentForm;
