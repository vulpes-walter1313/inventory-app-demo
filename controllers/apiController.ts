import { type Request, type Response, type NextFunction } from "express";
import { body, matchedData, validationResult } from "express-validator";
import HttpError from "../lib/HttpError";
import slugify from "slugify";
const slugifyGet = [
  body("text").trim().notEmpty(),
  (req: Request, res: Response, next: NextFunction) => {
    const valResult = validationResult(req);
    if (!valResult.isEmpty()) {
      res.status(200).json({ success: false, message: "Validation is wrong" });
      return;
    }
    const { text } = matchedData(req);
    const slug = slugify(text, { lower: true, strict: true});
    console.log(`sending back ${slug}`);
    res.json({ success: true, slug: slug });
  },
];

export default {
  slugifyGet,
};
