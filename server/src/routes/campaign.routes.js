import express from "express";
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,

} from "../controllers/campaign.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { createCampaignValidation } from "../validators/campaign.validator.js";
import upload from "../middlewares/upload.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
const router = express.Router();

router.post(
    "/add",
    isAuthenticated,
    authorizeRoles("creator"),
    upload.single("coverImage"),
    createCampaignValidation,
    validate,
    createCampaign
);

router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.put(
    "/:id",
    isAuthenticated,
    createCampaignValidation,
    validate,
    updateCampaign
);
router.delete("/:id", isAuthenticated, deleteCampaign);

export default router;