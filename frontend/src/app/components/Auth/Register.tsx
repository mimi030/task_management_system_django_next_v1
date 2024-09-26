import { useForm } from "react-hook-form";
import { useUserActions } from "@/app/hooks/user.actions";
import { useRouter } from "next/navigation";

type FormData = {
    email: string;
    username: string;
    password: string;
    re_password: string;
    first_name: string;
    last_name: string;
};

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<FormData>();

    const router = useRouter();
    const { register: registerUser } = useUserActions(); // Rename to avoid naming conflict with useForm's register
    
    const onSubmit = async (data: FormData) => {
        try {
            await registerUser(data.email, data.username, data.password, data.re_password, data.first_name, data.last_name);
            router.push("/");
        } catch (error: any) {
            setError("root", { type: "manual", message: error.message });
        }        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-light-primary">
          <div className="w-full max-w-md overflow-hidden rounded-2xl px-8 py-6 mt-4 text-left text-black bg-white shadow-lg">
            <h3 className="text-2xl font-semibold">Register your account</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
              <div>
                <label className="block" htmlFor="email">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Email"
                  {...register("email", { required: "Email is required" })}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.email && (
                  <span className="text-xs text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username", { required: "Username is required" })}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.username && (
                  <span className="text-xs text-red-600">
                    {errors.username.message}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.password && (
                  <span className="text-xs text-red-600">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <label className="block" htmlFor="re_password">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register("re_password", { required: "Confirm password is required" })}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
                {errors.re_password && (
                  <span className="text-xs text-red-600">
                    {errors.re_password.message}
                  </span>
                )}
              </div>
              <div className="mt-4 flex space-x-4">
                <div className="w-1/2">
                  <label className="block" htmlFor="first_name">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("first_name", { required: "First name is required" })}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.first_name && (
                    <span className="text-xs text-red-600">
                      {errors.first_name.message}
                    </span>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block" htmlFor="last_name">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register("last_name", { required: "Last name is required" })}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.last_name && (
                    <span className="text-xs text-red-600">
                      {errors.last_name.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between my-8">
                <button className="w-full px-12 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                  Register
                </button>
              </div>
              {errors.root && (
                <span className="text-xs text-red-600">{errors.root.message}</span>
              )}
            </form>
          </div>
        </div>
      );
};

export default Register;
