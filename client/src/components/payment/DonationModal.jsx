import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import CommonTextField from "../common/CommonTextField";
import CommonButton from "../common/CommonButton";
import {
  createOrderThunk,
  markPaymentFailedThunk,
  verifyPaymentThunk,
} from "../../redux/paymentSlice";

const quickAmounts = [500, 1000, 2500, 5000];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const getCampaignTitle = (campaign) => {
  return campaign?.title || campaign?.campaignTitle || "Campaign";
};

const DonationModal = ({ open, onClose, campaign, onSuccess }) => {
  const dispatch = useDispatch();

  const { actionLoading } = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      message: "",
    },
  });

  const handleClose = () => {
    if (actionLoading) return;
    reset();
    onClose();
  };

  const handleQuickAmount = (amount) => {
    setValue("amount", amount, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (formValues) => {
    try {
      const campaignId = campaign?.id || campaign?._id;

      if (!campaignId) {
        toast.error("Campaign is not available.");
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();

      if (!isScriptLoaded) {
        toast.error("Unable to load Razorpay. Please try again.");
        return;
      }

      const orderResponse = await toast.promise(
        dispatch(
          createOrderThunk({
            campaignId,
            amount: Number(formValues.amount),
            message: formValues.message,
          })
        ).unwrap(),
        {
          loading: "Creating payment order...",
          success: (response) =>
            response?.message || "Payment order created.",
          error: (error) =>
            error?.message ||
            error?.data?.message ||
            error ||
            "Failed to create payment order.",
        }
      );

      const order = orderResponse?.data || orderResponse;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Number(order.amount) * 100,
        currency: order.currency || "INR",
        name: "CrowdFund",
        description: getCampaignTitle(campaign),
        order_id: order.orderId,
        prefill: {
          name: [user?.firstName, user?.lastName].filter(Boolean).join(" "),
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#16a34a",
        },
        handler: async (response) => {
          await toast.promise(
            dispatch(
              verifyPaymentThunk({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap(),
            {
              loading: "Verifying payment...",
              success: (verifyResponse) =>
                verifyResponse?.message || "Donation successful.",
              error: (error) =>
                error?.message ||
                error?.data?.message ||
                error ||
                "Payment verification failed.",
            }
          );

          reset();
          onClose();

          if (onSuccess) {
            onSuccess();
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", async (response) => {
        const failurePayload = {
          razorpay_order_id: order.orderId,
          razorpay_payment_id: response?.error?.metadata?.payment_id,
          error: response?.error?.description || "Payment failed",
        };

        await dispatch(markPaymentFailedThunk(failurePayload));

        toast.error(response?.error?.description || "Payment failed.");
      });

      razorpay.open();
    } catch {
      // toast.promise handles visible error messages
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={900}>
              Support this campaign
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Your donation helps this campaign move closer to its goal.
            </Typography>
          </Box>

          <IconButton onClick={handleClose} disabled={actionLoading}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "#f0fdf4",
                border: "1px solid #bbf7d0",
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 2,
                    bgcolor: "#dcfce7",
                    color: "#16a34a",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <FavoriteIcon />
                </Box>

                <Box>
                  <Typography fontWeight={900}>
                    {getCampaignTitle(campaign)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Secure payment powered by Razorpay
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Typography fontWeight={900} sx={{ mb: 1 }}>
                Choose amount
              </Typography>

              <Grid container spacing={1}>
                {quickAmounts.map((amount) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={amount}>
                    <Button
                      fullWidth
                      type="button"
                      variant="outlined"
                      onClick={() => handleQuickAmount(amount)}
                      sx={{
                        borderColor: "#bbf7d0",
                        color: "#15803d",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 900,
                        "&:hover": {
                          borderColor: "#16a34a",
                          bgcolor: "#f0fdf4",
                        },
                      }}
                    >
                      ₹{amount.toLocaleString("en-IN")}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <CommonTextField
              label="Donation Amount"
              type="number"
              size="small"
              error={!!errors.amount}
              helperText={errors.amount?.message}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              {...register("amount", {
                required: "Donation amount is required",
                min: {
                  value: 1,
                  message: "Donation amount must be greater than 0",
                },
              })}
            />

            <CommonTextField
              label="Message for creator (optional)"
              multiline
              rows={3}
              size="small"
              error={!!errors.message}
              helperText={errors.message?.message}
              {...register("message", {
                maxLength: {
                  value: 250,
                  message: "Message must be less than 250 characters",
                },
              })}
            />

            <Divider />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 1.5,
              }}
            >
              <Chip
                label="100% secure checkout"
                sx={{
                  bgcolor: "#dcfce7",
                  color: "#15803d",
                  fontWeight: 800,
                  width: "fit-content",
                }}
              />

              <CommonButton
                type="submit"
                loading={actionLoading}
                size="medium"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  px: 3,
                  py: 1,
                }}
              >
                Continue to Pay
              </CommonButton>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;