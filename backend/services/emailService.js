const nodemailer = require("nodemailer");

const BRAND = "Bruthol";

const normalizeLocale = (locale) => (locale === "fr" ? "fr" : "en");

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

const translate = (locale, copy) => copy[normalizeLocale(locale)] || copy.en;

const wrapEmail = ({ title, bodyHtml, locale }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 24px; border-radius: 10px;">
      <h1 style="color: white; margin: 0;">${title}</h1>
    </div>
    <div style="padding: 24px; background: #f8f9fa; border-radius: 10px; margin-top: 20px;">
      ${bodyHtml}
    </div>
    <div style="text-align: center; margin-top: 20px; padding: 16px; color: #6c757d; font-size: 13px;">
      <p style="margin: 0;">${translate(locale, {
        en: "Best regards,",
        fr: "Cordialement,",
      })}</p>
      <p style="margin: 6px 0; font-weight: bold;">${BRAND}</p>
    </div>
  </div>
`;

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    to,
    from: process.env.EMAIL,
    subject,
    html,
  });
};

const buildResetPasswordRequestEmail = ({ locale, username, resetLink }) => {
  const subject = translate(locale, {
    en: "Password Reset Request",
    fr: "Demande de reinitialisation du mot de passe",
  });

  const title = subject;
  const bodyHtml = `
    <p style="font-size: 16px;">${translate(locale, {
      en: `Dear ${username},`,
      fr: `Bonjour ${username},`,
    })}</p>
    <p style="font-size: 16px;">${translate(locale, {
      en: "You have requested to reset your password.",
      fr: "Vous avez demande la reinitialisation de votre mot de passe.",
    })}</p>
    <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px;">${translate(locale, {
        en: "Click the button below to reset your password:",
        fr: "Cliquez sur le bouton ci-dessous pour reinitialiser votre mot de passe :",
      })}</p>
      <a href="${resetLink}"
         style="display: inline-block; margin-top: 15px; background: linear-gradient(to right, #ff934b, #ff5e62); color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        ${translate(locale, { en: "Reset Password", fr: "Reinitialiser le mot de passe" })}
      </a>
      <p style="margin-top: 15px; font-size: 13px;">${translate(locale, {
        en: `Or copy this link: ${resetLink}`,
        fr: `Ou copiez ce lien : ${resetLink}`,
      })}</p>
    </div>
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">${translate(locale, {
        en: "This link will expire in 1 hour for security reasons.",
        fr: "Ce lien expirera dans 1 heure pour des raisons de securite.",
      })}</p>
    </div>
    <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; color: #721c24; font-size: 14px;">
        ${translate(locale, {
          en: "If you did not request this reset, please ignore this email.",
          fr: "Si vous n'avez pas demande cette reinitialisation, veuillez ignorer cet e-mail.",
        })}
      </p>
    </div>
  `;

  return { subject, html: wrapEmail({ title, bodyHtml, locale }) };
};

const buildVerificationEmail = ({ locale, username, verificationLink }) => {
  const subject = translate(locale, {
    en: "Verify Your Email - Bruthol",
    fr: "Verifiez votre e-mail - Bruthol",
  });
  const title = translate(locale, {
    en: "Welcome to Bruthol!",
    fr: "Bienvenue sur Bruthol !",
  });
  const bodyHtml = `
    <p style="font-size: 18px; color: #333;">${translate(locale, {
      en: `Hey ${username},`,
      fr: `Bonjour ${username},`,
    })}</p>
    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      ${translate(locale, {
        en: "You're one click away from activating your account!",
        fr: "Vous etes a un clic de l'activation de votre compte !",
      })}
    </p>
    <div style="text-align: center; margin: 35px 0;">
      <a href="${verificationLink}"
         style="background: linear-gradient(to right, #ff934b, #ff5e62); color: white; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 94, 98, 0.4);">
        ${translate(locale, { en: "Verify Email Now", fr: "Verifier mon e-mail" })}
      </a>
    </div>
    <p style="font-size: 14px; color: #888;">
      ${translate(locale, {
        en: `Or copy this link: <br/><a href="${verificationLink}" style="color: #ff5e62;">${verificationLink}</a>`,
        fr: `Ou copiez ce lien : <br/><a href="${verificationLink}" style="color: #ff5e62;">${verificationLink}</a>`,
      })}
    </p>
    <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        ${translate(locale, {
          en: "This link expires in 15 minutes for security.",
          fr: "Ce lien expire dans 15 minutes pour des raisons de securite.",
        })}
      </p>
    </div>
  `;

  return { subject, html: wrapEmail({ title, bodyHtml, locale }) };
};

const buildWelcomeEmail = ({ locale, username, frontendUrl }) => {
  const subject = translate(locale, {
    en: "Welcome to Bruthol! 🎉",
    fr: "Bienvenue sur Bruthol ! 🎉",
  });
  const title = subject;
  const bodyHtml = `
    <p style="font-size: 18px; color: #333;">${translate(locale, {
      en: `Hey ${username},`,
      fr: `Bonjour ${username},`,
    })}</p>
    <p style="font-size: 16px; color: #555; line-height: 1.6;">
      ${translate(locale, {
        en: "Your email has been successfully verified and you're now logged into your Bruthol account!",
        fr: "Votre e-mail a bien ete verifie et vous etes maintenant connecte a votre compte Bruthol !",
      })}
    </p>
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
      <p style="margin: 0; color: #155724; font-size: 15px;"><strong>${translate(locale, {
        en: "What's Next?",
        fr: "Et maintenant ?",
      })}</strong></p>
      <ul style="color: #155724; margin: 10px 0; padding-left: 20px;">
        <li>${translate(locale, {
          en: "Complete your profile to get personalized recommendations",
          fr: "Completez votre profil pour recevoir des recommandations personnalisees",
        })}</li>
        <li>${translate(locale, {
          en: "Browse our products and deals",
          fr: "Decouvrez nos produits et nos offres",
        })}</li>
        <li>${translate(locale, {
          en: "Add items to your wishlist",
          fr: "Ajoutez des articles a votre liste d'envies",
        })}</li>
        <li>${translate(locale, {
          en: "Become a seller and start your business journey",
          fr: "Devenez vendeur et lancez votre activite",
        })}</li>
      </ul>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${frontendUrl}"
         style="background: linear-gradient(to right, #ff934b, #ff5e62); color: white; padding: 16px 36px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
        ${translate(locale, { en: "Start Shopping", fr: "Commencer mes achats" })}
      </a>
    </div>
  `;

  return { subject, html: wrapEmail({ title, bodyHtml, locale }) };
};

const buildTempPasswordEmail = ({
  locale,
  username,
  tempPassword,
  subject,
  heading,
  intro,
  signature,
}) => {
  const title = heading;
  const bodyHtml = `
    <p style="font-size: 16px;">${translate(locale, {
      en: `Dear ${username},`,
      fr: `Bonjour ${username},`,
    })}</p>
    <p style="font-size: 16px;">${intro}</p>
    <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px;">${translate(locale, {
        en: "Your temporary password is:",
        fr: "Votre mot de passe temporaire est :",
      })}</p>
      <p style="font-family: monospace; font-size: 20px; margin: 10px 0; color: #ff5e62;">${tempPassword}</p>
    </div>
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; color: #856404;">${translate(locale, {
        en: "For security reasons, please change your password immediately after logging in.",
        fr: "Pour des raisons de securite, veuillez changer votre mot de passe immediatement apres connexion.",
      })}</p>
    </div>
  `;

  return {
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 20px; border-radius: 8px;">
          <h1 style="color: white; margin: 0;">${title}</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
          ${bodyHtml}
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6c757d;">
          <p style="margin: 0;">${translate(locale, { en: "Best regards,", fr: "Cordialement," })}</p>
          <p style="margin: 5px 0; font-weight: bold;">${signature}</p>
        </div>
      </div>
    `,
  };
};

