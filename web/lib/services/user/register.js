import { Result, handleApiError, httpClient } from "@/utils";

const register = async (payload) => {
  let response = await httpClient.post(`/user/register`, payload);
  if (response.ok) {
    let data = await response.json();
    return Result.success(data);
  } else {
    let status = response.status;
    let message = await response.json();
    let nextResponse = { status, errors: { ...message } };
    return handleApiError(nextResponse);
  }
};

export default register;
