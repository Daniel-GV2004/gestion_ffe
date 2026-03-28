import {
  AppShell,
  Burger,
  Group,
  Title,
  Button,
  Text,
  Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// Importación de componentes y páginas
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Alumnos from "./pages/Alumno/ListAlumno";
import EditAlumno from "./pages/Alumno/EditAlumno"; // Usaremos este para "Nuevo"
import Empresas from "./pages/Empresa/ListEmpresa";
import EditEmpresa from "./pages/Empresa/EditEmpresa";
import Practicas from "./pages/Practica";
import Usuarios from "./pages/Usuario/ListUsuario";
import EditUsuario from "./pages/Usuario/EditUsuario";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Gestión de sesión simple
  if (!user) {
    return <Login onLogin={(nombre) => setUser({ name: nombre })} />;
  }

  const handleLogout = () => {
    setUser(null);
    navigate("/"); // Al salir, volvemos al inicio
  };

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
      {/* --- HEADER --- */}
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

      {/* --- SIDEBAR (NAVBAR) --- */}
      <AppShell.Navbar p="md">
        <Navbar toggle={toggle} />
      </AppShell.Navbar>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <AppShell.Main>
        <Container size="xl">
          <Routes>
            {/* Inicio / Dashboard */}
            <Route
              path="/"
              element={
                <div>
                  <Title order={1}>Bienvenido, {user.name} 👋</Title>
                  <Text size="lg" mt="md" c="dimmed">
                    Has iniciado sesión correctamente. Selecciona una opción en
                    el menú lateral para gestionar el CRM.
                  </Text>
                </div>
              }
            />

            {/* Rutas de Usuarios */}
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/nuevo" element={<EditUsuario />} />

            {/* Rutas de Alumnos */}
            <Route path="/alumnos" element={<Alumnos />} />
            <Route path="/alumnos/nuevo" element={<EditAlumno />} />
            <Route path="/alumnos/editar/:id" element={<EditAlumno />} />

            {/* Rutas de Empresas */}
            <Route path="/empresas" element={<Empresas />} />
            <Route path="/empresas/nueva" element={<EditEmpresa />} />

            {/* Rutas de Prácticas */}
            <Route path="/practicas" element={<Practicas />} />

            {/* Redirección por defecto si la ruta no existe */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
