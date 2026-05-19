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
import {
  IconCheck,
  IconX,
  IconArrowLeft,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getEmpresa,
  postEmpresa,
  updateEmpresa,
  deleteEmpresa,
} from "../../API";

export default function EditEmpresa() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [notificacion, setNotificacion] = useState(null);

  const form = useForm({
    initialValues: {
      nombre_empresa: "",
      cif: "",
      email: "",
      nombre_contacto: "",
      telefono: "",
      direccion: "",
      cp: "",
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

  useEffect(() => {
    if (isEditing) {
      getEmpresa(id)
        .then((res) => {
          const data = res.data;
          form.setValues({
            nombre_empresa: data.nombre_empresa || "",
            cif: data.cif || "",
            email: data.email || "",
            nombre_contacto: data.nombre_contacto || "",
            telefono: data.telefono || "",
            direccion: data.direccion || "",
            cp: data.cp || "",
            nombre_tutor_empresa: data.nombre_tutor_empresa || "",
            apellidos_tutor_empresa: data.apellidos_tutor_empresa || "",
            email_tutor_empresa: data.email_tutor_empresa || "",
          });
          setLoadingData(false);
        })
        .catch((err) => {
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

    const payload = { ...values };
    if (!payload.email_tutor_empresa) delete payload.email_tutor_empresa;

    try {
      if (isEditing) {
        await updateEmpresa(id, payload);
      } else {
        await postEmpresa(payload);
      }

      setNotificacion({
        type: "success",
        message: isEditing
          ? "Empresa actualizada con éxito"
          : "Empresa guardada con éxito",
      });
      setTimeout(() => navigate("/empresas"), 1500);
    } catch (error) {
      const data = error.response?.data;

      let mensajeError = data?.error || data?.errores || "Error al guardar";

      if (typeof mensajeError === "object" && mensajeError !== null) {
        mensajeError = Object.values(mensajeError).join(" | ");
      }

      setNotificacion({
        type: "error",
        message: mensajeError,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

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
      await deleteEmpresa(id);
      setNotificacion({
        type: "success",
        message: "Empresa eliminada correctamente",
      });
      setTimeout(() => navigate("/empresas"), 1500);
    } catch (err) {
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
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p={30} radius="md">
        <Group justify="space-between" mb="lg">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            onClick={() => navigate("/empresas")}
          >
            Volver
          </Button>
          <Title order={2}>
            {isEditing ? "Editar Empresa" : "Nueva Empresa"}
          </Title>
          {isEditing && (
            <Button
              color="red"
              variant="outline"
              leftSection={<IconTrash size={16} />}
              onClick={handleDelete}
              loading={loadingSubmit}
            >
              Eliminar
            </Button>
          )}
        </Group>

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
            onClose={() => setNotificacion(null)}
            mb="md"
          >
            {notificacion.message}
          </Notification>
        )}

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre de la Empresa"
              placeholder="Ej. Caddie Formación"
              required
              {...form.getInputProps("nombre_empresa")}
            />
            <TextInput
              label="CIF"
              placeholder="Ej. B12345678"
              required
              {...form.getInputProps("cif")}
            />
            <TextInput
              label="Email General"
              placeholder="empresa@ejemplo.com"
              required
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Nombre de Contacto"
              placeholder="Persona de contacto"
              {...form.getInputProps("nombre_contacto")}
            />
            <TextInput
              label="Teléfono"
              placeholder="Ej. 600000000"
              {...form.getInputProps("telefono")}
            />
            <TextInput
              label="Código Postal"
              placeholder="Ej. 28001"
              {...form.getInputProps("cp")}
            />
          </SimpleGrid>

          <TextInput
            label="Dirección"
            placeholder="Calle, Número, Piso"
            mt="md"
            {...form.getInputProps("direccion")}
          />

          <Title order={4} mt="xl" mb="md">
            Datos del Tutor
          </Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput
              label="Nombre del Tutor"
              {...form.getInputProps("nombre_tutor_empresa")}
            />
            <TextInput
              label="Apellidos del Tutor"
              {...form.getInputProps("apellidos_tutor_empresa")}
            />
            <TextInput
              label="Email del Tutor"
              placeholder="tutor@empresa.com"
              {...form.getInputProps("email_tutor_empresa")}
            />
          </SimpleGrid>

          <Button
            type="submit"
            fullWidth
            mt="xl"
            size="md"
            loading={loadingSubmit}
          >
            {isEditing ? "Actualizar Empresa" : "Guardar Empresa"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
