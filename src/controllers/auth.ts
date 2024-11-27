import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import axios from "axios";  // Import axios to make HTTP requests
import tokenHandler from "../utils/handleToken"; 
import { handleValidation } from "../utils/handleValidation"; 
import { Admin } from "../model/adminModel";

const authController: any = {};

// Facebook App ID and Secret (store these in environment variables for security)
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "834398233245197";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "a1a0d4fc4e1f92c73251c82dfa456a63";

// Function to verify the Facebook access token
const verifyFacebookToken = async (token: string) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error verifying Facebook token:", error);
    throw new Error("Invalid Facebook token");
  }
};

// Registration Logic
authController.register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { username, password, facebookToken } = req.body;

    try {
      if (facebookToken) {
        const fbTokenData = await verifyFacebookToken(facebookToken);
        if (!fbTokenData.is_valid) {
          res.status(400).json({ message: "Invalid Facebook token" });
          return; // Exit early here
        }

        const facebookUserData = await axios.get(
          `https://graph.facebook.com/me?access_token=${facebookToken}`
        );
        console.log(facebookUserData.data);
      }

      const errors: ValidationError[] = await handleValidation(
        new Admin(),
        req.body,
        res
      );
      if (errors.length > 0) {
        return;
      }

      const userExists = await Admin.findOne({
        username: (username || "").trim().toLowerCase(),
      });
      if (userExists) {
        res.status(422).json({
          status: "failed",
          errors: [
            {
              field: "username",
              message: "Username already taken",
            },
          ],
        });
        return; // Exit early here
      }

      const newAdmin = new Admin({
        username: (username || "").trim().toLowerCase(),
        password,
      });

      await newAdmin.save();

      const accessToken = tokenHandler.generateToken(
        { id: newAdmin._id, username: newAdmin.username },
        "30d"
      );

      res.status(201).json({
        status: "success",
        message: "Registration successful",
        data: {
          accessToken,
          user: {
            id: newAdmin._id,
            username: newAdmin.username,
          },
        },
      });
    } catch (error: any) {
      console.error("Error during admin registration: ", error);
      next(error); // No return here, just call next to propagate the error
    }
  }
);

authController.login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, facebookToken } = req.body;

  try {
    if (facebookToken) {
      const fbTokenData = await verifyFacebookToken(facebookToken);
      if (!fbTokenData.is_valid) {
        res.status(400).json({ message: "Invalid Facebook token" });
        return; // Exit early here
      }

      const facebookUserData = await axios.get(
        `https://graph.facebook.com/me?access_token=${facebookToken}`
      );
      console.log(facebookUserData.data);
    }

    const errors: ValidationError[] = await handleValidation(
      new Admin(),
      req.body,
      res
    );
    if (errors.length > 0) {
      return;
    }

    const admin = await Admin.findOne({
      username: username.trim().toLowerCase(),
    });
    if (!admin) {
      res.status(401).json({
        errors: [
          {
            field: "username",
            message: "Admin does not exist",
          },
        ],
      });
      return; // Exit early here
    }

    const validPassword = await admin.matchPassword(password.trim());
    if (!validPassword) {
      res.status(401).json({
        errors: [
          {
            field: "password",
            message: "Invalid password",
          },
        ],
      });
      return; // Exit early here
    }

    const accessToken = tokenHandler.generateToken(
      {
        id: admin._id,
        username: admin.username,
      },
      "1d"
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: admin._id,
          username: admin.username,
        },
      },
    });
  } catch (error: any) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      errors: [
        {
          message: "Server error. Please try again later.",
        },
      ],
    });
  }
});

export default authController;
