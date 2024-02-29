import { FormHelperText, Input } from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { FormControl } from "@mui/material";

export default function OutlinedInput({
  label = "",
  value = null,
  onChange = () => {},
  isError = false,
  placeholder = "",
  error = "",
  type = "text",
}) {
  return (
    <>
      <label
        htmlFor="first-name"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Input
          value={value}
          onChange={onChange}
          error={isError}
          placeholder={placeholder}
          type={type}
          size="sm"
        />
      </div>
      {error?.length ? (
        <FormControl error={true}>
          <FormHelperText className="py-3">
            <InfoOutlined />
            {error}
          </FormHelperText>
        </FormControl>
      ) : null}
    </>
  );
}
