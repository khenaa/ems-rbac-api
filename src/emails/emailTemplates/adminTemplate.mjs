export const adminEmailTemplate = (email, tempPassword) => {
  return `
Hello,

Your admin account has been created.

Email: ${email}
Temporary Password: ${tempPassword}

Please log in and update your profile details.

Best Regards,
  `;
};
