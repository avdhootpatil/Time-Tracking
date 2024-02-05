"use client";

import { useEffect, useState } from "react";
import { validateToken } from "../services/user";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  // let isAuthenticated = undefined;

  useEffect(async () => {
    let user = localStorage.getItem("user");
    const retrievedUser = JSON.parse(user);

    let response = await validateToken(retrievedUser?.token || "");

    if (response.status === "success") {
      setIsAuthenticated(true);
      // isAuthenticated = true;
    }
  }, []);

  return isAuthenticated;
};

export default useAuth;
