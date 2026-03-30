import {
  Container,
  Title,
  Group,
  SimpleGrid,
  Card,
  Text,
  Center,
} from "@mantine/core";
import { IconFileDescription } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export default function ListRepositorio() {
  const navigate = useNavigate();

  // Lista de plantillas disponibles en el repositorio
  const repositorio = [
    { id: "A6- Solicitud Excepcional", nombre: "A6 - Solicitud Excepcional" },
    { id: "Anexo I Modelo Acuerdo", nombre: "Anexo I - Modelo Acuerdo" },
    {
      id: "Anexo I.1 compensación beca",
      nombre: "Anexo I.1 - Compensación Beca",
    },
    { id: "Anexo II Plan formativo", nombre: "Anexo II - Plan Formativo" },
    {
      id: "Anexo III Relación de alumnado",
      nombre: "Anexo III - Relación Alumnado",
    },
    {
      id: "Anexo IV Informe valorativo",
      nombre: "Anexo IV - Informe Valorativo",
    },
    {
      id: "Anexo IX Solicitud Exención FFE",
      nombre: "Anexo IX - Solicitud Exención FFE",
    },
    {
      id: "Anexo V Solicitud inicio FFE-actualizado",
      nombre: "Anexo V - Solicitud Inicio FFE",
    },
    {
      id: "Anexo VII Solicitud Extraordinaria",
      nombre: "Anexo VII - Solicitud Extraordinaria",
    },
    {
      id: "Anexo VIII Solicitud Modificación FFE",
      nombre: "Anexo VIII - Solicitud Modificación FFE",
    },
    { id: "Solicitud no realización", nombre: "Solicitud no realización" },
  ];

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Repositorio de Plantillas</Title>
      </Group>

      {/* Rejilla responsiva de Mantine */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {repositorio.map((doc) => (
          <Card
            key={doc.id}
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
            onClick={() => navigate(`/repositorio/editar/${doc.id}`)}
          >
            <Center style={{ flexDirection: "column", gap: "10px" }}>
              <IconFileDescription size={40} color="#228be6" stroke={1.5} />
              <Text fw={500} size="lg" ta="center">
                {doc.nombre}
              </Text>
            </Center>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
