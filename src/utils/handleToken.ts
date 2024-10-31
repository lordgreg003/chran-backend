import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenHandler {
  generateToken: (
    fieldToSecure: string | object,
    duration?: string | number
  ) => string;
  decodeToken: (token: string) => string | JwtPayload;
}

const tokenHandler: TokenHandler = {
  generateToken: (fieldToSecure, duration) => {
    try {
      const secret = process.env.JWT_SECRET as string;
      if (!secret) throw new Error("JWT secret key is missing");

      // console.log("JWT Secret Key for signing:", secret);

      return jwt.sign({ fieldToSecure }, secret, {
        expiresIn: duration ? duration : "30d",
      });
    } catch (error: any) {
      throw new Error(`Error generating token: ${error.message}`);
    }
  },

  decodeToken: (token) => {
    try {
      const secret = process.env.JWT_SECRET as string;
      if (!secret) throw new Error("JWT secret key is missing");
      // console.log("JWT Secret Key for verifying:", secret);

      return jwt.verify(token, secret);
    } catch (error: any) {
      throw new Error(`Error decoding token: ${error.message}`);
    }
  },
};

export default tokenHandler;
