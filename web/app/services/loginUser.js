import axios from "axios";
const loginUser = async (payload) => {
  let res = await axios.post("http://localhost:3001/user/login", payload);

  return res;
};

export default loginUser;
