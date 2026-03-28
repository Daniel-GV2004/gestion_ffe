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

export default function Usuarios() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsuarios = () => {
    setLoading(true);
    fetch("http://127.0.0.1:5000/api/usuario/usuarios")
      .then((res) => res.json())
      .then((data) => {
        setDatos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando usuarios:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  if (loading && datos.length === 0) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" color="blue" />
      </Center>
    );
  }

  const columnas = ["nombre"];

  const ths = (
    <Table.Tr>
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "uppercase" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = datos.map((usuario, index) => (
    <Table.Tr key={index}>
      {columnas.map((col) => (
        <Table.Td key={col}>
          {usuario[col] ? usuario[col].toString() : "-"}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestión de Usuarios</Title>
          <Text c="dimmed" size="sm">
            Usuarios con acceso al CRM
          </Text>
        </div>

        <Button
          leftSection={<IconUserPlus size={18} />}
          onClick={() => navigate("/usuarios/nuevo")}
          variant="filled"
          color="blue"
        >
          Nuevo Usuario
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
                  No hay usuarios registrados
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
