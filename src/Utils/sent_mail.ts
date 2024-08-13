import nodemailer from "nodemailer";

export const sentInvitationEmail = async (email: string, token: string) => {
  try {
    const mailerConfig = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    };
    const transporter = nodemailer.createTransport(mailerConfig);
    const mailOptions = {
      from: "IMS <shrestharishav3@gmail.com>",
      to: email,
      subject: "Invitation to register",
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #333;">Welcome to UBA-IMS!</h1>
      <p style="font-size: 16px; color: #555;">
        You have been invited to join our platform. To complete your registration, please click the link below:
      </p>
      "http://localhost:5173/register/user?token=${token}" 
         
      <p style="font-size: 14px; color: #777; margin-top: 20px;">
        If you did not request this, please ignore this email.
      </p>
    </div>`,
    };
    // console.log(transporter);
    const info = await transporter.sendMail(mailOptions);

    // console.log(process.env.email,process.env.password);
  } catch (error) {
    console.error(error);
  }
};
