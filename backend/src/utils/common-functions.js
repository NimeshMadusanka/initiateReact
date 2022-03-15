const sgMail = require('@sendgrid/mail');
// var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
// var authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require("twilio")(accountSid, authToken);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (to, templateId, dynamicTemplateData, cc) => new Promise((resolve, reject) => {
  try {
    const msg = {
      to,
      from: {
        name: 'Preassessme',
        email: 'support@preassessme.com.au',
      },
      templateId,
      dynamicTemplateData,
      cc,
      hideWarnings: true,
    };

    sgMail
      .send(msg)
      .then((results) => {
        resolve();
      })
      .catch((err) => {
        reject(err.response.body);
      });
    // resolve();
  } catch (error) {
    reject();
  }
});

// const sendSms = (link, mobile, firstName, advisorName, adviceFirm) =>
//   new Promise((resolve, reject) => {
//     try {
//
//       client.messages
//         .create({
//           body: `Hi ${firstName},\n ${advisorName} from ${adviceFirm} has asked you to complete the following questionnaire please click the link.\n  ${link}\n Thanks in advance!`,
//           from: "PreAssessMe",
//           to: mobile,
//         })
//         .then((message) => {
//
//           resolve();
//         })
//         .catch((err) => {
//
//           reject();
//         });
//     } catch (error) {
//       reject(console.log("catch error ", error));
//     }
//   });

const joiErrorFormatter = (RawErrors) => {
  const errors = {};
  const Details = RawErrors.details;

  Details.map((detail) => {
    errors[detail.path] = [detail.message];
  });
  return errors;
};

const validateInput = (schema, data) => {
  const validInput = schema(data, { abortEarly: false });

  if (validInput.error) {
    return joiErrorFormatter(validInput.error);
  }
  return validInput;
};

module.exports = { sendMail, validateInput };
