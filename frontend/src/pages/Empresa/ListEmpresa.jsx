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
import { IconBuildingPlus, IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getEmpresas } from "../../API";

export default function ListEmpresa() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEmpresas()
      .then((res) => {
        const data = res.data;
        setDatos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error cargando empresas:", err);
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

  const columnas = [
    "cif",
    "nombre_empresa",
    "email",
    "telefono",
    "nombre_contacto",
  ];

  const ths = (
    <Table.Tr>
      <Table.Th style={{ width: 50 }}></Table.Th>
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "capitalize" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  const rows = datos.map((empresa) => {
    const empresaId = empresa.id || empresa._id?.$oid || empresa._id;

    return (
      <Table.Tr key={empresaId || empresa.cif}>
        <Table.Td>
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => navigate(`/empresas/editar/${empresaId}`)}
          >
            <IconEdit size={20} stroke={1.5} />
          </ActionIcon>
        </Table.Td>

        {columnas.map((col) => (
          <Table.Td key={col}>
            {empresa[col] ? empresa[col].toString() : "-"}
          </Table.Td>
        ))}
      </Table.Tr>
    );
  });

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

      <ScrollArea>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>
            {rows.length > 0 ? (
              rows
            ) : (
              <Table.Tr>
                <Table.Td colSpan={columnas.length + 1} align="center">
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
