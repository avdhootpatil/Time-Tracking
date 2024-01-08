import { validateToken } from "@/lib/services/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const WithAuthentication = (WrappedComponent) => {
  return function hoc(props) {
    const ROUTER = useRouter();

    useEffect(() => {
      (async () => {
        let user = localStorage.getItem("user");
        const retrievedUser = JSON.parse(user);

        let response = await validateToken(retrievedUser?.token || "");
        if (response.status === "success") {
          console.log("authenticated");
        } else {
          ROUTER.push("/login");
        }
      })();
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default WithAuthentication;
