import { Textarea } from "@mui/joy";
import PropTypes from "prop-types";

export default function TextField({
  label = "",
  value = null,
  onChange = () => {},
  isError = false,
  placeholder = "",
  error = "",
  type = "text",
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
          type={type}
          size="sm"
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-600">{note}</p>
    </>
  );
}

TextField.defaulProps = {
  label: "",
  note: "",
};

TextField.propTypes = {
  label: PropTypes.string,
  note: PropTypes.string,
};
