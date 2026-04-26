import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";
import CRMConfig from "../CRMConfig";
import { alertStore } from "../useAlerts";
import { notifications } from "@mantine/notifications";

const getBasePath = () => {
  if (import.meta.env.MODE === "development")
    return `http://${window.location.hostname}:5000`;
  return "/api";
};
export const BASE_PATH = getBasePath();

export const axiosInstance = axios.create({
  baseURL: BASE_PATH,
  paramsSerializer: {
    indexes: null,
  },
});
axiosInstance.interceptors.request.use(
  (config) => {
    try {
      let auth = localStorage.getItem("auth");
      if (auth) {
        auth = JSON.parse(auth);

        if (auth?.token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Token ${auth.token}`;
        }
      }
    } catch (error) {
      localStorage.removeItem("auth");
    }
    return config;
  },
  (error) => Promise.reject(error),
);

function getAuthenticatedHeaders() {
  const getToken = () => {
    try {
      return JSON.parse(localStorage.getItem("auth"))?.token;
    } catch {
      localStorage.removeItem("auth");
      return undefined;
    }
  };
  return {
    Authorization: `Token ${getToken()}`,
  };
}

function getQueryString(query) {
  if (query) {
    if (query instanceof URLSearchParams) return "?" + query.toString();
    else if (Array.isArray(query) || query instanceof FormData)
      return "?" + new URLSearchParams(query);
    else {
      const urlSearchParams = new URLSearchParams();
      Object.entries(query).forEach(([k, v]) => {
        if (Array.isArray(v))
          v.forEach((v) => urlSearchParams.append(k, v === null ? "" : v));
        else urlSearchParams.append(k, v === null ? "" : v);
      });
      return "?" + urlSearchParams.toString();
    }
  }
  return "";
}

function advancedFetch(
  url,
  { addAlert, setAuth, disableAlerts, ignoreErrors, ...config },
) {
  return fetch(`${config?.basePath ?? BASE_PATH}${url}`, {
    ...config,
  }).catch((e) => {
    console.error(e);
    if (!disableAlerts && !(e instanceof DOMException))
      alertStore.addAlert(
        "danger",
        "No se ha podido procesar la solicitud; inténtelo de nuevo.",
      );
    return { ok: false };
  });
}

const CAMPO_ERROR_GENERAL = "__all__";
export async function alertErrors(response, addAlert, setErrors) {
  try {
    response = await response.json();
    if (typeof response === "string")
      response = { [CAMPO_ERROR_GENERAL]: response };
    if (setErrors)
      setErrors(
        Object.assign(
          {},
          ...Object.entries(response)
            .filter((x) => x[0] !== CAMPO_ERROR_GENERAL)
            .map((x) => ({ [x[0]]: x[1].join("\n") })),
        ),
      );
    if (addAlert)
      addAlert(
        "danger",
        <div className="text-prewrap">
          {Object.entries(response)
            .sort(([campoA], [campoB]) => campoA.localeCompare(campoB))
            .map(([campo, errores], i) => {
              if (!Array.isArray(errores)) errores = [errores];
              let message =
                (campo !== CAMPO_ERROR_GENERAL
                  ? 'Campo "' + campo + '":\n'
                  : "") + errores.map((error) => "- " + error).join("\n");
              if (campo === CAMPO_ERROR_GENERAL) message += "\n";
              return message;
            })
            .join("\n")}
        </div>,
      );
  } catch {}
}

export function processFormErrors(errors, output, prefix = "") {
  if (output === undefined) output = {};

  Object.entries(errors).forEach(([k, v]) => {
    if (Array.isArray(v)) {
      if (typeof v[0] === "string") output[`${prefix}${k}`] = v.join("; ");
      else
        v.forEach((v, i) =>
          processFormErrors(v, output, `${prefix}${k}.${i}.`),
        );
    } else if (typeof v === "string") output[`${prefix}${k}`] = v;
    else if (typeof v === "object")
      processFormErrors(v, output, `${prefix}${k}.`);
  });

  return output;
}

export async function login(login, password) {
  return advancedFetch("/usuario/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
    ignoreErrors: [401],
  });
}

export function parseDates(obj, keys) {
  const convertToDate = (value) => {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day); // month es 0-indexed
    }

    const date = new Date(value);
    if (isNaN(date)) return null;
    return date;
  };

  const parseDatesByKey = (obj, subkeys, index = 0) => {
    if (!obj) return;
    if (Array.isArray(obj))
      return obj.forEach((x) => parseDatesByKey(x, subkeys, index));

    const currentSubkey = subkeys[index];
    if (!(currentSubkey in obj)) return;

    const currentValue = obj[currentSubkey];
    if (index < subkeys.length - 1)
      parseDatesByKey(currentValue, subkeys, index + 1);
    else {
      if (Array.isArray(currentValue))
        obj[currentSubkey] = currentValue.map(convertToDate);
      else if (currentValue) obj[currentSubkey] = convertToDate(currentValue);
    }
  };
  keys.forEach((key) => parseDatesByKey(obj, key.split(".")));
  return obj;
}

export async function getUsers(query, abortSignal) {
  return advancedFetch("/usuario/usuarios" + getQueryString(query), {
    method: "GET",
    headers: getAuthenticatedHeaders(),
    signal: abortSignal,
  });
}

export async function getAlumnos(query, abortSignal) {
  return advancedFetch("/alumno/alumnos" + getQueryString(query), {
    method: "GET",
    headers: getAuthenticatedHeaders(),
    signal: abortSignal,
  });
}

export async function getEmpresas(query, abortSignal) {
  return advancedFetch("/empresa/empresas" + getQueryString(query), {
    method: "GET",
    headers: getAuthenticatedHeaders(),
    signal: abortSignal,
  });
}

export async function postUsuario(email) {
  const formData = new FormData();
  formData.append("email", email);
  return advancedFetch("/usuario/register", {
    method: "POST",
    body: formData,
  });
}