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
import { IconBuildingPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function ListEmpresa() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/empresa/empresas")
      .then((res) => res.json())
      .then((data) => {
        setDatos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando empresas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  const columnas = [
    "cif",
    "nombre_empresa",
    "email",
    "telefono",
    "nombre_contacto",
  ];

  const rows = datos.map((empresa, index) => (
    <Table.Tr key={index}>
      {columnas.map((col, i) => (
        <Table.Td key={i}>
          {empresa[col] ? empresa[col].toString() : "-"}
        </Table.Td>
      ))}
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "capitalize" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Gestión de Empresas</Title>
        </div>

        <Button
          leftSection={<IconBuildingPlus size={18} />}
          onClick={() => navigate("/empresas/nueva")}
          variant="filled"
          color="blue"
        >
          Nueva Empresa
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
                  No hay empresas registradas
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}
