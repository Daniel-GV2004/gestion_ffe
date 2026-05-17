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
  ActionIcon,
} from "@mantine/core";
import { IconUserPlus, IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getUsuarios } from "../../api";

export default function Usuarios() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await getUsuarios();
      if (res && res.ok) {
        const data = await res.json();
        setDatos(Array.isArray(data) ? data : []);
      } else {
        setDatos([]);
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    } finally {
      setLoading(false);
    }
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
      <Table.Th style={{ width: 50 }}></Table.Th>
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "uppercase" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = datos.map((usuario, index) => {
    const userId = usuario._id?.$oid || usuario._id || usuario.id;

    return (
      <Table.Tr key={userId || index}>
        <Table.Td>
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => navigate(`/usuarios/editar/${userId}`)}
          >
            <IconEdit size={20} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
        {columnas.map((col) => (
          <Table.Td key={col}>
            {usuario[col] ? usuario[col].toString() : "-"}
          </Table.Td>
        ))}
      </Table.Tr>
    );
  });

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
                <Table.Td colSpan={columnas.length + 1} align="center">
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
