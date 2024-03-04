import { Textarea } from "@mui/joy";

export default function TextField({
  label = "",
  value = null,
  onChange = () => {},
  isError = false,
  placeholder = "",
  error = "",
  note = "",
}) {
  return (
    <>
      <label
        htmlFor="about"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Textarea
          minRows={3}
          value={value}
          onChange={onChange}
          error={isError}
          placeholder={placeholder}
          size="sm"
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-600">{note}</p>
    </>
  );
}
