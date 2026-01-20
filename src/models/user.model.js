// Import mongoose to work with MongoDB
// Schema is used to define the structure of our data
import mongoose, { Schema } from "mongoose";

// bcrypt is used to hash (encrypt) passwords
import bcrypt from "bcrypt";

// jsonwebtoken is used to create login tokens (JWT)
import jwt from "jsonwebtoken";

// Create a schema (blueprint) for User data
const userSchema = new Schema(
  {
    // username field
    username: {
      type: String,          // data type
      required: true,        // must be provided
      unique: true,          // no duplicate usernames
      lowercase: true,       // convert to lowercase
      trim: true,            // remove extra spaces
      index: true,           // faster search in DB
    },

    // email field
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // full name of the user
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // profile picture URL (stored on cloudinary)
    avatar: {
      type: String,
      required: true,
    },

    // optional cover image URL
    coverImage: {
      type: String,
    },

    // list of watched videos (stores video IDs)
    watchHistory: [
      {
        type: Schema.Types.ObjectId, // MongoDB ObjectId
        ref: "Video",                // reference to Video collection
      },
    ],

    // password (will be encrypted before saving)
    password: {
      type: String,
      required: [true, "password is required"],
    },

    // refresh token used for re-login without password
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// This runs BEFORE saving user to database
// Used to encrypt password
userSchema.pre("save", async function (next) {

  // If password is NOT changed, skip encryption
  if (!this.isModified("password")) return next();
  // Encrypt password using bcrypt
   this.password = await bcrypt.hash(this.password, 10);

  next(); // move to next middleware
});

// Custom method to check if password is correct during login
userSchema.methods.isPasswordCorrect = async function (password) {
  // compare entered password with hashed password
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token (short-lived token)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET, // secret key
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // token expiry time
    }
  );
};

// Method to generate refresh token (long-lived token)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign (
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, // secret key
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

// Create User model using schema
export const User = mongoose.model("User", userSchema);
