import { Result, handleApiError, httpClient } from "@/utils";

const saveClient = async (id, payload, token) => {
  let response;
  if (id > 0) {
    response = await httpClient.put(`/client/updateclient/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else {
    response = await httpClient.post(`/client/addclient`, payload, {
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

export default saveClient;
