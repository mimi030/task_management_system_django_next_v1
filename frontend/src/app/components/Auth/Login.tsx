import { useForm } from "react-hook-form";
import { useUserActions } from "@/app/hooks/user.actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>();
  const router = useRouter();
  const { login } = useUserActions();

  const onSubmit = async (data: FormData) => {
    try {
        await login(data.email, data.password);
    } catch (error: any) {
        setError("root", { type: "manual", message: error.message });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-light-primary">
      <div className="w-full max-w-md overflow-hidden rounded-2xl px-8 py-6 mt-4 text-left text-black bg-white shadow-lg">
        <h3 className="text-2xl font-semibold">Login to your account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div>
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.email && (
              <span className="text-xs text-red-600">Email is required</span>
            )}
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.password && (
              <span className="text-xs text-red-600">Password is required</span>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button className="w-full px-12 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              Login
            </button>
          </div>
          {errors.root && (
            <span className="text-xs text-red-600">{errors.root.message}</span>
          )}
        </form>
        <div className="mt-6 text-center">
          <Link
            href="/auth/password/reset-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
          Don&apos;t have an account? 
          <Link
            href="/auth/register"
            className="text-yellow-600 hover:underline mx-1"
          >
            Sign up
          </Link>
          for free.
        </div>
      </div>
    </div>
  );
};

export default Login;
