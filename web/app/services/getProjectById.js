import axios from "axios";
import { token } from "../localStorage/jwtToken";

const getProjectById = async (id) => {
  let res = await axios.get(
    `http://localhost:5001/project/getProjectById/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

export default getProjectById;
