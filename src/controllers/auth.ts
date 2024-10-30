import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import tokenHandler from "../utils/handleToken"; // Assuming you
import { handleValidation } from "../utils/handleValidation"; //
import { Admin } from "../model/adminModel";

const authController: any = {};

// Registration Logic
authController.register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // #swagger.tags = ['Auth']
    const { username, password } = req.body;

    try {
      // Validate the user fields
      const errors: ValidationError[] = await handleValidation(
        new Admin(), // Validate against Admin model
        req.body,
        res
      );
      if (errors.length > 0) {
        return; // No need to return anything, just exit the function
      }

      // Check if the username is already taken
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
        return; // Exit the function after sending the response
      }

      // Create a new admin
      const newAdmin = new Admin({
        username: (username || "").trim().toLowerCase(),
        password, // Store the raw password for hashing
      });

      await newAdmin.save(); // Save the admin to the database

      // Generate access token
      const accessToken = tokenHandler.generateToken(
        { id: newAdmin._id, username: newAdmin.username },
        "30d"
      );

      // Send the success response
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
      next(error);
    }
  }
);

// Login Logic
authController.login = asyncHandler(async (req: Request, res: Response) => {
  // #swagger.tags = ['Auth']
  const { username, password } = req.body;

  try {
    // Validate the user fields
    const errors: ValidationError[] = await handleValidation(
      new Admin(), // Validate against Admin model
      req.body,
      res
    );
    if (errors.length > 0) {
      return;
    }

    // Check if the username exists
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
      return;
    }

    // Validate the password
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
      return;
    }

    // Generate a token and send it along with user details
    const accessToken = tokenHandler.generateToken(
      {
        id: admin._id,
        username: admin.username,
      },
      "1d"
    );

    // Send the success response
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
    console.error("Error during admin login:", error); // Log the error for debugging
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
