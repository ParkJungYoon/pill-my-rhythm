import { Router } from "express";
import { UserController } from "../controllers/userController";
import { check } from "express-validator";
import { validatorErrorChecker } from "../middlewares/validator";
import { verifyToken } from "../middlewares/verifyToken";
import { verifyRefresh } from "../middlewares/verifyRefreshToken";

const UserRouter = Router();

// 회원가입
UserRouter.post(
  "/register",
  [
    check("user_name").exists(),
    check("email").exists().isEmail(),
    check("password").exists().isLength({ min: 8, max: 12 }),
    validatorErrorChecker,
  ],
  UserController.register,
);

// 로그인
UserRouter.post(
  "/login",
  [check("email").exists().isEmail(), check("password").exists().isLength({ min: 8, max: 12 }), validatorErrorChecker],
  UserController.login,
);

// 로그아웃
UserRouter.delete("/logout", verifyToken, UserController.logout);

// 회원 정보 수정
UserRouter.put("/update-info", verifyToken, UserController.updateInfo);

// 회원 탈퇴
UserRouter.delete("/withdrawal", verifyToken, UserController.withdrawal);

// 현재 회원 정보 조회
UserRouter.get("/current", verifyToken, UserController.currentUserInfo);

// 현재 회원 데이터 분석 추천 영양제
UserRouter.get("/analysis-supplement", verifyToken, UserController.userAnalysisSupplement);

// token 재발급
UserRouter.post("/refresh", verifyRefresh);

export { UserRouter };
