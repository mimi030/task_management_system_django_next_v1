import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUserActions } from "@/app/hooks/user.actions";

type FormData = {
    password: string;
    re_password: string;
};

type ResetPasswordConfirmationProps = {
    uid: string;
    token: string;
};

const ResetPasswordConfirmation = ({ uid, token }: ResetPasswordConfirmationProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>();
    const router = useRouter();
    const { resetPasswordConfirm } = useUserActions();

    const onSubmit = async (data: FormData) => {
        if (data.password !== data.re_password) {
            setError("re_password", {
                type: "manual",
                message: "Passwords do not match.",
            });
            return;
        }

        try {
            await resetPasswordConfirm(uid, token, data.password, data.re_password);
            alert("Password has been reset successfully.");
            router.push("/"); // Redirect to home after success
        } catch (error) {
            console.error("Error resetting password.", error);
            alert("Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-primary">
            <div className="w-full max-w-md overflow-hidden rounded-2xl px-8 py-6 mt-4 text-left text-black bg-white shadow-lg">
                <h3 className="text-2xl font-semibold">Set New Password</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div>
                        <label className="block" htmlFor="password">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your new password"
                            {...register("password", { required: true })}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.password && (
                            <span className="text-xs text-red-600">Password is required</span>
                        )}
                    </div>
                    <div>
                        <label className="block" htmlFor="re_password">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Re-enter your new password"
                            {...register("re_password", { required: true })}
                            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.re_password && (
                            <span className="text-xs text-red-600">Re-enter Password is required</span>
                        )}
                    </div>
                <div className="flex items-center justify-between mt-4">
                    <button className="w-full px-12 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                    Reset Password
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordConfirmation;
