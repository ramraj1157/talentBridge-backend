const Developer = require("../../models/developer");
const Company = require("../../models/company");
const sendEmail = require("../../utils/sendEmail");
const crypto = require("crypto");
require("dotenv").config();

const forgotPassword = async (req, res) => {
  const { email, type } = req.body; // type can be 'developer' or 'company'
  try {
    const Model = type === "developer" ? Developer : Company;
    const user = await Model.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("Reset Token:", resetToken);
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Store hashed token in DB and set expiration (e.g., 15 minutes)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    console.log("Hashed Token:", hashedToken);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    try {
      await user.save();
      console.log(
        "User saved successfully with resetPasswordToken and resetPasswordExpires"
      );
      console.log(user);
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      return res
        .status(500)
        .json({ message: "Failed to save user", error: saveError.message });
    }

    // Send email
    await sendEmail(
      email,
      "Password Reset",
      `
      <div style="font-family: Arial, sans-serif; background-color: #f4f8fc; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 123, 255, 0.1);">
          <div style="background: linear-gradient(to right, #2563eb, #3b82f6); padding: 20px; color: #ffffff;">
            <h2 style="margin: 0;">TalentHire</h2>
          </div>
          <div style="padding: 30px;">
            <h3 style="color: #1e40af;">Reset Your Password</h3>
            <p style="font-size: 16px; color: #333;">
              We received a request to reset your password. Click the button below to proceed:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" style="background-color: #2563eb; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              This link will expire in <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.
            </p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              &copy; ${new Date().getFullYear()} TalentHire. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      `
    );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });
  }
};

module.exports = { forgotPassword };
