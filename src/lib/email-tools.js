import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_KEY);

export const sendRegistrationEmail = async (recipientAddress) => {
  const msg = {
    to: recipientAddress,
    from: process.env.SENDER_EMAIL,
    subject: "Hey There! you've sent an email!!!",
    text: "Wowza!!!",
    html: "<strong>I can't believe it's not butter</strong>",
  };
  await sgMail.send(msg);
};
