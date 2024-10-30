import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

// Define a TypeScript interface for the Admin model
interface IAdmin extends Document {
  username: string;
  password: string;

  // Method to compare entered password with hashed password
  matchPassword(enteredPassword: string): Promise<boolean>;
}

// Define the Mongoose schema
const AdminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Method to hash password before saving
AdminSchema.pre<IAdmin>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
AdminSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model and interface
const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
export { Admin, IAdmin };
