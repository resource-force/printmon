import fetch from "node-fetch";
import FormData from "form-data";
import config from "../../config.json";
import moment, { Moment } from "moment";
import querystring from "querystring";
import * as Groups from "./groups";

export interface PrintRecord {
  deviceId: string;
  values: {
    deviceId: string;
    count: number;
    delta: number;
    firstReportedAt: string;
    lastReportedAt: string;
  }[];
}

const defaultOptions = {
  headers: {
    "User-Agent":
      "printmon/0.1.0 (scraping for Acton-Boxborough Regional High School)"
  }
};
const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export async function login(): Promise<string> {
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
    ...defaultOptions
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

  return cookies;
}

export async function fetchUnitsOutput(
  authCookies: string,
  start: Moment,
  end: Moment
): Promise<PrintRecord[]> {
  const params = {
    groupId: Groups.HIGH_SCHOOL,
    startDate: start.format(DATETIME_FORMAT),
    endDate: end.format(DATETIME_FORMAT)
  };
  const res = await fetch(
    "https://laserwatch2.com/restapi/3.11.1/meters/Total%2520Units%2520Output/history?" +
      querystring.stringify(params),
    {
      ...defaultOptions,
      headers: {
        Cookie: authCookies,
        Accept: "application/json"
      }
    }
  );

  return await res.json();
}
