import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  Loader,
  Center,
  Title,
  Container,
  Button,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconUserPlus, IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getAlumnos } from "../../API";

export default function Alumnos() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAlumnos()
      .then((res) => {
        const data = res.data;
        setDatos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error cargando alumnos:", err);
        setDatos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

  const columnas = ["nif", "nombre", "apellidos", "email", "telefono", "nuss"];

  const ths = (
    <Table.Tr>
      <Table.Th style={{ width: 50 }}></Table.Th>
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "uppercase" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = datos.map((alumno) => {
    const alumnoId = alumno._id?.$oid || alumno._id || alumno.id;

    return (
      <Table.Tr key={alumnoId || alumno.nif}>
        <Table.Td>
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => navigate(`/alumnos/editar/${alumnoId}`)}
          >
            <IconEdit size={20} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
        {columnas.map((col) => (
          <Table.Td key={col}>
            {alumno[col] ? alumno[col].toString() : "-"}
          </Table.Td>
        ))}
      </Table.Tr>
    );
  });

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestión de Alumnos</Title>
        </div>

        <Button
          leftSection={<IconUserPlus size={18} />}
          onClick={() => navigate("/alumnos/nuevo")}
          variant="filled"
          color="blue"
        >
          Nuevo Alumno
        </Button>
      </Group>

      <ScrollArea
        h={500}
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Table withTableBorder withColumnBorders striped highlightOnHover>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columnas.length + 1} align="center">
                  No hay alumnos registrados
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
