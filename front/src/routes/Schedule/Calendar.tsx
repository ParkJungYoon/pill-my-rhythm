import { useCallback, useEffect } from "react";
import Scheduler, { AppointmentDragging, Editing } from "devextreme-react/scheduler";
import Draggable from "devextreme-react/draggable";
import ScrollView from "devextreme-react/scroll-view";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { del, get, post } from "../../Api";
import { start, end, appointmentsAtom, currentDate, dayHoursAtom, levelsAtom, supplementAtom, tasksAtom } from "../../atoms";
import TaskItem from "./TaskItem";
import "devextreme/dist/css/dx.greenmist.css";
import "./Calendar.css";
import DayItem from "./DayItem";
import CheckList from "./CheckList";
import moment, { unitOfTime } from "moment";
import Subscribe from "./Subscribe";
import useResize from "../../hooks/useResize";

export interface Appointments {
  endDate: Date;
  startDate: Date;
  text: string;
  id: number;
}

export interface Supplements {
  Supplement: { name: string };
  createdAt: string;
  deletedAt: null;
  fk_supplement_id: number;
  fk_user_id: string;
  pk_plan_id: number;
  type: string;
  updatedAt: string;
}

export interface Levels {
  date: string;
  level: string;
}

const views: Array<Object> = [{ type: "week" }];
const draggingGroupName = "appointmentsGroup";

