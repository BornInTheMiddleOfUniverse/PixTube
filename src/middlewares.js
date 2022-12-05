import morgan from "morgan";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: "ap-northeast-2",
  },
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteTitle = "PixTube";
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

export const logger = morgan("dev");

export const loggedInOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Please Login first.");
    return res.redirect("/user/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const profilePicUpload = multer({
//   dest: "uploads/profile_pic/",
  storage: multerS3({
    s3,
    bucket: "pixtube/avatar",
    acl: "public-read",
  }),
});

export const videoUpload = multer({
//   dest: "uploads/videos/",
  storage: multerS3({
    s3,
    bucket: "pixtube/videos",
    acl: "public-read",
  }),
});
