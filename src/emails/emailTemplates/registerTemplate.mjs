export const registerTemplate = (name, email, password) => {
  return `
    Hello ${name},

    Your account has been created.

    Email: ${email}
    Password: ${password}

    Please log in and change your password.

    Best Regards,
    Admin Team
  `;
};
