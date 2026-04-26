import { useState, useEffect } from "react";
import {
  TextInput,
  Button,
  Group,
  Title,
  Container,
  Paper,
  Notification,
  SimpleGrid,
  Loader,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditEmpresa() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id); // Si hay ID en la URL, estamos en modo edición

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
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

  // 1. Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      fetch(`http://127.0.0.1:5000/api/empresa/empresas/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            form.setValues({
              nombre_empresa: data.nombre_empresa || "",
              cif: data.cif || "",
              email: data.email || "",
              nombre_contacto: data.nombre_contacto || "",
              telefono: data.telefono || "",
              direccion: data.direccion || "",
              nombre_tutor_empresa: data.nombre_tutor_empresa || "",
              apellidos_tutor_empresa: data.apellidos_tutor_empresa || "",
              email_tutor_empresa: data.email_tutor_empresa || "",
            });
          } else {
            setNotificacion({ type: "error", message: data.error });
          }
          setLoadingData(false);
        })
        .catch((err) => {
          setNotificacion({ type: "error", message: "Error al cargar datos" });
          setLoadingData(false);
        });
    }
  }, [id, isEditing]);

  // 2. Guardar (POST o PUT)
  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    setNotificacion(null);

    // Filtrar los valores vacíos para campos no obligatorios
    const payload = { ...values };
    if (!payload.email_tutor_empresa) delete payload.email_tutor_empresa;

    try {
      // Determinamos URL y método dinámicamente
      const url = isEditing
        ? `http://127.0.0.1:5000/api/empresa/empresas/${id}`
        : "http://127.0.0.1:5000/api/empresa/empresas";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificacion({
          type: "success",
          message: isEditing
            ? "Empresa actualizada con éxito"
            : "Empresa guardada con éxito",
        });
        setTimeout(() => navigate("/empresas"), 1500);
      } else {
        setNotificacion({
          type: "error",
          message: data.error || data.errores || "Error al guardar",
        });
      }
    } catch (error) {
      setNotificacion({
        type: "error",
        message: "No se pudo conectar con el servidor",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  // 3. Eliminar Empresa
  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Seguro que quieres eliminar la empresa ${form.values.nombre_empresa}?`,
      )
    ) {
      return;
    }

    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/empresa/empresas/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setNotificacion({
          type: "success",
          message: "Empresa eliminada correctamente",
        });
        setTimeout(() => navigate("/empresas"), 1500);
      } else {
        setNotificacion({ type: "error", message: "Error al eliminar" });
        setLoadingSubmit(false);
      }
    } catch (err) {
      setNotificacion({ type: "error", message: "Error de conexión" });
      setLoadingSubmit(false);
    }
  };

  // Spinner mientras cargan los datos en modo edición
  if (loadingData) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

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
          {isEditing ? "Editar Empresa" : "Registrar Nueva Empresa"}
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
              style={{ gridColumn: "span 2" }}
            />
            <TextInput
              label="Dirección Física"
              placeholder="Calle Mayor 1"
              {...form.getInputProps("direccion")}
              style={{ gridColumn: "span 2" }}
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
              style={{ gridColumn: "span 2" }}
            />
          </SimpleGrid>

          <Group justify={isEditing ? "space-between" : "flex-end"} mt="xl">
            {isEditing && (
              <Button
                variant="outline"
                color="red"
                onClick={handleDelete}
                disabled={loadingSubmit}
              >
                Eliminar Empresa
              </Button>
            )}
            <Group>
              <Button
                variant="default"
                onClick={() => form.reset()}
                disabled={loadingSubmit}
              >
                Limpiar
              </Button>
              <Button type="submit" loading={loadingSubmit} color="blue">
                {isEditing ? "Actualizar Empresa" : "Guardar Empresa"}
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
