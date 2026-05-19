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
import { getPracticas } from "../../API";

export default function ListPractica() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const resP = await getPracticas();
      if (resP && resP.data) {
        setDatos(Array.isArray(resP.data) ? resP.data : []);
      } else {
        setDatos([]);
      }
    } catch (err) {
      console.error(err);
      setDatos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: 50 }}></Table.Th>
              {columnas.map((col) => (
                <Table.Th key={col}>{col}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {datos.length > 0 ? (
              datos.map((p, i) => {
                const practicaId = p.id || p._id?.$oid || p._id;
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
                    <Table.Td>{p.alumno_nombre || p.alumno}</Table.Td>
                    <Table.Td>{p.empresa_nombre || p.empresa}</Table.Td>
                    <Table.Td>{formatFecha(p.fecha_inicio)}</Table.Td>
                    <Table.Td>{formatFecha(p.fecha_fin)}</Table.Td>
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
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
