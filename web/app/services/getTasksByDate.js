import axios from "axios";
import { token } from "../localStorage/jwtToken";

const getTasksByDate = async (date) => {
  let res = await axios.get(
    `http://localhost:5001/timesheet/gettasksbydate/${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res;
};

export default getTasksByDate;
