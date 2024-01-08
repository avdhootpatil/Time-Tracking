import Result from "./result";

export default function handleApiError(e) {
  if (e) {
    switch (e.status) {
      case 401:
        // unAuthorized
        return Result.unauthorized(e.errors.message);
      case 403:
        // Forbidden
        return Result.forbidden([
          "You don’t have permission to access this service.",
        ]);
      case 400:
        // Bad_request
        return Result.invalid(e.errors, ["Invalid Request."]);
      case 404:
        return Result.notFound(e.errors.message);
      case 409:
        return Result.conflict([e.errors.message]);
      case 500:
        // Internal_Server_Error
        return Result.internalServerError([e.statusText]);
      default:
        return Result.error([e.message]);
    }
  } else if (e.request) {
    return Result.noResponse(["Unable to connect to the server"]);
  } else {
    return Result.error([
      "Unable to make a request, please check your connection.",
    ]);
  }
}
