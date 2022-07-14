import { Router } from "express";
import { SubscribeController } from "../controllers/subscribeController";
import { check } from "express-validator";
import { validatorErrorChecker } from "../middlewares/validator";
import { verifyToken } from "../middlewares/verifyToken";

const SubscribeRouter = Router();

// 알림 서비스 구독
SubscribeRouter.post(
  "/create",
  // [check("device_token").exists().isJSON(), validatorErrorChecker],
  verifyToken,
  [check("device_token").exists(), validatorErrorChecker],
  SubscribeController.subscribeNotification,
);

// 구독 여부 확인
SubscribeRouter.get("/info", verifyToken, SubscribeController.getSubscription);

// 사용자별 푸시 알림 테스트
SubscribeRouter.get("/push-test", verifyToken, SubscribeController.pushNotification);

// 알림 서비스 구독 취소
SubscribeRouter.post(
  "/delete",
  // [check("device_token").exists().isJSON(), validatorErrorChecker],
  verifyToken,
  [check("device_token").exists(), validatorErrorChecker],
  SubscribeController.unsubscribe,
);

export { SubscribeRouter };
