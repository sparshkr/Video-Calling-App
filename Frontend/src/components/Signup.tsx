import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signup, error, isLoading } = useSignup();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signup(email, password);
  };

  return (
    <section className="bg-gray-900 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 bg-gray-700 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-gray-200">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-gray-200"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white text-gray-200"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-black border-solid border-sky-500 bg-indigo-600"
                disabled={isLoading}
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-200 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    navigate("/login");
                  }}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </section>
  );
};

export default Signup;
