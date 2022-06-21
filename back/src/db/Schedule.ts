import { Op, col } from "./models";
import { Users } from "./models/user";
import { DailySupplements } from "./models/dailySupplement";
import { Schedules } from "./models/schedule";
import { IScheduleCreateInput } from "../interfaces/scheduleInput";
import { where } from "sequelize/types";
import { Supplements } from "./models/supplement";

const Schedule = {
  findByWeek: async (fk_user_id: string, start: Date, finish: Date) => {
    const schedule = await Schedules.findAll({
      where: { start: { [Op.between]: [start, finish] } },
      include: { model: Users, attributes: [], where: { pk_user_id: fk_user_id } },
      order: [["start", "ASC"]],
    });
    return schedule;
  },

  createSchedule: async (newScheduleData: IScheduleCreateInput) => {
    const schedule = await Schedules.create(newScheduleData);
    return schedule;
  },

  findByTime: async (fk_user_id: string, start: Date, finish: Date) => {
    const schedule = await Schedules.findOne({
      where: { [Op.or]: [{ start: { [Op.between]: [start, finish] }, finish: { [Op.between]: [start, finish] } }] },
      include: { model: Users, where: { pk_user_id: fk_user_id } },
    });
    return schedule;
  },

  findByOnlyTime: async (time: Date) => {
    const supplementSchedules = await Schedules.findAll({
      include: {
        all: true,
        nested: true,
        attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
      },
    });
    const supplementSchedulesData = supplementSchedules.map((element) => element.get({ plain: true }));
    return supplementSchedulesData;
  },
};

export { Schedule };
