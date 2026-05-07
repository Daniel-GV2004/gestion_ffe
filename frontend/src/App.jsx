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
import IframeCaddie from "./components/IframeCaddie.jsx";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario_crm");
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  const handleLogin = (nombre) => {
    const datosUsuario = { name: nombre };
    setUser(datosUsuario);
    localStorage.setItem("usuario_crm", JSON.stringify(datosUsuario));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("usuario_crm");
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
