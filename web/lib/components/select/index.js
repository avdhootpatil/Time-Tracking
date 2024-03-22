"use client";

import ClearIcon from "@mui/icons-material/Clear";
import { Autocomplete } from "@mui/joy";
import { useEffect, useState } from "react";

function Select({
  value = null,
  onSelect = null,
  options = [],
  label = "",
  disabled = false,
  isError = false,
  nameProperty = "name",
  valueProperty = "value",
  sx = null,
  isDefaultSelect = false,
  placeholder = "Select an option",
  isRequired = false,
  isClearable = false,
  isMulti = false,
  callback = null,
}) {
  const [data, setData] = useState([]);
  const [selectedValue, setSelectedValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    (async () => {
      let currentValue = null;
      let selectOptions = [];

      if (callback !== null) {
        let response = await callback(params);
        if (response.status === "success") {
          selectOptions = response.data;
        }
      } else {
        selectOptions = options;
      }

      if (value !== null && value !== undefined) {
        currentValue = selectOptions.find(
          (option) => option[valueProperty] === value[valueProperty]
        );
      }

      if (currentValue) {
        setSelectedValue(currentValue);
      }

      setData(selectOptions);
    })();
  }, [value, options]);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    if (typeof onSelect === "function") onSelect(newValue);
    setSelectedValue(newValue);
  };

  return (
    <div>
      <label
        htmlFor="first-name"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <Autocomplete
          error={isError}
          clearIcon={<ClearIcon fontSize="small" />}
          value={selectedValue}
          onChange={handleChange}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          inputValue={inputValue}
          isOptionEqualToValue={(option, value) =>
            option[nameProperty] === value[nameProperty]
          }
          disabled={disabled}
          getOptionLabel={(option) => option?.[nameProperty]?.toString() || ""}
          options={data}
          multiple={isMulti}
          disableClearable={!isClearable}
          size="sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default Select;
