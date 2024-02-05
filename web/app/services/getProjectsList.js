import axios from "axios";
import { token } from "../localStorage/jwtToken";

const getProjectsList = async (pageNo, pageSize) => {
  let res = await axios.get(
    `http://localhost:5001/project/getprojectlist?page=${pageNo}&pageSize=${pageSize}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res;
};

export default getProjectsList;
