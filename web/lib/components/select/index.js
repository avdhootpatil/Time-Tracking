"use client";

import { Autocomplete } from "@mui/joy";
import { useEffect, useState } from "react";
import TextField from "../TextField";
import ClearIcon from "@mui/icons-material/Clear";

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
  }, [value]);

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
          clearIcon={isClearable ? <ClearIcon fontSize="small" /> : null}
          value={selectedValue}
          onChange={handleChange}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          inputValue={inputValue}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          disabled={disabled}
          getOptionLabel={(option) => option?.[nameProperty] || ""}
          options={data}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              placeholder={placeholder}
              sx={{ margin: "0px !important", ...sx }}
            />
          )}
          multiple={isMulti}
        />
      </div>
    </div>
  );
}

export default Select;
