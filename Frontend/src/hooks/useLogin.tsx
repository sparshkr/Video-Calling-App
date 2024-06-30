import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface LoginResponse extends User {
  error?: string;
  // Add other properties based on your actual response structure
}

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json: LoginResponse = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error || "An unknown error occurred");
    } else {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // update loading state
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
