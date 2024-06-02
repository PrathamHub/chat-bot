import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
import { error, log } from "console";
export const createToken = (id: string, email: string, expiresIn) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export const verifyToken = async (req, res, next) => {
  const token = req.signedCookies[`${COOKIE_NAME}`];
  if (!token || token.trim === "") {
    return res.status(401).json("token not received");
  }
  //   console.log(token);
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (error, success) => {
      if (error) {
        reject(error.message);
        return res.status(401).json({ message: "Token Expired" });
      } else {
        console.log("Token verification Successfull");
        resolve();
        res.locals.jwtData = success;
        return next();
      }
    });
  });
};
