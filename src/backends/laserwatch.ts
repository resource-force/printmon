import fetch from "node-fetch";
import FormData from "form-data";
import toughCookie from "tough-cookie";
import qs from "querystring";
import moment from "moment";
import config from "../config.json";
import { RequestResponse } from "request";

const defaultOptions = {
  headers: {
    "User-Agent":
      "printmon/0.1.0 (scraping for Acton-Boxborough Regional High School)"
  }
};

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

export async function generateReport(authCookies: string): Promise<string> {
  const q = qs
    .stringify({
      reportId: "f09a4c58-57ab-422c-9a79-1ec7ff85b859",
      reportParams:
        '[{"DisplayText":"Group","Value":"0fc2f7df-79d6-48e3-9963-49a18f1ce5e5","ParameterType":2},{"DisplayText":"Start Date","Value":"2019-01-01+00:00:00","ParameterType":0},{"DisplayText":"End Date","Value":"2019-01-31+23:59:59","ParameterType":1},{"DisplayText":"ManagementStatus","ParameterType":4,"Value":"0"}]',
      _: Number.parseInt(moment().format("X")) * 1000
      // what
    })
    .replace("%2B", "+")
    .replace("%2B", "+");

  const res = await fetch(
    "https://laserwatch2.com/Handlers/ReportRun.ashx?" + q,
    {
      ...defaultOptions,
      headers: {
        Cookie: authCookies
      }
    }
  );

  return (await res.json()).ReportCacheId;
}

export async function generateCsv(
  reportCacheId: string,
  authCookies: string
): Promise<string> {
  const q = qs.stringify({ reportCacheId, renderFormat: "csv" });
  const res = await fetch(
    "https://laserwatch2.com/handlers/ReportRender.ashx?" + q,
    { headers: { Cookie: authCookies } }
  );
  return await res.text();
}
