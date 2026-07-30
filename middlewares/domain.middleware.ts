import { NextFunction, Request, Response } from "express";
export const checkDomain = (req: Request, res: Response, next: NextFunction) => {
  const allowDomain = process.env.ALLOWDOMAIN
  const referer = req.headers.referer
  if(referer !== allowDomain){
    res.send("Truy cập không hợp lệ!");
    return;
  }
  next();
}