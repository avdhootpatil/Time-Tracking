import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to get all leave types
 * @param {String} token
 * @returns
 */
const getLeaveTypes = async (token) => {
  const response = await httpClient.get(`/leave/getleavetypes`, {
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

export default getLeaveTypes;
