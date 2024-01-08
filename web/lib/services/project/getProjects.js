import { Result, handleApiError, httpClient } from "@/utils";

const getProjects = async (id) => {
  const response = await httpClient.get(`/project/getprojects`);
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

export default getProjects;
