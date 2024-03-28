import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to get single leave details
 * @param {Number} leaveId
 * @param {String} token
 * @returns
 */
const getLeaveById = async (leaveId, token) => {
  const response = await httpClient.get(`/leave/getleavebyid/${leaveId}`, {
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

export default getLeaveById;