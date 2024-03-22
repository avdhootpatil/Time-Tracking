import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to get the approvers
 * @param {string} token
 * @returns
 */
const getApprovers = async (token) => {
  const response = await httpClient.get(`/approval/getapprovers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export default getApprovers;
