import User from "../models/user.schema.js";
import JWT from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler.js";
import config from "../config/index.js";
import CustomError from "../utils/customError.js";


export const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token ||  req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        throw new CustomError("Not authorized", 400)
    }

    try {
        const decodedJwtPayload = JWT.verify(token, config.JWT_SECRET)

        req.user = await User.findById(decodedJwtPayload._id, "name email role")
        next()
    } catch (error) {
        throw new CustomError("Not authorized", 400)
    }

})


export const authorize = (...requiredRoles) => asyncHandler(async (req, res, next) => {

    if (!requiredRoles.includes(req.user.role)) {
        throw new CustomError("Not authorized", 400)
    }
    next()
})