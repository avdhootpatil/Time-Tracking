export default function Result(status, data, errors, validationErrors) {
  return {
    status: status,
    data: data,
    errors: errors,
    validationErrors: validationErrors,
  };
}

Result.success = function (data) {
  return new Result("success", data, undefined, undefined);
};

Result.error = function (errors) {
  return new Result("error", undefined, errors, undefined);
};

Result.invalid = function (validationErrors, errors) {
  return new Result("invalid", undefined, errors, validationErrors);
};

Result.notFound = function (errors) {
  return new Result("notFound", undefined, errors, undefined);
};

Result.internalServerError = function (errors) {
  return new Result("serverError", undefined, errors, undefined);
};

Result.unauthorized = function (errors) {
  return new Result("unauthorized", undefined, errors, undefined);
};

Result.noResponse = function (errors) {
  return new Result("noResponse", undefined, errors, undefined);
};

Result.forbidden = function (errors) {
  return new Result("forbidden", undefined, errors, undefined);
};

Result.conflict = function (errors) {
  return new Result("conflict", undefined, errors, undefined);
};
