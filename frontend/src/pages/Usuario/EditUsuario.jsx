import { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  MultiSelect,
  Button,
  Group,
  Title,
  Container,
  Paper,
  Loader,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCheck,
  IconX,
  IconArrowLeft,
  IconCertificate,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";

export default function EditUsuario() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);

  // Lista de grados disponibles (puedes ampliarla aquí)
  const opcionesGrados = [
    { value: "DAM", label: "DAM - Aplicaciones Multiplataforma" },
    { value: "DAW", label: "DAW - Aplicaciones Web" },
    { value: "SMR", label: "SMR - Sistemas Microinformáticos y Redes" },
  ];

  const form = useForm({
    initialValues: {
      nombre: "",
      password: "",
      grados: [],
    },
    validate: {
      nombre: (value) => (value.length < 2 ? "El nombre es muy corto" : null),
      // Al editar, la contraseña podría ser opcional. Aquí la validamos si se escribe algo.
      password: (value) =>
        !isEditing && value.length <= 4
          ? "La contraseña debe tener más de 4 caracteres"
          : value.length > 0 && value.length <= 4
            ? "Debe tener más de 4 caracteres"
            : null,
      grados: (value) =>
        value.length === 0 ? "Selecciona al menos un grado" : null,
    },
  });

  // 1. Cargar datos si estamos editando
  useEffect(() => {
    if (isEditing) {
      fetch(`http://127.0.0.1:5000/api/usuario/usuarios/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            form.setValues({
              nombre: data.nombre || "",
              password: "", // La contraseña no se descarga por seguridad
              grados: data.grados || [],
            });
          } else {
            notifications.show({
              title: "Error",
              message: data.error,
              color: "red",
              icon: <IconX />,
            });
          }
        })
        .catch(() => {
          notifications.show({
            title: "Error",
            message: "Error al conectar",
            color: "red",
            icon: <IconX />,
          });
        })
        .finally(() => setLoadingData(false));
    }
  }, [id, isEditing]);

  // 2. Guardar (POST o PUT)
  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    try {
      const url = isEditing
        ? `http://127.0.0.1:5000/api/usuario/usuarios/${id}`
        : "http://127.0.0.1:5000/api/usuario/register"; // Ruta de registro para nuevos
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        notifications.show({
          title: "Éxito",
          message: isEditing ? "Usuario actualizado" : "Usuario creado",
          color: "teal",
          icon: <IconCheck />,
        });
        setTimeout(() => navigate("/usuarios"), 1500);
      } else {
        const data = await response.json();
        notifications.show({
          title: "Error",
          message: data.error || "Error al guardar",
          color: "red",
          icon: <IconX />,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Fallo de conexión",
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingData) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => navigate("/usuarios")}
        mb="md"
      >
        Volver
      </Button>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" align="center">
          {isEditing ? "Editar Usuario / Profesor" : "Nuevo Usuario"}
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Nombre de Usuario"
            placeholder="Ej: jorge_prof"
            required
            {...form.getInputProps("nombre")}
            mb="md"
          />

          <PasswordInput
            label="Contraseña"
            placeholder={
              isEditing
                ? "Dejar en blanco para no cambiar"
                : "Mínimo 5 caracteres"
            }
            required={!isEditing}
            {...form.getInputProps("password")}
            mb="md"
          />

          <MultiSelect
            label="Grados asignados"
            placeholder="Selecciona uno o varios"
            data={opcionesGrados}
            required
            leftSection={<IconCertificate size={16} />}
            {...form.getInputProps("grados")}
            searchable
            clearable
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" loading={loadingSubmit} color="blue">
              {isEditing ? "Actualizar Datos" : "Crear Usuario"}
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
