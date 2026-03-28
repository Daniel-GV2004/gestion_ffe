import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Title,
  Container,
  Paper,
  Notification,
  SimpleGrid,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function EditEmpresa() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState(null);

  // Configuración del formulario con Mantine
  const form = useForm({
    initialValues: {
      nombre_empresa: "",
      cif: "",
      email: "",
      nombre_contacto: "",
      telefono: "",
      direccion: "",
      nombre_tutor_empresa: "",
      apellidos_tutor_empresa: "",
      email_tutor_empresa: "",
    },

    validate: {
      nombre_empresa: (value) =>
        value.length < 2 ? "El nombre es muy corto" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
      cif: (value) => (value.length < 9 ? "CIF incompleto" : null),
      email_tutor_empresa: (value) =>
        value && !/^\S+@\S+$/.test(value) ? "Email inválido" : null,
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    setNotificacion(null);

    // Filtrar los valores vacíos para campos no obligatorios
    const payload = { ...values };
    if (!payload.email_tutor_empresa) delete payload.email_tutor_empresa;

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/empresa/empresas",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setNotificacion({
          type: "success",
          message: "Empresa guardada con éxito",
        });
        setTimeout(() => navigate("/empresas"), 2000);
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
        onClick={() => navigate("/empresas")}
        mb="md"
      >
        Volver al listado
      </Button>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" align="center">
          Registrar Nueva Empresa
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
          <Title order={5} mb="sm" c="dimmed">
            Datos de la Empresa
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="xl">
            <TextInput
              label="Nombre de Empresa"
              placeholder="Ej: Tech Solutions"
              required
              {...form.getInputProps("nombre_empresa")}
            />
            <TextInput
              label="CIF"
              placeholder="B12345678"
              required
              {...form.getInputProps("cif")}
            />
            <TextInput
              label="Email"
              placeholder="contacto@tech.com"
              required
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Teléfono"
              placeholder="900000000"
              {...form.getInputProps("telefono")}
            />
            <TextInput
              label="Persona de Contacto"
              placeholder="Nombre del CEO / RRHH"
              {...form.getInputProps("nombre_contacto")}
              gridColumn="span 2"
            />
            <TextInput
              label="Dirección Física"
              placeholder="Calle Mayor 1"
              {...form.getInputProps("direccion")}
              gridColumn="span 2"
            />
          </SimpleGrid>

          <Title order={5} mb="sm" c="dimmed">
            Datos del Tutor de Empresa
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre Tutor"
              placeholder="Ej: María"
              {...form.getInputProps("nombre_tutor_empresa")}
            />
            <TextInput
              label="Apellidos Tutor"
              placeholder="Ej: López"
              {...form.getInputProps("apellidos_tutor_empresa")}
            />
            <TextInput
              label="Email Tutor"
              placeholder="maria@tech.com"
              {...form.getInputProps("email_tutor_empresa")}
              gridColumn="span 2"
            />
          </SimpleGrid>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={() => form.reset()}>
              Limpiar
            </Button>
            <Button type="submit" loading={loading} color="blue">
              Guardar Empresa
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
