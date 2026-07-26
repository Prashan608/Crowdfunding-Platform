import { Button, CircularProgress } from "@mui/material";

const CommonButton = ({
  children,
  type = "button",
  variant = "contained",
  color = "primary",
  size = "large",
  fullWidth = true,
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  onClick,
  sx = {},
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        py: 1.3,
        fontWeight: 600,
        ...sx,
      }}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </Button>
  );
};

export default CommonButton;