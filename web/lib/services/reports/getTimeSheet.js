import { Result, handleApiError, httpClient } from "@/utils";

const getTimeSheet = async (startDate, endDate, token) => {
  const response = await httpClient.get(
    `/reports/gettimesheet?startDate=${startDate}&endDate=${endDate}`,
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

export default getTimeSheet;
