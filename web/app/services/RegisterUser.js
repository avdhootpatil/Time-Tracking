import axios from "axios";
const registerUser = async (payload) => {
  let res = await axios.post("http://localhost:3001/user/register", payload);
};

export default registerUser;
