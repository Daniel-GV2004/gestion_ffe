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

export default function EditPractica() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id); // Detecta si estamos creando o editando

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
        // 1. Descargamos Alumnos y Empresas a la vez para que sea más rápido
        const [resA, resE] = await Promise.all([
          fetch("http://127.0.0.1:5000/api/alumno/alumnos"),
          fetch("http://127.0.0.1:5000/api/empresa/empresas"),
        ]);

        const dataA = await resA.json();
        const dataE = await resE.json();

        // Procesar Alumnos
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

        // Procesar Empresas
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

        // 2. Si estamos en MODO EDICIÓN, descargamos los datos de la práctica
        if (isEditing) {
          const resP = await fetch(
            `http://127.0.0.1:5000/api/practica/practicas/${id}`,
          );
          const dataP = await resP.json();

          if (!dataP.error) {
            const extraerId = (campo) => {
              if (!campo) return "";
              // Si es un objeto, intentamos sacar su ID de las formas habituales en Mongo/Flask
              if (typeof campo === "object") {
                return String(campo.id || campo._id?.$oid || campo._id || "");
              }
              // Si ya es un texto (string), lo devolvemos tal cual
              return String(campo);
            };

            const idAlumno = extraerId(dataP.alumno);
            const idEmpresa = extraerId(dataP.empresa);

            // Formatear fechas para que el input type="date" las entienda (YYYY-MM-DD)
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
      const url = isEditing
        ? `http://127.0.0.1:5000/api/practica/practicas/${id}`
        : "http://127.0.0.1:5000/api/practica/practicas";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
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
      const response = await fetch(
        `http://127.0.0.1:5000/api/practica/practicas/${id}`,
        { method: "DELETE" },
      );
      if (response.ok) {
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
