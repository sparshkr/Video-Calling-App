import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface SignupResponse extends User {
  error?: string;
}

export const useSignup = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(undefined);
  const { dispatch } = useAuthContext();

  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    console.log(JSON.stringify({ email, password }));

    const response = await fetch("http://localhost:3000/user/signup", {
      //   mode: "no-cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json: SignupResponse = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error || "An unknown error occurred");
    }

    if (response.ok) {
      // save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
