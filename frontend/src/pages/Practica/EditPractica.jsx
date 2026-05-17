import { useState, useEffect } from "react";
import {
  Stack,
  Select,
  Group,
  TextInput,
  NumberInput,
  Button,
  Container,
  Title,
  Paper,
  Center,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX, IconArrowLeft } from "@tabler/icons-react";
import {
  getAlumnos,
  getEmpresas,
  getPractica,
  postPractica,
  updatePractica,
  deletePractica,
} from "../../api";

export default function EditPractica() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [opcionesAlumnos, setOpcionesAlumnos] = useState([]);
  const [opcionesEmpresas, setOpcionesEmpresas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const hoy = new Date();
  const añoActual = hoy.getFullYear();

  const form = useForm({
    initialValues: {
      alumno: "",
      empresa: "",
      fecha_inicio: "",
      fecha_fin: "",
      horas_totales: 0,
      ciclo: "",
      curso: "",
      y_academico:
        hoy > new Date(añoActual, 6, 1)
          ? `${añoActual}/${añoActual + 1}`
          : `${añoActual - 1}/${añoActual}`,
    },
  });

  useEffect(() => {
    const cargarTodo = async () => {
      setLoadingData(true);
      try {
        const [resA, resE] = await Promise.all([getAlumnos(), getEmpresas()]);

        const dataA = resA && resA.ok ? await resA.json() : [];
        const dataE = resE && resE.ok ? await resE.json() : [];

        const arrayAlumnos = Array.isArray(dataA) ? dataA : dataA.alumnos || [];
        setOpcionesAlumnos(
          arrayAlumnos
            .map((a) => {
              const mongoId = a._id?.$oid || a._id || a.id;
              return {
                value: String(mongoId),
                label:
                  `${a.nombre || ""} ${a.apellidos || ""} - ${a.nif || ""}`.trim(),
              };
            })
            .filter((op) => op.value !== "undefined" && op.value !== "null"),
        );

        const arrayEmpresas = Array.isArray(dataE)
          ? dataE
          : dataE.empresas || [];
        setOpcionesEmpresas(
          arrayEmpresas
            .map((e) => {
              const mongoId = e._id?.$oid || e._id || e.id;
              return {
                value: String(mongoId),
                label:
                  `${e.nombre_empresa || e.nombre || "Empresa sin nombre"} - ${e.cif || "Sin CIF"}`.trim(),
              };
            })
            .filter((op) => op.value !== "undefined" && op.value !== "null"),
        );

        if (isEditing) {
          const resP = await getPractica(id);

          if (resP && resP.ok) {
            const dataP = await resP.json();

            if (!dataP.error) {
              const extraerId = (campo) => {
                if (!campo) return "";
                if (typeof campo === "object") {
                  return String(campo.id || campo._id?.$oid || campo._id || "");
                }
                return String(campo);
              };

              const idAlumno = extraerId(dataP.alumno);
              const idEmpresa = extraerId(dataP.empresa);

              const formatoFecha = (fecha) =>
                fecha ? new Date(fecha).toISOString().substring(0, 10) : "";

              form.setValues({
                alumno: idAlumno,
                empresa: idEmpresa,
                fecha_inicio: formatoFecha(dataP.fecha_inicio),
                fecha_fin: formatoFecha(dataP.fecha_fin),
                horas_totales: dataP.horas_totales || 0,
                ciclo: dataP.ciclo || "",
                curso: dataP.curso || "",
                y_academico: dataP.y_academico || "",
              });
            } else {
              notifications.show({
                title: "Error",
                message: "No se pudo cargar la práctica",
                color: "red",
                icon: <IconX />,
              });
            }
          }
        }
      } catch (error) {
        notifications.show({
          title: "Error de conexión",
          message: "Error al descargar datos",
          color: "red",
          icon: <IconX />,
        });
      } finally {
        setLoadingData(false);
      }
    };

    cargarTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    try {
      const response = isEditing
        ? await updatePractica(id, values)
        : await postPractica(values);

      const data = await response.json();

      if (response && response.ok) {
        notifications.show({
          title: "¡Éxito!",
          message: isEditing
            ? "Práctica actualizada"
            : "Práctica asignada correctamente",
          color: "teal",
          icon: <IconCheck />,
        });
        setTimeout(() => navigate("/practicas"), 1500);
      } else {
        notifications.show({
          title: "Error",
          message: data.error || "Revisa los datos",
          color: "red",
          icon: <IconX />,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Error de conexión con el servidor",
        color: "red",
        icon: <IconX />,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar esta práctica?")) return;

    setLoadingSubmit(true);
    try {
      const response = await deletePractica(id);

      if (response && response.ok) {
        notifications.show({
          title: "Eliminada",
          message: "Práctica eliminada correctamente",
          color: "teal",
          icon: <IconCheck />,
        });
        setTimeout(() => navigate("/practicas"), 1500);
      } else {
        notifications.show({
          title: "Error",
          message: "No se pudo eliminar",
          color: "red",
          icon: <IconX />,
        });
        setLoadingSubmit(false);
      }
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Error de conexión",
        color: "red",
        icon: <IconX />,
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
        onClick={() => navigate("/practicas")}
        mb="md"
      >
        Volver al listado
      </Button>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="lg" align="center">
          {isEditing ? "Editar Práctica" : "Asignar Nueva Práctica"}
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Seleccionar Alumno"
              placeholder="Escribe para buscar..."
              searchable
              nothingFoundMessage="No se encontró al alumno"
              data={opcionesAlumnos}
              {...form.getInputProps("alumno")}
              required
            />

            <Select
              label="Seleccionar Empresa"
              placeholder="Escribe para buscar..."
              searchable
              nothingFoundMessage="No se encontró la empresa"
              data={opcionesEmpresas}
              {...form.getInputProps("empresa")}
              required
            />

            <Group grow>
              <TextInput
                label="Fecha Inicio"
                type="date"
                {...form.getInputProps("fecha_inicio")}
                required
              />
              <TextInput
                label="Fecha Fin"
                type="date"
                {...form.getInputProps("fecha_fin")}
                required
              />
            </Group>

            <NumberInput
              label="Horas Totales"
              {...form.getInputProps("horas_totales")}
            />

            <Group grow>
              <TextInput
                label="Ciclo"
                placeholder="Escribe el ciclo"
                {...form.getInputProps("ciclo")}
              />
              <TextInput
                label="Curso"
                placeholder="Ej: Primero o Segundo"
                {...form.getInputProps("curso")}
              />
            </Group>

            <Group justify={isEditing ? "space-between" : "flex-end"} mt="xl">
              {isEditing && (
                <Button
                  variant="outline"
                  color="red"
                  onClick={handleDelete}
                  disabled={loadingSubmit}
                >
                  Eliminar
                </Button>
              )}
              <Button type="submit" loading={loadingSubmit} color="blue">
                {isEditing ? "Actualizar Práctica" : "Guardar Práctica"}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
