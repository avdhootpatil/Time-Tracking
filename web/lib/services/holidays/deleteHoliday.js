import { Result, handleApiError, httpClient } from "@/utils";

const deleteholiday = async (id, token) => {
  const response = await httpClient.put(
    `/holidays/deleteholiday/${id}`,
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

export default deleteholiday;
