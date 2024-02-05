import axios from "axios";
import { token } from "../localStorage/jwtToken";

const addProject = async (id, payload) => {
  if (id == 0) {
    let res = axios.post("http://localhost:5001/project/addproject", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } else {
    let res = axios.post(`http://localhost:5001/project/updateproject/${id}`, {
      payload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  }
};

export default addProject;
