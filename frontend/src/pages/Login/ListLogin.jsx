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
import { useNavigate } from "react-router-dom";
import { login } from "../../API";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login(nombre, password);
      const data = response.data;

      localStorage.setItem("auth", JSON.stringify(data));

      onLogin(data.nombre);
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Usuario o contraseña incorrectos");
      } else {
        setError(
          "No se pudo conectar con el servidor. Revisa si Flask está corriendo.",
        );
      }
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
              onChange={(e) => setNombre(e.target.value)}
            />

            <PasswordInput
              label="Contraseña"
              placeholder="Tu contraseña"
              required
              mt="md"
              leftSection={<IconLock size={16} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
