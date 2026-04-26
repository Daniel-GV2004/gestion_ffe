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

export default function EditAlumno() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [notificacion, setNotificacion] = useState(null);

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

  // Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      console.log("1. Pidiendo datos del alumno con ID:", id);

      fetch(`http://127.0.0.1:5000/api/alumno/alumnos/${id}`)
        .then((res) => {
          console.log("2. Estado de la respuesta del servidor:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("3. JSON recibido del backend:", data);

          if (!data.error) {
            form.setValues({
              nombre: data.nombre || "",
              apellidos: data.apellidos || "",
              nif: data.nif || "",
              email: data.email || "",
              telefono: data.telefono || "",
              nuss: data.nuss || "",
            });
            console.log("4. Inputs rellenados correctamente.");
          } else {
            console.error("El backend devolvió un error:", data.error);
            setNotificacion({ type: "error", message: data.error });
          }
          setLoadingData(false);
        })
        .catch((err) => {
          console.error("💥 ERROR CRÍTICO al conectar:", err);
          setNotificacion({ type: "error", message: "Error al cargar datos" });
          setLoadingData(false);
        });
    }
  }, [id, isEditing]);

  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    setNotificacion(null);

    try {
      const url = isEditing
        ? `http://127.0.0.1:5000/api/alumno/alumnos/${id}`
        : "http://127.0.0.1:5000/api/alumno/alumnos";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setNotificacion({
          type: "success",
          message: isEditing
            ? "Alumno actualizado con éxito"
            : "Alumno guardado con éxito",
        });
        setTimeout(() => navigate("/alumnos"), 1500);
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

  const handleDelete = async () => {
    if (
      !window.confirm(
        `¿Seguro que quieres eliminar al alumno ${form.values.nombre}?`,
      )
    )
      return;

    setLoadingSubmit(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/alumno/alumnos/${id}`,
        { method: "DELETE" },
      );
      if (response.ok) {
        setNotificacion({
          type: "success",
          message: "Alumno eliminado correctamente",
        });
        setTimeout(() => navigate("/alumnos"), 1500);
      } else {
        setNotificacion({ type: "error", message: "Error al eliminar" });
        setLoadingSubmit(false);
      }
    } catch (err) {
      setNotificacion({ type: "error", message: "Error de conexión" });
      setLoadingSubmit(false);
    }
  };

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
        onClick={() => navigate("/alumnos")}
        mb="md"
      >
        Volver al listado
      </Button>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" align="center">
          {isEditing ? "Editar Alumno" : "Registrar Nuevo Alumno"}
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

          <Group justify={isEditing ? "space-between" : "flex-end"} mt="xl">
            {isEditing && (
              <Button
                variant="outline"
                color="red"
                onClick={handleDelete}
                disabled={loadingSubmit}
              >
                Eliminar Alumno
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
                {isEditing ? "Actualizar Alumno" : "Guardar Alumno"}
              </Button>
            </Group>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
