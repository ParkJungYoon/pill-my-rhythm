import { Request, Response, NextFunction } from "express";
import { SubscribeService } from "../services/subscribeService";
import { ISendNotificationInput } from "../interfaces/subscribeInput";

const SubscribeController = {
  subscribeNotification: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fk_user_id: string = req.currentUserId;
      const device_token: ISendNotificationInput = req.body.device_token;

      const subscription = await SubscribeService.createSubscription(fk_user_id, device_token);
      return subscription;
    } catch (error) {
      next(error);
    }
  },

  pushNotification: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fk_user_id: string = req.currentUserId;
      const push = await SubscribeService.sendPushNotification(fk_user_id);
      return push;
    } catch (error) {
      next(error);
    }
  },
};

export { SubscribeController };