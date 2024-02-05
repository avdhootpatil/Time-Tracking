import axios from "axios";
import { token } from "../localStorage/jwtToken";

const getClients = async () => {
  let res = await axios.get("http://localhost:5001/client/getClients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export default getClients;
