import { Result, handleApiError, httpClient } from "@/utils";

/**
 * Api call to get leaves by month
 * @param {number} month
 * @param {string} token
 * @returns
 */
const getLeavesByMonth = async (month, token) => {
  const response = await httpClient.get(
    `/leave/getleavesbymonth?month=${month}`,
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

export default getLeavesByMonth;
