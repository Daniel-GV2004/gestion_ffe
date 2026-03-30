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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";

export default function EditPractica() {
  const navigate = useNavigate();

  const [opcionesAlumnos, setOpcionesAlumnos] = useState([]);
  const [opcionesEmpresas, setOpcionesEmpresas] = useState([]);

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
  const fetchOpciones = async () => {
    try {
      // --- ALUMNOS ---
      const resA = await fetch("http://127.0.0.1:5000/api/alumno/alumnos");
      const dataA = await resA.json();

      const arrayAlumnos = Array.isArray(dataA)
        ? dataA
        : dataA.alumnos || dataA.data || [];

      setOpcionesAlumnos(
        arrayAlumnos
          .map((a) => {
            // Extraemos el ID real de Mongo.
            // Manejamos si Flask lo envía como a._id.$oid, a._id normal, o a.id
            const mongoId = a._id?.$oid || a._id || a.id;

            return {
              value: String(mongoId), // <-- ESTO se enviará a tu backend (ej: "651a2b...")
              label:
                `${a.nombre || ""} ${a.apellidos || ""} - ${a.nif || ""}`.trim(), // <-- ESTO ve el usuario
            };
          })
          // Filtramos por si algún alumno viene corrupto sin ID de Mongo
          .filter(
            (opcion) => opcion.value !== "undefined" && opcion.value !== "null",
          ),
      );

      // --- EMPRESAS ---
      const resE = await fetch("http://127.0.0.1:5000/api/empresa/empresas");
      const dataE = await resE.json();

      const arrayEmpresas = Array.isArray(dataE)
        ? dataE
        : dataE.empresas || dataE.data || [];

      setOpcionesEmpresas(
        arrayEmpresas
          .map((e) => {
            const mongoId = e._id?.$oid || e._id || e.id;

            return {
              value: String(mongoId), // <-- El ID de Mongo de la empresa
              label:
                `${e.nombre_empresa || e.nombre || "Empresa sin nombre"} - ${e.cif || "Sin CIF"}`.trim(),
            };
          })
          .filter(
            (opcion) => opcion.value !== "undefined" && opcion.value !== "null",
          ),
      );
    } catch (error) {
      console.error("Error cargando opciones:", error);
    }
  };

  fetchOpciones();
}, []);

  const guardarPractica = async (values) => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/practica/practicas",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      if (response.ok) {
        navigate("/practicas");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Group justify="space-between" mb="lg">
        <Title order={2}>Asignar Nueva Práctica</Title>
        <Button variant="default" onClick={() => navigate("/practicas")}>
          Volver
        </Button>
      </Group>

      <Paper withBorder shadow="md" p="xl" radius="md">
        <form onSubmit={form.onSubmit(guardarPractica)}>
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

            <Button type="submit" fullWidth mt="md">
              Guardar Práctica
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
