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

export default function ListPractica() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPracticas = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/api/practica/practicas")
      .then((res) => res.json())
      .then((data) => {
        setDatos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando practicas:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPracticas();
  }, []);

  if (loading && datos.length === 0) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

  const columnas = ["alumno_nif", "empresa_cif", "fecha_inicio", "fecha_fin"];

  const ths = (
    <Table.Tr>
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "uppercase" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = datos.map((practica, index) => (
    <Table.Tr key={index}>
      {columnas.map((col) => (
        <Table.Td key={col}>
          {practica[col] ? practica[col].toString() : "-"}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestión de Prácticas</Title>
        </div>

        <Button
          leftSection={<IconUserPlus size={18} />}
          onClick={() => navigate("/practicas/nueva")}
          variant="filled"
          color="blue"
        >
          Nueva Práctica
        </Button>
      </Group>

      <ScrollArea shadow="xs">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columnas.length} align="center">
                  No hay prácticas registradas
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
