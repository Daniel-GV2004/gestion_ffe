import { useState, useEffect } from 'react';
import { Table, ScrollArea, Loader, Center, Title, Text, Container } from '@mantine/core';

export default function Practicas() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/practica/datos-excel')
      .then((res) => res.json())
      .then((data) => {
        setDatos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando practicas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader size="xl" />
      </Center>
    );
  }

  const rows = datos.map((practica, index) => (
    <Table.Tr key={index}>
      {Object.values(practica).map((valor, i) => (
        <Table.Td key={i}>{valor.toString()}</Table.Td>
      ))}
    </Table.Tr>
  ));

  const ths = datos.length > 0 ? (
    <Table.Tr>
      {Object.keys(datos[0]).map((key) => (
        <Table.Th key={key} style={{ textTransform: 'capitalize' }}>
          {key.replace(/_/g, ' ')}
        </Table.Th>
      ))}
    </Table.Tr>
  ) : null;

  return (
    <Container size="xl">
      <Title order={2} mb="md">Listado de prácticas</Title>
      <Text c="dimmed" mb="xl">Datos sincronizados desde Google Sheets</Text>
      
      <ScrollArea shadow="xs" border="true">
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>
    </Container>
  );
}