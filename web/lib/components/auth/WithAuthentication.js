"use client";

import { removeUserFromLocalStorage } from "@/lib/helperFunctions";
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
        if (retrievedUser) {
          let response = await validateToken(retrievedUser?.token || "");
          if (response.status === "success") {
            console.log("authenticated");
          } else {
            removeUserFromLocalStorage();
            ROUTER.replace("/login");
          }
        } else {
          ROUTER.replace("/login");
        }
      })();
    }, [ROUTER]);

    return <WrappedComponent {...props} />;
  };
};

export default WithAuthentication;
