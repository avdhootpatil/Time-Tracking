import React, { useEffect } from "react";
import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
} from "@mui/material";
import "./index.css";

function TSelect({
  value = null,
  onSelect = null,
  options = [],
  label = "",
  disabled = false,
  error = false,
  nameProperty = "name",
  valueProperty = "value",
  sx = null,
  isDefaultSelect = false,
  placeholder = "Select an option",
  isRequired = false,
}) {
  useEffect(() => {
    if (isDefaultSelect && options.length > 0) {
      const defaultOption = options.find((option) => option.isDefault);
      if (defaultOption) {
        onSelect(defaultOption);
      }
    }
  }, [isDefaultSelect, options, onSelect]);

  const handleChange = (event, newValue) => {
    onSelect(newValue);
  };

  const getOptionLabel = (option) => {
    return option[nameProperty] || "";
  };

  return (
    <FormControl variant="outlined" sx={{ width: "100%", ...sx }}>
      {label?.length ? (
        <FormHelperText
          sx={{ marginLeft: "0px" }}
          className={isRequired ? "required" : ""}
        >
          {label}
        </FormHelperText>
      ) : null}
      <Autocomplete
        disablePortal
        disableClearable={true}
        options={options}
        value={value === undefined ? "" : value}
        onChange={handleChange}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) => {
          return option[valueProperty] === value[valueProperty];
        }}
        size="small"
        renderInput={(params) => (
          <TextField
            {...params}
            error={error}
            variant="outlined"
            placeholder={placeholder}
            sx={{ margin: "0px !important" }}
          />
        )}
        disabled={disabled}
        sx={{ margin: "0px !important" }}
      />
    </FormControl>
  );
}

export default TSelect;
