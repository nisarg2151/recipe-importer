import { Request, Response, NextFunction } from "express";
import { HTTP400Error } from "../utils/httpErrors";

export const checkSearchParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.query.url) {
    throw new HTTP400Error("Missing URL parameter");
  } else {
    next();
  }
};
