import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASSWORD,
  },
});

const sendEmail = async (recipientEmail, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: subject,
    text: text,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    // console.log('trasnporterrrrr...........', response);
    console.log(`Email sent to: ${recipientEmail}`);
    return { status: true, message: `Email sent to: ${recipientEmail}` };
  } catch (error) {
    console.error(`Error sending email to ${recipientEmail}:`, error);
    return { status: false, message: error };
  }
};

export default sendEmail;
