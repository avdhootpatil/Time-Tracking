"use client";

import OutlinedInput from "@/lib/components/OulinedInput";
import { getUserFromLocalStorage } from "@/lib/helperFunctions";
import { login } from "@/lib/services/user";
import { userLoginSchema } from "@/lib/validation";
import { produce } from "immer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";

export default function LoginPage() {
  const [user, setUser] = useState({
    userEmail: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const SCHEMA = userLoginSchema();
  const ROUTER = useRouter();

  useEffect(() => {
    let user = getUserFromLocalStorage();
    if (user) {
      ROUTER.push("/");
    }
  }, []);

  const handleChange = (name) => (event) => {
    let nextErrors = { ...errors };
    let nextState = produce(user, (draft) => {
      switch (name) {
        case "userEmail":
        case "password":
          draft[name] = event.target.value;
          break;

        default:
          break;
      }

      try {
        SCHEMA.validateSyncAt(name, draft);
        nextErrors[name] = [];
      } catch (e) {
        nextErrors[name] = [...e.errors];
      }
    });

    setUser(nextState);
    setErrors(nextErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      SCHEMA.validateSync(user, { abortEarly: false });

      let response = await login(user);

      if (response.status === "success") {
        toast.success("Logged in successfully!");

        localStorage.setItem("user", JSON.stringify(response.data));

        setTimeout(() => {
          ROUTER.push("/");
        }, 1000);
      } else {
        let { status } = response;
        if (status === "notFound" || status === "unauthorized") {
          toast.error(response.errors);
        } else if (status === "invalid") {
          setErrors(response.validationErrors);
        } else {
          toast.error(e.errors);
        }
      }
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        let newEr = produce({}, (draft) => {
          e.inner.forEach((error) => {
            draft[error.path] = [...error.errors];
          });
        });
        setErrors(newEr);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <OutlinedInput
                  onChange={handleChange("userEmail")}
                  value={user?.userEmail}
                  isError={errors && errors?.userEmail?.length}
                  error={errors && errors?.userEmail}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <OutlinedInput
                  onChange={handleChange("password")}
                  value={user?.password}
                  isError={errors && errors?.password?.length}
                  error={errors && errors?.password}
                  type="password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
