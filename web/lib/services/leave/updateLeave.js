import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to update leave
 * @param {number} leaveId
 * @param {object} payload
 * @param {string} token
 * @returns
 */
const updateLeave = async (leaveId, payload, token) => {
  let response = await httpClient.put(
    `/leave/updateleave/${leaveId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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

export default updateLeave;
