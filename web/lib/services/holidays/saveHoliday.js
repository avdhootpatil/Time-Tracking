import { Result, handleApiError, httpClient } from "@/utils";

const saveHoliday = async (id, payload, token) => {
  let response;
  if (id > 0) {
    response = await httpClient.put(`/holidays/updateholiday/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    response = await httpClient.post(`/holidays/addholiday`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
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

export default saveHoliday;
