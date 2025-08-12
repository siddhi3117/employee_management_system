import user from './models/user.js'
import bcrypt from 'bcrypt'
import connectToDatabase from './db/db.js'

const userRegister = async () => {
    connectToDatabase()
  try {
    const hashPassword = await bcrypt.hash("admin", 10)
    const newUser = new user({
      name: "Admin",
      email: "Admin@gmail.com",
      password: hashPassword,
      role: "admin"
    });
    await newUser.save()
    console.log("Admin user created successfully.");
  } catch (error) {
    console.log(error);
  }
}
userRegister();
 
