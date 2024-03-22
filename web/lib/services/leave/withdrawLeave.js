import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to withdra leave request
 * @param {number} leaveId
 * @param {string} token
 * @returns
 */
const withdrawLeave = async (leaveId, token) => {
  let response = await httpClient.put(
    `/leave/withdrawleaveapplication/${leaveId}`,
    undefined,
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

export default withdrawLeave;
