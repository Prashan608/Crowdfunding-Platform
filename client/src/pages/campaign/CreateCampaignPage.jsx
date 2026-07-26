import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/common/PublicNavbar";
import CommonTextField from "../../components/common/CommonTextField";
import CommonButton from "../../components/common/CommonButton";
import { addCampaign } from "../../redux/campaignSlice";

const categories = [
  "Education",
  "Medical",
  "Startup",
  "Charity",
  "Animal",
  "Environment",
  "Emergency",
  "Other",
];

const CreateCampaignPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { actionLoading } = useSelector((state) => state.campaign);

  const [coverImage, setCoverImage] = useState(null);

  const previewUrl = useMemo(() => {
    if (!coverImage) return null;
    return URL.createObjectURL(coverImage);
  }, [coverImage]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      goalAmount: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  const startDate = watch("startDate");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isImage) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (!isValidSize) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    setCoverImage(file);
  };

  const onSubmit = async (data) => {
    try {
      if (!coverImage) {
        toast.error("Campaign cover image is required.");
        return;
      }

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("goalAmount", data.goalAmount);
      formData.append("category", data.category);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("coverImage", coverImage);

      await toast.promise(dispatch(addCampaign(formData)).unwrap(), {
        loading: "Creating campaign...",
        success: (response) =>
          response?.message || "Campaign created successfully.",
        error: (error) =>
          error?.message ||
          error?.data?.message ||
          error ||
          "Failed to create campaign.",
      });

      reset();
      setCoverImage(null);
      navigate("/campaigns");
    } catch {
      // toast.promise handles the error message
    }
  };

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        overflowX: "hidden",
      }}
    >
      <PublicNavbar />

      <Box
        component="section"
        sx={{
          width: "100%",
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={1.5}>
            <Chip
              label="Start Campaign"
              sx={{
                width: "fit-content",
                bgcolor: "#dcfce7",
                color: "#15803d",
                fontWeight: 900,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                maxWidth: 800,
                fontSize: { xs: "2rem", md: "3.2rem" },
                fontWeight: 900,
                letterSpacing: "-1px",
                lineHeight: 1.15,
              }}
            >
              Launch a campaign and start raising funds.
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 720,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.8,
              }}
            >
              Share your story, set a transparent goal, and receive support from
              people who believe in your cause.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
              }}
            >
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2.2}>
                  <Grid size={{ xs: 12 }}>
                    <CommonTextField
                      label="Campaign Title"
                      size="small"
                      error={!!errors.title}
                      helperText={errors.title?.message}
                      {...register("title", {
                        required: "Campaign title is required",
                        minLength: {
                          value: 5,
                          message: "Title must be at least 5 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Title must be less than 100 characters",
                        },
                      })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CommonTextField
                      select
                      label="Category"
                      size="small"
                      error={!!errors.category}
                      helperText={errors.category?.message}
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </CommonTextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CommonTextField
                      label="Goal Amount"
                      type="number"
                      size="small"
                      error={!!errors.goalAmount}
                      helperText={errors.goalAmount?.message}
                      {...register("goalAmount", {
                        required: "Goal amount is required",
                        min: {
                          value: 1,
                          message: "Goal amount must be greater than 0",
                        },
                      })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <CommonTextField
                      label="Start Date"
                      type="date"
                      size="small"
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      error={!!errors.startDate}
                      helperText={
                        errors.startDate?.message ||
                        ""
                      }
                      {...register("startDate", {
                        required: "Start date is required",
                      })}
                    />
                  </Grid>

                  {/* <Grid size={{ xs: 12, md: 6 }}>
                    <CommonTextField
                      label="End Date"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      error={!!errors.endDate}
                      helperText={errors.endDate?.message}
                      {...register("endDate", {
                        required: "End date is required",
                        validate: (value) =>
                          !startDate ||
                          new Date(value) >= new Date(startDate) ||
                          "End date must be after start date",
                      })}
                    />
                  </Grid> */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CommonTextField
                      label="End Date"
                      type="date"
                      size="small"
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                      sx={{
                        "& .MuiInputLabel-root": {
                          transform: "translate(14px, -9px) scale(0.75)",
                        },
                      }}
                      error={!!errors.endDate}
                      helperText={
                        errors.endDate?.message || ""
                      }
                      {...register("endDate", {
                        required: "End date is required",
                        validate: (value) =>
                          !startDate ||
                          new Date(value) >= new Date(startDate) ||
                          "End date must be after start date",
                      })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <CommonTextField
                      label="Campaign Description"
                      multiline
                      rows={6}
                      size="small"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                      {...register("description", {
                        required: "Campaign description is required",
                        minLength: {
                          value: 20,
                          message: "Description must be at least 20 characters",
                        },
                      })}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        width: "100%",
                        py: 1.4,
                        borderStyle: "dashed",
                        borderColor: coverImage ? "#16a34a" : "#cbd5e1",
                        color: coverImage ? "#16a34a" : "#475569",
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 800,
                        "&:hover": {
                          borderColor: "#16a34a",
                          bgcolor: "rgba(22, 163, 74, 0.06)",
                        },
                      }}
                    >
                      {coverImage ? coverImage.name : "Upload Cover Image"}
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <CommonButton
                      type="submit"
                      loading={actionLoading}
                      size="medium"
                      sx={{ py: 1.1 }}
                    >
                      Create Campaign
                    </CommonButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
                position: { md: "sticky" },
                top: { md: 96 },
              }}
            >
              <Typography variant="h6" fontWeight={900}>
                Cover Preview
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  height: 220,
                  borderRadius: 2.5,
                  overflow: "hidden",
                  bgcolor: "#f1f5f9",
                  border: "1px dashed #cbd5e1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {previewUrl ? (
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Campaign cover preview"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    Your campaign image preview will appear here.
                  </Typography>
                )}
              </Box>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, lineHeight: 1.8 }}
              >
                Use a clear, high-quality image. Campaigns with strong visuals
                usually build more trust and receive better support.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateCampaignPage;
