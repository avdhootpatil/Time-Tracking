import * as React from "react";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import {
  CssVarsProvider,
  THEME_ID,
  extendTheme as extendJoyTheme,
  useColorScheme,
} from "@mui/joy/styles";
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  useColorScheme as useMaterialColorScheme,
  useTheme as useMaterialTheme,
} from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { unstable_useDateField as useDateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useClearableField } from "@mui/x-date-pickers/hooks";

const joyTheme = extendJoyTheme();

const JoyField = React.forwardRef((props, ref) => {
  const {
    disabled,
    id,
    label,
    InputProps: { ref: containerRef, startAdornment, endAdornment } = {},
    formControlSx,
    endDecorator,
    startDecorator,
    slotProps,
    ...other
  } = props;

  return (
    <FormControl
      disabled={disabled}
      id={id}
      sx={[...(Array.isArray(formControlSx) ? formControlSx : [formControlSx])]}
      ref={ref}
    >
      <FormLabel>{label}</FormLabel>
      <Input
        ref={ref}
        disabled={disabled}
        startDecorator={
          <React.Fragment>
            {startAdornment}
            {startDecorator}
          </React.Fragment>
        }
        endDecorator={
          <React.Fragment>
            {endAdornment}
            {endDecorator}
          </React.Fragment>
        }
        slotProps={{
          ...slotProps,
          root: { ...slotProps?.root, ref: containerRef },
        }}
        {...other}
        size="sm"
      />
    </FormControl>
  );
});

const JoyDateField = React.forwardRef((props, ref) => {
  const {
    inputRef: externalInputRef,
    slots,
    slotProps,
    ...textFieldProps
  } = props;

  const {
    onClear,
    clearable,
    ref: inputRef,
    ...fieldProps
  } = useDateField({
    props: textFieldProps,
    inputRef: externalInputRef,
  });

  /* If you don't need a clear button, you can skip the use of this hook */
  const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } =
    useClearableField({
      onClear,
      clearable,
      fieldProps,
      InputProps: fieldProps.InputProps,
      slots,
      slotProps,
    });

  return (
    <JoyField
      ref={ref}
      slotProps={{
        input: {
          ref: inputRef,
        },
      }}
      {...processedFieldProps}
      InputProps={ProcessedInputProps}
    />
  );
});

const JoyDatePicker = React.forwardRef((props, ref) => {
  return (
    <DatePicker
      ref={ref}
      {...props}
      slots={{ field: JoyDateField, ...props.slots }}
      slotProps={{
        ...props.slotProps,
        field: {
          ...props.slotProps?.field,
          formControlSx: {
            flexDirection: "row",
          },
        },
      }}
    />
  );
});

/**
 * This component is for syncing the theme mode of this demo with the MUI docs mode.
 * You might not need this component in your project.
 */
function SyncThemeMode({ mode }) {
  const { setMode } = useColorScheme();
  const { setMode: setMaterialMode } = useMaterialColorScheme();
  React.useEffect(() => {
    setMode(mode);
    setMaterialMode(mode);
  }, [mode, setMode, setMaterialMode]);
  return null;
}

export default function PickerWithJoyField({
  value = null,
  onChange = () => {},
  minDate = null,
  maxDate = null,
  isError = false,
}) {
  const materialTheme = useMaterialTheme();
  return (
    <MaterialCssVarsProvider>
      <CssVarsProvider theme={{ [THEME_ID]: joyTheme }}>
        <SyncThemeMode mode={materialTheme.palette.mode} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <JoyDatePicker
            inputFormat="DD/MM/YYYY"
            value={value}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            error={isError}
          />
        </LocalizationProvider>
      </CssVarsProvider>
    </MaterialCssVarsProvider>
  );
}
