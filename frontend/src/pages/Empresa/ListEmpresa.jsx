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
  ActionIcon, // Añadido para el botón
} from "@mantine/core";
import { IconBuildingPlus, IconEdit } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getEmpresas } from "../../api";

export default function ListEmpresa() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEmpresas()
      .then(async (res) => {
        if (res && res.ok) {
          const data = await res.json();
          setDatos(Array.isArray(data) ? data : []);
        } else {
          setDatos([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando empresas:", err);
      })
      .finally(() => {
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

  // CABECERA DE LA TABLA
  const ths = (
    <Table.Tr>
      <Table.Th style={{ width: 50 }}></Table.Th>{" "}
      {/* Espacio para el botón de editar */}
      {columnas.map((col) => (
        <Table.Th key={col} style={{ textTransform: "capitalize" }}>
          {col.replace(/_/g, " ")}
        </Table.Th>
      ))}
    </Table.Tr>
  );

  // FILAS DE LA TABLA
  const rows = datos.map((empresa) => {
    // Rescatamos el ID de la empresa
    const empresaId = empresa.id || empresa._id?.$oid || empresa._id;

    return (
      <Table.Tr key={empresaId || empresa.cif}>
        {/* Celda del botón Editar */}
        <Table.Td>
          <ActionIcon
            variant="subtle"
            color="blue"
            onClick={() => navigate(`/empresas/editar/${empresaId}`)}
          >
            <IconEdit size={20} stroke={1.5} />
          </ActionIcon>
        </Table.Td>

        {/* Celdas de datos */}
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

      <ScrollArea shadow="xs">
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
