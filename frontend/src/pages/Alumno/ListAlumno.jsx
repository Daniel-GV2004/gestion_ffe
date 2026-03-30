import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  Loader,
  Center,
  Title,
  Text,
  Container,
  Button,
  Group,
} from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function Alumnos() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/alumno/alumnos")
      .then((res) => res.json())
      .then((data) => {
        setDatos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando alumnos:", err);
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
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "uppercase" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = datos.map((alumno) => (
    <Table.Tr key={alumno.nif}>
      {columnas.map((col) => (
        <Table.Td key={col}>
          {alumno[col] ? alumno[col].toString() : "-"}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestión de Alumnos</Title>
        </div>

        {/* Botón para ir al formulario */}
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
                <Table.Td colSpan={columnas.length} align="center">
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