const sendPasswordResetRequestEmail = async ({ to, username, resetLink, locale }) =>
  sendEmail({
    to,
    ...buildResetPasswordRequestEmail({ locale, username, resetLink }),
  });

const sendVerificationEmail = async ({ to, username, verificationLink, locale }) =>
  sendEmail({
    to,
    ...buildVerificationEmail({ locale, username, verificationLink }),
  });

const sendWelcomeEmail = async ({ to, username, frontendUrl, locale }) =>
  sendEmail({
    to,
    ...buildWelcomeEmail({ locale, username, frontendUrl }),
  });

const sendAdminPasswordResetEmail = async ({ to, username, tempPassword, locale }) =>
  sendEmail({
    to,
    ...buildTempPasswordEmail({
      locale,
      username,
      tempPassword,
      subject: translate(locale, {
        en: "Admin Password Reset",
        fr: "Reinitialisation du mot de passe administrateur",
      }),
      heading: translate(locale, {
        en: "Admin Password Reset",
        fr: "Reinitialisation du mot de passe administrateur",
      }),
      intro: translate(locale, {
        en: "Your admin account password has been reset.",
        fr: "Le mot de passe de votre compte administrateur a ete reinitialise.",
      }),
      signature: "Bruthol Admin Team",
    }),
  });

const sendAdminCreatedEmail = async ({ to, username, tempPassword, locale }) =>
  sendEmail({
    to,
    subject: translate(locale, {
      en: "Admin Account Created",
      fr: "Compte administrateur cree",
    }),
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(to right, #ff934b, #ff5e62); padding: 20px; border-radius: 8px;">
          <h1 style="color: white; margin: 0;">${translate(locale, {
            en: "Admin Account Created",
            fr: "Compte administrateur cree",
          })}</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; margin-top: 20px;">
          <p style="font-size: 16px;">${translate(locale, {
            en: "Your admin account has been created.",
            fr: "Votre compte administrateur a ete cree.",
          })}</p>
          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; font-size: 15px;">${translate(locale, {
              en: "Your credentials:",
              fr: "Vos identifiants :",
            })}</p>
            <p style="font-family: monospace; font-size: 16px; margin: 10px 0;">Username: ${username}</p>
            <p style="font-family: monospace; font-size: 16px; margin: 10px 0;">Password: ${tempPassword}</p>
          </div>
        </div>
      </div>
    `,
  });

const sendAdminTriggeredPasswordResetEmail = async ({
  to,
  username,
  tempPassword,
  locale,
  accountType = "user",
}) =>
  sendEmail({
    to,
    ...buildTempPasswordEmail({
      locale,
      username,
      tempPassword,
      subject: translate(locale, {
        en: "Password Reset by Admin",
        fr: "Reinitialisation du mot de passe par l'administrateur",
      }),
      heading: translate(locale, {
        en: "Password Reset",
        fr: "Reinitialisation du mot de passe",
      }),
      intro: translate(locale, {
        en:
          accountType === "seller"
            ? "Your seller account password has been reset by an administrator."
            : "Your account password has been reset by an administrator.",
        fr:
          accountType === "seller"
            ? "Le mot de passe de votre compte vendeur a ete reinitialise par un administrateur."
            : "Le mot de passe de votre compte a ete reinitialise par un administrateur.",
      }),
      signature: "Bruthol Admin Team",
    }),
  });

module.exports = {
  normalizeLocale,
  sendPasswordResetRequestEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
  sendAdminPasswordResetEmail,
  sendAdminCreatedEmail,
  sendAdminTriggeredPasswordResetEmail,
};
