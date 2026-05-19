import {
  AppShell,
  Burger,
  Group,
  Title,
  Button,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Inicio from "./pages/Inicio/Inicio";
import ListLogin from "./pages/Login/ListLogin";
import Alumnos from "./pages/Alumno/ListAlumno";
import EditAlumno from "./pages/Alumno/EditAlumno";
import Empresas from "./pages/Empresa/ListEmpresa";
import EditEmpresa from "./pages/Empresa/EditEmpresa";
import Practicas from "./pages/Practica/ListPractica";
import EditPractica from "./pages/Practica/EditPractica";
import Usuarios from "./pages/Usuario/ListUsuario";
import EditUsuario from "./pages/Usuario/EditUsuario";
import ListRepositorio from "./pages/Repositorio/ListRepositorio";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const auth = JSON.parse(authData);
        if (auth && auth.nombre) {
          return { name: auth.nombre };
        }
      } catch (e) {
        localStorage.removeItem("auth");
      }
    }
    return null;
  });

  const handleLogin = (nombre) => {
    setUser({ name: nombre });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("userName");
    navigate("/");
  };

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<ListLogin onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title
              order={3}
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              CRM FFE
            </Title>
          </Group>
          <Button variant="subtle" color="red" onClick={handleLogout}>
            Salir
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar toggle={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="xl">
          <Routes>
            <Route path="/" element={<Inicio user={user} />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/nuevo" element={<EditUsuario />} />
            <Route path="/usuarios/editar/:id" element={<EditUsuario />} />
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/alumnos/nuevo" element={<EditAlumno />} />
            <Route path="/alumnos/editar/:id" element={<EditAlumno />} />
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/empresas/nueva" element={<EditEmpresa />} />
            <Route path="/empresas/editar/:id" element={<EditEmpresa />} />
            <Route path="/practicas" element={<Practicas />} />
            <Route path="/practicas/nueva" element={<EditPractica />} />
            <Route path="/practicas/editar/:id" element={<EditPractica />} />
            <Route
              path="/repositorio"
              element={<ListRepositorio nombreProfesor={user.name} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
