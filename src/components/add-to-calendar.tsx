import { FC } from "react";
import { atcb_action } from "add-to-calendar-button";
import "add-to-calendar-button/assets/css/atcb.css";
import Button from "./button";
import { useRecoilValue } from "recoil";
import { appInfoState } from "../state/settings";
import { getSystemInfo, openOutApp } from "zmp-sdk";
import config from "../config";

export const AddToCalendar: FC = () => {
  const appInfo = useRecoilValue(appInfoState);
  return (
    <Button
      className="min-w-0 flex-1"
      onClick={(e) => {
        if (getSystemInfo().platform.toLowerCase() === "ios") {
          return openOutApp({
            url: config.ICS_URL,
          });
        }
        const url = appInfo.appUrl;
        const now = new Date();
        atcb_action(
          {
            name: "Keep calm and study GMAT",
            description:
              "Add this recurring event to your calendar and set alarm for it\nThêm cái này vào lịch của bạn và nhớ đặt báo thức hằng ngày",
            location: url,
            startDate: `${now.getFullYear()}-${
              now.getMonth() + 1
            }-${now.getDate()}`,
            startTime: `19:00`,
            endTime: `21:00`,
            timeZone: "Asia/Ho_Chi_Minh",
            recurrence: "RRULE:FREQ=DAILY;INTERVAL=1;WKST=MO;COUNT=30",
            options: ["Google", "Outlook.com"],
            trigger: "click",
          },
          e.currentTarget
        );
      }}
    >
      ⏰
    </Button>
  );
};
