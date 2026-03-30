import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  Title,
  Container,
  Button,
  Group,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom"; // <-- Importamos useNavigate

export default function ListPractica() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- Inicializamos el hook

  const fetchData = async () => {
    setLoading(true);
    try {
      const resP = await fetch("http://127.0.0.1:5000/api/practica/practicas");
      const dataP = await resP.json();
      setDatos(Array.isArray(dataP) ? dataP : []);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columnas = ["alumno", "empresa", "fecha_inicio", "fecha_fin"];

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Gestión de Prácticas</Title>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => navigate("/practicas/nueva")} // <-- Redirigimos a la nueva ruta
        >
          Asignar Práctica
        </Button>
      </Group>

      <ScrollArea shadow="xs">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {columnas.map((col) => (
                <Table.Th key={col}>{col.replace(/_/g, " ")}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {datos.length > 0 ? (
              datos.map((p, i) => (
                <Table.Tr key={i}>
                  <Table.Td>{p.alumno_nombre || p.alumno}</Table.Td>
                  <Table.Td>{p.empresa_nombre || p.empresa}</Table.Td>
                  <Table.Td>{p.fecha_inicio}</Table.Td>
                  <Table.Td>{p.fecha_fin}</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columnas.length} align="center">
                  No hay datos
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
