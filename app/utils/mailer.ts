import nodemailer from "nodemailer";

export async function sendEmail({ to, text }: { to: string; text: string }) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  //send email
  let info = await transporter.sendMail({
    from: "Syntax <example@syntax.fm>",
    to,
    subject: "Potluck Message",
    text,
  });
  console.log("Message sent:", nodemailer.getTestMessageUrl(info));
  return "success";
}
