import axios from "axios";
import { token } from "../localStorage/jwtToken";
const addTimeEntry = async (payload) => {
  let res = axios.post(
    "http://localhost:5001/timesheet/addtimeentry",
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

export default addTimeEntry;
