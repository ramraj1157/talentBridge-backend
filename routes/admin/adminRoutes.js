const express = require("express");
const {
  adminLogin,
  getAllCompanies,
  getAllDevs,
} = require("../../controllers/admin/adminConreoller");
const router = express.Router();

router.post("/adminLogin", adminLogin);
router.get("/companies", getAllCompanies);
router.get("/devs", getAllDevs);

module.exports = router;
