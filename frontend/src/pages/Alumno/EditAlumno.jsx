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
import { getAlumno, postAlumno, updateAlumno, deleteAlumno } from "../../API";

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
      direccion: "",
      localidad: "",
      provincia: "",
      cp: "",
      curso: "",
    },
    validate: {
      nombre: (value) => (value.length < 2 ? "El nombre es muy corto" : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Email inválido"),
      nif: (value) => (value.length < 9 ? "NIF incompleto" : null),
    },
  });

  useEffect(() => {
    if (isEditing) {
      getAlumno(id)
        .then((res) => {
          const data = res.data;
          form.setValues({
            nombre: data.nombre || "",
            apellidos: data.apellidos || "",
            nif: data.nif || "",
            email: data.email || "",
            telefono: data.telefono || "",
            nuss: data.nuss || "",
            direccion: data.direccion || "",
            localidad: data.localidad || "",
            provincia: data.provincia || "",
            cp: data.cp || "",
            curso: data.curso || "",
          });
          setLoadingData(false);
        })
        .catch((err) => {
          console.error(err);
          setNotificacion({
            type: "error",
            message: err.response?.data?.error || "Error al cargar datos",
          });
          setLoadingData(false);
        });
    }
  }, [id, isEditing]);

  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    setNotificacion(null);

    const { curso, ...datosAEnviar } = values;

    try {
      const response = isEditing
        ? await updateAlumno(id, datosAEnviar)
        : await postAlumno(datosAEnviar);

      setNotificacion({
        type: "success",
        message: isEditing
          ? "Alumno actualizado con éxito"
          : "Alumno guardado con éxito",
      });
      setTimeout(() => navigate("/alumnos"), 1500);
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.errores ||
        "Error al guardar";
      setNotificacion({
        type: "error",
        message:
          typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg,
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
      await deleteAlumno(id);
      setNotificacion({
        type: "success",
        message: "Alumno eliminado correctamente",
      });
      setTimeout(() => navigate("/alumnos"), 1500);
    } catch (err) {
      console.error(err);
      setNotificacion({
        type: "error",
        message: err.response?.data?.error || "Error al eliminar",
      });
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
          <Title order={5} mt="md" mb="sm" c="dimmed">
            Datos Personales
          </Title>
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

          <Title order={5} mt="xl" mb="sm" c="dimmed">
            Datos de Residencia
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Dirección"
              placeholder="Calle, número, piso..."
              {...form.getInputProps("direccion")}
            />
            <TextInput
              label="Localidad"
              placeholder="Ej: Valladolid"
              {...form.getInputProps("localidad")}
            />
            <TextInput
              label="Provincia"
              placeholder="Ej: Valladolid"
              {...form.getInputProps("provincia")}
            />
            <TextInput
              label="Código Postal"
              placeholder="Ej: 47000"
              {...form.getInputProps("cp")}
            />
          </SimpleGrid>

          {isEditing && form.values.curso && (
            <>
              <Title order={5} mt="xl" mb="sm" c="dimmed">
                Información Académica
              </Title>
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput
                  label="Curso Académico"
                  disabled
                  description="Calculado automáticamente por el sistema"
                  {...form.getInputProps("curso")}
                />
              </SimpleGrid>
            </>
          )}

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
