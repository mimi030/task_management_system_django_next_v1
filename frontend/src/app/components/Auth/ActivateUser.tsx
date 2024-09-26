import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserActions } from "@/app/hooks/user.actions";
import { useRouter } from "next/navigation";

interface ActivateUserProps {
    uid: string;
    token: string;
}

const ActivateUser = ({ uid, token }: ActivateUserProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    const router = useRouter();
    const { activateUserAccount } = useUserActions();
    
    const [isLoading, setIsLoading] = useState(true);

    const onSubmit = useCallback(async () => {
        try {
            await activateUserAccount(uid, token);
            alert("Your Account Is Activated!");
            router.push("/");
        } catch (error: any) {
            console.error("Error in activating account.", error);
            alert("Failed to activate account. Please try again.");
        }
    }, [uid, token, router, activateUserAccount]);

    useEffect(() => {
        if (uid && token) {
            onSubmit();
        }
    }, [uid, token, onSubmit]);

    return (
        <div>
            <p>Activating your account...</p>
            <p>After activation, you will be redirected to the login page.</p>
        </div>
    );
};

export default ActivateUser;