function Calendar() {
  const tasks = useRecoilValue(tasksAtom);
  const dayHour = useRecoilValue(dayHoursAtom);
  const [appointments, setAppointments] = useRecoilState<Array<Appointments>>(appointmentsAtom);
  const [supplements, setSupplements] = useRecoilState<Array<Supplements>>(supplementAtom);
  const setLevel = useSetRecoilState<Array<Levels>>(levelsAtom);
  const widthSize = useResize(768);

  const onCurrentDateChange = useCallback((e: any) => {
    let start = moment(e)
      .startOf("isoweek" as unitOfTime.StartOf)
      .format();
    let end = moment(e).isoWeekday("Sunday").format();
    get(`schedule/week?start=${new Date(start)}&finish=${new Date(end)}`).then((res) => {
      setLevel(res.data.checklist);
      setAppointments(
        [...res.data.schedule].map((data) => {
          return { text: data.to_do, startDate: data.start, endDate: data.finish, id: data.pk_schedule_id };
        }),
      );
    });
  }, []);

  useEffect(() => {
    get(`schedule/?start=${new Date(start)}&finish=${new Date(end)}`).then((res) => {
      setLevel(res.data.checklist);
      setSupplements(res.data.dailySupplement);
      setAppointments(
        [...res.data.schedule].map((data) => {
          return { text: data.to_do, startDate: data.start, endDate: data.finish, id: data.pk_schedule_id };
        }),
      );
    });
  }, []);

  const onAppointmentAdd = useCallback(async (e: any) => {
    const index = tasks.indexOf(e.fromData);
    const dayIndex = dayHour.indexOf(e.fromData);
    if (index >= 0) {
      setAppointments((currentAppointment) => [...currentAppointment, e.itemData]);
      try {
        await post("schedule/create", {
          type: "B",
          start: new Date(e.itemData.startDate),
          finish: new Date(e.itemData.endDate),
          to_do: e.itemData.text,
        });
      } catch (error: any) {
        if (error.response.data.message) {
          alert(error.response.data.message);
        }
      }
    }

    if (dayIndex >= 0) {
      setAppointments((currentAppointment) => [...currentAppointment, e.itemData]);
      try {
        await post("schedule/create", {
          type: "S",
          start: new Date(e.itemData.startDate),
          finish: new Date(e.itemData.endDate),
          to_do: e.itemData.type,
        });
      } catch (error: any) {
        if (error.response.data.message) {
          alert(error.response.data.message);
        }
      }
    }

    await get(`schedule/?start=${new Date(start)}&finish=${new Date(end)}`).then((res) => {
      setAppointments(
        [...res.data.schedule].map((data) => {
          return { text: data.to_do, startDate: data.start, endDate: data.finish, id: data.pk_schedule_id };
        }),
      );
    });
  }, []);

  const onAppointmentDeleting = useCallback(
    async (e: any) => {
      e.cancel = true;
      const index = appointments.findIndex((appointments) => appointments.endDate === e.appointmentData.endDate);
      const appointmentsCopy = [...appointments];
      if (index >= 0) {
        appointmentsCopy.splice(index, 1);
        await del(`schedule/delete/${e.appointmentData.id}`);
        setAppointments([...appointmentsCopy]);
      }
    },
    [appointments],
  );

  const onListDragStart = useCallback((e: any) => {
    e.cancel = true;
  }, []);

  const onAppointmentFormOpening = useCallback((e: any) => {
    e.cancel = true;
  }, []);

  const renderDateCell = useCallback((data: { text: string; date: Date }) => {
    return <CheckList data={data} />;
  }, []);

  return (
    <>
      <div className="absolute z-20 top-0 inset-x-0 flex justify-center overflow-hidden pointer-events-none opacity-85">
        <div className="w-[108rem] flex-none flex justify-end">
          <img src="https://i.ibb.co/drmrGKR/tail.png" alt="" className="w-[71.75rem] flex-none max-w-none dark:hidden" />
        </div>
      </div>

      <div className="w-screen flex flex-wrap">
        <div className="hidden lg:block py-10 px-8 overflow-y-auto bg-slate-100 w-1/5 ">
          <Subscribe />
          <div className="divider" />
          <nav className="lg:leading-6 mt-7">
            <ScrollView id="scroll">
              <Draggable id="list" data="dropArea" group={draggingGroupName} onDragStart={onListDragStart}>
                <ul>
                  <div className="py-5 px-5 max-w-sm mx-auto bg-white rounded-xl">
                    {dayHour.map((task) => (
                      <DayItem task={task} key={task.text} />
                    ))}
                  </div>

                  <div className="mt-7 bg-white rounded-xl py-5 px-5">
                    {tasks.map((task) => (
                      <TaskItem task={task} key={task.text} />
                    ))}
                  </div>
                </ul>
              </Draggable>
            </ScrollView>
          </nav>
        </div>
        <div className="px-10 pt-10 w-full md:w-4/5">
          <header id="header" className="mb-10 md:flex md:items-start">
            <div className="flex-auto max-w-4xl">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200">Scheduler</h1>
              <p className="mt-4 text-base text-slate-700 dark:text-slate-400">
                왼쪽의 영양제 & 생체리듬 활동들을 드래그앤드롭으로 스케쥴러에 추가해보세요. <br />
                아침 / 점심 / 저녁 영양제 클릭시 북마크 한 영양제를 추가할 수 있고 푸시 알림을 통해
                <br /> 설정한 시간에 복용해야 할 영양제 정보를 받아보실 수 있습니다.
                <br />
                스케쥴러의 날짜 영역을 클릭하면 해당하는 날짜의 체크리스트를 작성하실 수 있습니다.
              </p>
            </div>
          </header>
          <section className="mb-16 relative">
            <Scheduler
              timeZone="Asia/Seoul"
              id="scheduler"
              dataSource={appointments}
              views={views}
              defaultCurrentDate={currentDate}
              defaultCurrentView="week"
              currentView={widthSize.isSizeSmall ? "day" : "week"}
              height={600}
              startDayHour={6}
              onAppointmentFormOpening={onAppointmentFormOpening}
              onAppointmentDeleting={onAppointmentDeleting}
              showAllDayPanel={false}
              dateCellRender={renderDateCell}
              firstDayOfWeek={1}
              onCurrentDateChange={onCurrentDateChange}
            >
              <Editing allowResizing={false} />
              <AppointmentDragging group={draggingGroupName} onAdd={onAppointmentAdd} />
            </Scheduler>
          </section>
        </div>
      </div>
    </>
  );
}

export default Calendar;
