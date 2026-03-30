import { useState } from "react";
import {
  Container,
  Title,
  Group,
  Button,
  TextInput,
  Paper,
  Text,
  Divider,
} from "@mantine/core";
import { IconArrowLeft, IconFileExport } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRepositorio() {
  const navigate = useNavigate();
  const { docId } = useParams(); // Obtenemos el ID de la plantilla desde la URL

  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);

  // Formateamos el ID para el título (ej: de "contrato_practicas" a "CONTRATO PRACTICAS")
  const tituloDocumento = docId
    ? docId.replace(/_/g, " ").toUpperCase()
    : "Documento";

  const handleGenerar = async () => {
    setLoading(true);
    // Aquí irá tu llamada fetch() a Flask
    console.log("Enviando a Flask:", { docId, nombre });

    // Simulamos un tiempo de carga del servidor
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <Container size="xl" py="xl">
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate("/repositorio")} // Vuelve al listado del repositorio
        >
          Volver
        </Button>
        <Title order={2}>Rellenar: {tituloDocumento}</Title>
      </Group>

      {/* Formulario de entrada de datos */}
      <Paper withBorder shadow="sm" p="md" mb="xl" radius="md">
        <Group align="flex-end">
          <TextInput
            label="Nombre del Alumno / Empresa"
            placeholder="Ej: Juan Pérez o Tech Corp S.L."
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Button
            leftSection={<IconFileExport size={18} />}
            onClick={handleGenerar}
            loading={loading}
          >
            Generar Word
          </Button>
        </Group>
      </Paper>

      {/* Zona de Previsualización */}
      <Title order={4} mb="sm" c="dimmed">
        Previsualización en tiempo real
      </Title>
      <Paper
        withBorder
        shadow="xs"
        p="xl"
        radius="md"
        style={{ minHeight: "400px", backgroundColor: "#f8f9fa" }}
      >
        <Text ta="center" size="xl" fw={700} mb="md">
          {tituloDocumento}
        </Text>
        <Divider my="sm" />
        <Text mt="md" size="lg" lh={1.8}>
          Por medio de la presente, se certifica que el/la alumno/a o entidad
          <Text span fw={700} c="blue" mx="xs">
            {nombre || "[ Nombre aparecerá aquí ]"}
          </Text>
          ha cumplido con todos los requisitos establecidos para este trámite en
          nuestro sistema.
        </Text>
      </Paper>
    </Container>
  );
}
