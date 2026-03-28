import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Title,
  Container,
  Paper,
  Notification,
} from "@mantine/core";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function EditUsuario() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/usuario/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, password }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Usuario ${data.nombre} creado correctamente`);
        setTimeout(() => navigate("/usuarios"), 1500);
      } else {
        setError(data.error || "Error al crear usuario");
      }
    } catch (err) {
      setError("Problema de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/usuarios")}
        mb="md"
      >
        Volver al listado
      </Button>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" align="center">
          Registrar Nuevo Usuario
        </Title>

        {success && (
          <Notification
            icon={<IconCheck size={18} />}
            color="teal"
            title="Éxito"
            mb="md"
            onClose={() => setSuccess(null)}
          >
            {success}
          </Notification>
        )}

        {error && (
          <Notification
            icon={<IconX size={18} />}
            color="red"
            title="Error"
            mb="md"
            onClose={() => setError(null)}
          >
            {error}
          </Notification>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Nombre de Usuario"
            placeholder="Introduce el nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
            mb="md"
          />
          <PasswordInput
            label="Contraseña"
            placeholder="Introduce la contraseña"
            required
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            mb="xl"
          />
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => {
                setNombre("");
                setPassword("");
              }}
            >
              Limpiar
            </Button>
            <Button type="submit" loading={loading} color="blue">
              Guardar Usuario
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
