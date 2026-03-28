import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  Title,
  Container,
  Paper,
  Notification,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function NuevoAlumno() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Configuración del formulario con Mantine
  const form = useForm({
    initialValues: {
      nombre: "",
      apellidos: "",
      nif: "",
      email: "",
      telefono: "",
      nuss: "",
    },

    validate: {
      nombre: (value) => (value.length < 2 ? "El nombre es muy corto" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
      nif: (value) => (value.length < 9 ? "NIF incompleto" : null),
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setNotificacion(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/alumno/alumnos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificacion({
          type: "success",
          message: "Alumno guardado con éxito",
        });
        setTimeout(() => navigate("/alumnos"), 2000); 
      } else {
        setNotificacion({
          type: "error",
          message: data.error || "Error al guardar",
        });
      }
    } catch (error) {
      setNotificacion({
        type: "error",
        message: "No se pudo conectar con el servidor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/alumnos")}
        mb="md"
      >
        Volver al listado
      </Button>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" align="center">
          Registrar Nuevo Alumno
        </Title>

        {notificacion && (
          <Notification
            icon={
              notificacion.type === "success" ? (
                <IconCheck size={18} />
              ) : (
                <IconX size={18} />
              )
            }
            color={notificacion.type === "success" ? "teal" : "red"}
            title={notificacion.type === "success" ? "Éxito" : "Error"}
            mb="md"
            onClose={() => setNotificacion(null)}
          >
            {notificacion.message}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre"
              placeholder="Ej: Juan"
              required
              {...form.getInputProps("nombre")}
            />
            <TextInput
              label="Apellidos"
              placeholder="Ej: Pérez García"
              required
              {...form.getInputProps("apellidos")}
            />
            <TextInput
              label="NIF / NIE"
              placeholder="12345678Z"
              required
              {...form.getInputProps("nif")}
            />
            <TextInput
              label="Email"
              placeholder="juan@ejemplo.com"
              required
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Teléfono"
              placeholder="600000000"
              {...form.getInputProps("telefono")}
            />
            <TextInput
              label="NUSS"
              placeholder="Número Seg. Social"
              {...form.getInputProps("nuss")}
            />
          </SimpleGrid>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => form.reset()}>
              Limpiar
            </Button>
            <Button type="submit" loading={loading} color="blue">
              Guardar Alumno
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
