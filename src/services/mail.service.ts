import nodemailer from "nodemailer";

export const sendMail = (to: string, token: string) => {
	// Send Email
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		auth: {
			user: process.env.GMAIL_EMAIL,
			pass: process.env.GMAIL_PASSWORD
		}
	});
	const mailOptions = {
		from: process.env.GMAIL_EMAIL,
		to: to,
		subject: "Account Verification Token",
		text: `Your Verification Code is: ${token}`
	};

	return [transporter, mailOptions];
};
