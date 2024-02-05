import axios from "axios";
import { token } from "../localStorage/jwtToken";

const deleteProject = async (id) => {
  let res = axios.post(
    `http://localhost:5001/project/deleteProject/${id}`,
    undefined,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

export default deleteProject;
