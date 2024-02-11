import { Result, handleApiError, httpClient } from "@/utils";

const saveTask = async (payload, token) => {
  let response;
  if (payload.taskId > 0) {
    response = await httpClient.put(
      `/timesheet/updatetimeentry/${payload?.taskId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } else {
    response = await httpClient.post(`/timesheet/addtimeentry`, payload, {
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

export default saveTask;
