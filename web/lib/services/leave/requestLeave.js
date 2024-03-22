import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to request leave
 * @param {Object} payload
 * @param {String} token
 * @returns
 */
const requestLeave = async (payload, token) => {
  let response = await httpClient.post(`/leave/requestleave`, payload, {
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

export default requestLeave;
