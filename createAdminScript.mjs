import { mongoose } from './server.mjs';
import bcrypt from 'bcrypt';
import { adminEmailTemplate } from './src/emails/emailTemplates/adminTemplate.mjs';
import sendEmail from './src/emails/sendEmail.mjs';
import Admin from './src/models/adminModel.mjs';
import Role from './src/models/roleModel.mjs';
import { generatePassword } from './src/utils/util.mjs';

mongoose.connection.once('open', async () => {
  console.log(
    'MongoDB connected successfully. Running admin creation script...'
  );

  const email = 'ilenikhenajnr@gmail.com';
  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      console.log('Admin with this email already exists');
      return;
    }

    const password = generatePassword(12);
    const hashedPassword = await bcrypt.hash(password, 12);

    const role = await Role.findOne({ role_name: 'Admin' });
    if (!role) {
      console.error('Admin role not found in the database.');
      return;
    }

    // Create a new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role: role._id,
    });

    await newAdmin.save();

    // send email with login details
    const message = adminEmailTemplate(email, password);
    await sendEmail(email, 'Your Admin Account Details', message);

    console.log('Admin account created successfully.');
  } catch (error) {
    console.error('Error creating admin:', error);
  }
});
