import fetch from "node-fetch";
import FormData from "form-data";
import config from "../config.json";
import { Moment } from "moment";
import querystring from "querystring";
import Groups from "./groups";
import { DeviceMeterSummary, DeviceCore } from "./types";

const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const USER_AGENT =
  "printmon/0.1.0 (scraping for Acton-Boxborough Regional High School)";

function restCall(
  endpoint: string,
  method: "GET" | "POST",
  params: {},
  cookies: string
) {
  if (method === "GET") {
    const query = querystring.stringify(params);
    return fetch(`http://laserwatch2.com/restapi/3.11.1${endpoint}?${query}`, {
      method,
      headers: {
        "User-Agent": USER_AGENT,
        Cookie: cookies,
        Accept: "application/json"
      }
    });
  } else if (method === "POST") {
    return fetch(`http://laserwatch2.com/restapi/3.11.1${endpoint}`, {
      method,
      headers: {
        "User-Agent": USER_AGENT,
        Cookie: cookies,
        Accept: "application/json"
      },
      body: JSON.stringify(params)
    });
  } else {
    throw new Error("Unimplemented!");
  }
}

/**
 * Logs into LaserWatch and gives you a class with which you can make various
 * LaserWatch API calls.
 */
export async function login(): Promise<LaserWatchFetcher> {
  const formData = new FormData();
  formData.append(
    "__VIEWSTATE",
    "/wEPDwULLTE3MzQ4MTMwMTEPFgIeE1ZhbGlkYXRlUmVxdWVzdE1vZGUCARYCZg9kFgICAQ9kFgQCBQ8PFgIeBFRleHQFBUxvZ2luZGQCBw8PFgIeB1Zpc2libGVoZGRkZUvo1nPlYwpD07k6yA6Ok5yhQVPg/HwbruivvznByw8="
  );
  formData.append("__VIEWSTATEGENERATOR", "C2EE9ABB");
  formData.append("txtuserName", config.username);
  formData.append("txtPassword", config.password);
  formData.append("cmdLogin", "Login");
  const response = await fetch("https://laserwatch2.com/login.aspx", {
    method: "POST",
    body: formData,
    redirect: "manual",
    headers: {
      "User-Agent": USER_AGENT
    }
  });

  if (response.status !== 302) {
    throw new Error(
      "Unexpected HTTP response code from server: " + (await response.text())
    );
  }

  const cookies = response.headers.get("set-cookie");
  if (cookies === null) {
    throw new Error(
      "Didn't receive proper cookies from server - backend change?"
    );
  }

  return new LaserWatchFetcher(cookies);
}

export class LaserWatchFetcher {
  constructor(private authCookies: string) { }

  async meterHistoryForGroup(
    label: string,
    group: Groups,
    start: Moment,
    end: Moment
  ): Promise<DeviceMeterSummary[]> {
    const params = {
      groupId: group,
      startDate: start.utc().format(DATETIME_FORMAT),
      endDate: end.utc().format(DATETIME_FORMAT)
    };
    // Label must be double-URL-encoded, for some reason.
    const encodedLabel = querystring.escape(querystring.escape(label));
    const res = await restCall(
      `/meters/${encodedLabel}/history`,
      "GET",
      params,
      this.authCookies
    );
    return await res.json();
  }

  async meterHistoryForDevices(
    label: string,
    deviceIds: string[],
    start: Moment,
    end: Moment
  ): Promise<DeviceMeterSummary[]> {
    const params = {
      deviceIds,
      startDate: start.utc().format(DATETIME_FORMAT),
      endDate: end.utc().format(DATETIME_FORMAT)
    };
    // Label must be double-URL-encoded, for some reason.
    const encodedLabel = querystring.escape(querystring.escape(label));
    const res = await restCall(
      `/meters/${encodedLabel}/history`,
      "POST",
      params,
      this.authCookies
    );
    return await res.json();
  }

  async devices(groupId: Groups): Promise<DeviceCore[]> {
    const params = {
      groupId,
      includeSubGroups: false
    };
    const res = await restCall("/devices", "GET", params, this.authCookies);
    return await res.json();
  }
}
