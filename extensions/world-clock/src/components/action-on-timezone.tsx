import { Action, ActionPanel, getPreferenceValues, Icon, LocalStorage } from "@raycast/api";
import { TimeInfo, Timezone } from "../types/types";
import React, { Dispatch, SetStateAction } from "react";
import { localStorageKey } from "../utils/costants";
import { ActionToggleDetails } from "./action-toggle-details";
import { ActionOpenCommandPreferences } from "./action-open-command-preferences";
import { ActionTimeInfo } from "./action-time-info";
import { Preferences } from "../types/preferences";

export function ActionOnTimezone(props: {
  timeInfo: TimeInfo;
  starTimezones: Timezone[];
  timezone: string;
  setRefresh: Dispatch<SetStateAction<number>>;
  showDetail: boolean;
  setRefreshDetail: Dispatch<SetStateAction<number>>;
}) {
  const { timeInfo, starTimezones, timezone, setRefresh, showDetail, setRefreshDetail } = props;
  return (
    <ActionPanel>
      <ActionTimeInfo timeInfo={timeInfo} />
      <Action
        icon={Icon.Star}
        title={"Star Timezone"}
        shortcut={{ modifiers: ["cmd"], key: "s" }}
        onAction={async () => {
          if (!starTimezones.some((value) => value.timezone === timezone)) {
            const _starTimezones = [...starTimezones];
            _starTimezones.push({
              timezone: timezone,
              utc_offset: timeInfo.utc_offset,
              date_time: "",
              unixtime: 0,
            });
            _starTimezones.forEach((value) => {
              value.date_time = "";
              value.unixtime = 0;
            });
            await LocalStorage.setItem(localStorageKey.STAR_TIMEZONE, JSON.stringify(_starTimezones)).then(() => {
              setRefresh(Date.now());
            });
          }
        }}
      />
      {getPreferenceValues<Preferences>().itemLayout === "List" && (
        <ActionToggleDetails showDetail={showDetail} setRefresh={setRefreshDetail} />
      )}
      <ActionOpenCommandPreferences command={true} extension={true} />
    </ActionPanel>
  );
}
