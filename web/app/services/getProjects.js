import axios from "axios";
import { token } from "../localStorage/jwtToken";

const getProjects = async () => {
  let res = await axios.get("http://localhost:5001/project/getprojects", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export default getProjects;
