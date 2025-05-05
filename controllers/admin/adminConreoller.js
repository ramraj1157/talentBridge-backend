require("dotenv").config();
const Company = require("../../models/company");
const Developer = require("../../models/developer");

const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email === process.env.ADMIN_MAIL && password === process.env.ADMIN_PASS) {
    return res.status(200).json({
      token: process.env.ADMIN_TOKEN,
      message: "Admin logged in successfully",
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    const count = await Company.countDocuments();
    return res.status(200).json({ count, companies });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching companies", error });
  }
};

const getAllDevs = async (req, res) => {
  try {
    const developers = await Developer.find();
    const count = await Developer.countDocuments();
    return res.status(200).json({ count, developers });
  } catch (error) {
    return res.status(500).json({ message: "Error in getting devs." });
  }
};

module.exports = {
  adminLogin,
  getAllCompanies,
  getAllDevs,
};
