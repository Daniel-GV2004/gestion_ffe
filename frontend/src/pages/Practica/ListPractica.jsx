import { useState, useEffect } from "react";
import {
  Table,
  ScrollArea,
  Title,
  Container,
  Button,
  Group,
  ActionIcon,
  Loader,
  Center,
} from "@mantine/core";
import { IconPlus, IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function ListPractica() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Pantalla de carga mientras trae las prácticas
  if (loading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

  const columnas = ["Alumno", "Empresa", "Fecha de inicio", "Fecha de Fin"];

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Gestión de Prácticas</Title>
        <Button
          leftSection={<IconPlus size={18} />}
          onClick={() => navigate("/practicas/nueva")}
          color="blue"
        >
          Asignar Práctica
        </Button>
      </Group>

      <ScrollArea shadow="xs">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              {/* Columna vacía para el icono de editar */}
              <Table.Th style={{ width: 50 }}></Table.Th>
              {columnas.map((col) => (
                <Table.Th key={col}>{col}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {datos.length > 0 ? (
              datos.map((p, i) => {
                // Capturamos el ID de la práctica, venga como venga de Mongo
                const practicaId = p.id || p._id?.$oid || p._id;

                // Formateamos las fechas para que no salgan horas feas si las hubiera
                const formatFecha = (f) =>
                  f ? String(f).substring(0, 10) : "-";

                return (
                  <Table.Tr key={practicaId || i}>
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() =>
                          navigate(`/practicas/editar/${practicaId}`)
                        }
                      >
                        <IconEdit size={20} stroke={1.5} />
                      </ActionIcon>
                    </Table.Td>
                    {/* Ten en cuenta que si el backend devuelve un objeto para alumno, aquí mostramos el nombre */}
                    <Table.Td>{p.alumno_nombre || p.alumno}</Table.Td>
                    <Table.Td>{p.empresa_nombre || p.empresa}</Table.Td>
                    <Table.Td>{formatFecha(p.fecha_inicio)}</Table.Td>
                    <Table.Td>{formatFecha(p.fecha_fin)}</Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                {/* colSpan = número de columnas de datos + 1 (por la del lápiz) */}
                <Table.Td colSpan={columnas.length + 1} align="center">
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
