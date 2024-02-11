import { Result, handleApiError, httpClient } from "@/utils";

const deleteTask = async (taskId, token) => {
  const response = await httpClient.post(
    `/timesheet/deletetask/${taskId}`,
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

export default deleteTask;
