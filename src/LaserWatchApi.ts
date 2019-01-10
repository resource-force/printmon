import request from "request-promise-native";
import toughCookie from "tough-cookie";
import qs from "querystring";
import moment from "moment";
import config from "./config.json";

const cookies = request.jar();
cookies.setCookie(
  new toughCookie.Cookie({
    key: "ASP.NET_SessionId",
    value: config.sessionId
  }).toString(),
  "https://laserwatch2.com"
);
const defaultOptions = {
  jar: cookies,
  headers: {
    "User-Agent": "printmon/0.1.0 (scraping for Acton-Boxborough Regional High School)"
  }
} as request.RequestPromiseOptions;

export async function generateReport(): Promise<string> {
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

  var options = {
    ...defaultOptions,
    url: "https://laserwatch2.com/Handlers/ReportRun.ashx?" + q
  };

  const res = await request.get(options);
  return JSON.parse(res).ReportCacheId;
}

export async function generateCsv(reportCacheId: string): Promise<string> {
  const res = await request.get({
    ...defaultOptions,
    url: "https://laserwatch2.com/handlers/ReportRender.ashx",
    qs: {
      reportCacheId,
      renderFormat: "csv"
    },
  });
  return res;
}
