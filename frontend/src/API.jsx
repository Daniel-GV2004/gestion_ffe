import axios from "axios";

// Configuración de Base Path
const getBasePath = () => {
  if (import.meta.env.MODE === "development")
    return `http://${window.location.hostname}:5000/api`;
  return "/api";
};

export const BASE_PATH = getBasePath();

// Creación de la instancia de Axios
export const axiosInstance = axios.create({
  baseURL: BASE_PATH,
  paramsSerializer: {
    indexes: null,
  },
});

// Interceptor de Petición (Añade el Token automáticamente)
axiosInstance.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        if (auth?.token) {
          config.headers["Authorization"] = `Bearer ${auth.token}`;
        }
      } catch (error) {
        localStorage.removeItem("auth");
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de Respuesta (Maneja el 401 de PyJWT - Sesión expirada)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. Limpiamos las credenciales
      localStorage.removeItem("auth");
      localStorage.removeItem("userName");

      // 2. Usamos href para que funcione con cualquier tipo de Router
      if (!window.location.href.includes("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);

// --- ENDPOINTS ---

// AUTENTICACIÓN (Nuevas rutas en el blueprint 'auth')
export const login = (nombre, password) =>
  axiosInstance.post("/auth/login", { nombre, password });

export const pingSession = () => axiosInstance.get("/auth/ping");

// USUARIOS (CRUD)
export const registerUsuario = (nombre, password, grados) =>
  axiosInstance.post("/usuario/register", {
    nombre,
    password,
    grados: grados || [],
  });

export const getUsuarios = (params) =>
  axiosInstance.get("/usuario/usuarios", { params });

export const getUsuario = (id) => axiosInstance.get(`/usuario/usuarios/${id}`);

export const updateUsuario = (id, data) =>
  axiosInstance.put(`/usuario/usuarios/${id}`, data);

export const deleteUsuario = (id) =>
  axiosInstance.delete(`/usuario/usuarios/${id}`);

// ALUMNOS
export const getAlumnos = (params) =>
  axiosInstance.get("/alumno/alumnos", { params });

export const getAlumno = (id) => axiosInstance.get(`/alumno/alumnos/${id}`);

export const postAlumno = (data) => axiosInstance.post("/alumno/alumnos", data);

export const updateAlumno = (id, data) =>
  axiosInstance.put(`/alumno/alumnos/${id}`, data);

export const deleteAlumno = (id) =>
  axiosInstance.delete(`/alumno/alumnos/${id}`);

// EMPRESAS
export const getEmpresas = (params) =>
  axiosInstance.get("/empresa/empresas", { params });

export const getEmpresa = (id) => axiosInstance.get(`/empresa/empresas/${id}`);

export const postEmpresa = (data) =>
  axiosInstance.post("/empresa/empresas", data);

export const updateEmpresa = (id, data) =>
  axiosInstance.put(`/empresa/empresas/${id}`, data);

export const deleteEmpresa = (id) =>
  axiosInstance.delete(`/empresa/empresas/${id}`);

// PRÁCTICAS
export const getPracticas = (params) =>
  axiosInstance.get("/practica/practicas", { params });

export const getPractica = (id) =>
  axiosInstance.get(`/practica/practicas/${id}`);

export const postPractica = (data) =>
  axiosInstance.post("/practica/practicas", data);

export const updatePractica = (id, data) =>
  axiosInstance.put(`/practica/practicas/${id}`, data);

export const deletePractica = (id) =>
  axiosInstance.delete(`/practica/practicas/${id}`);

// REPOSITORIO
export const getCodigoCentro = () =>
  axiosInstance.get("/repositorio/codigo-centro");

export const generarDocumento = (bodyData, isFormData = false) => {
  const config = isFormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};
  return axiosInstance.post("/repositorio/generar", bodyData, {
    ...config,
    responseType: "blob",
  });
};

// AGENDA
export const getAgendas = (params) => axiosInstance.get("/agenda/", { params });

export const getAgenda = (id) => axiosInstance.get(`/agenda/${id}`);

export const postAgenda = (data) => axiosInstance.post("/agenda/", data);

export const updateAgenda = (id, data) =>
  axiosInstance.put(`/agenda/${id}`, data);

export const deleteAgenda = (id) => axiosInstance.delete(`/agenda/${id}`);
