import { Result, handleApiError, httpClient } from "@/utils";

const exportBillingSheet = async (startDate, endDate, token) => {
  const response = await httpClient.get(
    `/reports/exportbillingsheet?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.ok) {
    let data = await response.blob();
    var blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    return Result.success(blob);
  } else {
    let status = response.status;
    let message = await response.json();
    let nextResponse = { status, errors: { ...message } };
    return handleApiError(nextResponse);
  }
};

export default exportBillingSheet;
