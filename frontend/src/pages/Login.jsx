import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Button,
  Notification,
  Box,
} from "@mantine/core";
import { IconLock, IconUser, IconX } from "@tabler/icons-react";

export default function Login({ onLogin }) {
  // Estados para controlar los inputs
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  // Estados para la interfaz
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita que la página se recargue
    setLoading(true);
    setError(null);

    try {
      // Llamada a tu API de Flask
      const response = await fetch("http://127.0.0.1:5000/api/usuario/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombre,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el login es correcto, pasamos el nombre al estado global de App.jsx
        onLogin(data.nombre);
      } else {
        // Si el backend devuelve un error (401, 404, etc.)
        setError(data.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      // Si el servidor Flask no responde
      setError(
        "No se pudo conectar con el servidor. Revisa si Flask está corriendo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: "var(--mantine-color-dark-8)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container size={420} w="100%">
        <Title ta="center" fw={900}>
          CRM FFE
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Introduce tus datos para acceder al panel
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          {error && (
            <Notification
              icon={<IconX size={18} />}
              color="red"
              title="Error de acceso"
              mb="md"
              onClose={() => setError(null)}
            >
              {error}
            </Notification>
          )}

          <form onSubmit={handleLogin}>
            <TextInput
              label="Nombre de Usuario"
              placeholder="Tu usuario"
              required
              leftSection={<IconUser size={16} />}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)} // Corregido: e.target.value
            />

            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              required
              mt="md"
              leftSection={<IconLock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Corregido: e.target.value
            />

            <Button
              type="submit"
              fullWidth
              mt="xl"
              loading={loading}
              color="blue"
            >
              Entrar
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
