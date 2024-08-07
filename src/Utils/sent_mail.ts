import nodemailer from "nodemailer";

export const sentInvitationEmail = async (email: string, token: string) => {
  try {
    const mailerConfig = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "shrestharishav3@gmail.com",
        pass: "eskjtepephstbuds",
      },
    };
    const transporter = nodemailer.createTransport(mailerConfig);
    const mailOptions = {
      from: "IMS <shrestharishav3@gmail.com>",
      to: email,
      subject: "Invitation to register",
      html: `<h1> You have been invited to register. Click the link below to complete your registration: </h1>\n\nhttp://localhost:5173//register?token=${token}`,
    };
    // console.log(transporter);
    const info = await transporter.sendMail(mailOptions);

    // console.log(process.env.email,process.env.password);
  } catch (error) {
    console.error(error);
  }
};
