import { TextField } from "@mui/material";
import { forwardRef } from "react";

const CommonTextField = forwardRef(
  (
    {
      name,
      label,
      type = "text",
      placeholder,
      error = false,
      helperText = "",
      disabled = false,
      required = false,
      fullWidth = true,
      multiline = false,
      rows = 1,
      size = "medium",
      variant = "outlined",
      InputLabelProps,
      ...rest
    },
    ref
  ) => {
    // value/onChange/onBlur are NOT destructured separately anymore —
    // they flow through via `rest`, whether they come from a plain
    // controlled `value`/`onChange` pair or from react-hook-form's
    // `register()` spread (which only provides onChange/onBlur/name/ref,
    // no `value`, since it's uncontrolled).
    //
    // Previously, explicitly destructuring `value` and re-passing it as
    // `value={value}` meant that for register()-based (uncontrolled)
    // fields, `value` was always `undefined`. That made MUI's TextField
    // think the field was permanently empty, so the label never shrank
    // even after the user typed something.
    const hasValue =
      rest.value !== undefined && rest.value !== null && rest.value !== "";

    return (
      <TextField
        inputRef={ref}
        name={name}
        label={label}
        type={type}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        multiline={multiline}
        rows={rows}
        size={size}
        variant={variant}
        InputLabelProps={{
          // number inputs (and any field with adornments like ₹) are
          // prone to label/placeholder overlap, so always shrink them.
          // For other types, shrink once we can detect a controlled value.
          ...(type === "number" || hasValue ? { shrink: true } : {}),
          ...InputLabelProps,
        }}
        {...rest}
      />
    );
  }
);

CommonTextField.displayName = "CommonTextField";

export default CommonTextField;

// import { TextField } from "@mui/material";
// import { forwardRef } from "react";

// const CommonTextField = forwardRef(
//   (
//     {
//       name,
//       label,
//       type = "text",
//       placeholder,
//       value,
//       onChange,
//       onBlur,
//       error = false,
//       helperText = "",
//       disabled = false,
//       required = false,
//       fullWidth = true,
//       multiline = false,
//       rows = 1,
//       size = "medium",
//       variant = "outlined",
//       ...rest
//     },
//     ref
//   ) => {
//     return (
//       <TextField
//         inputRef={ref}
//         name={name}
//         label={label}
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         error={error}
//         helperText={helperText}
//         disabled={disabled}
//         required={required}
//         fullWidth={fullWidth}
//         multiline={multiline}
//         rows={rows}
//         size={size}
//         variant={variant}
//         {...rest}
//       />
//     );
//   }
// );

// CommonTextField.displayName = "CommonTextField";

// export default CommonTextField;