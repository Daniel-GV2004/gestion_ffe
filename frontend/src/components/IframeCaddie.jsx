import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Paper,
  Center,
  Group,
  CopyButton,
  ActionIcon,
  Badge,
  Text,
  Loader,
} from "@mantine/core";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { getCodigoCentro } from "../API";

export default function IframeCaddie() {
  const [codigoCentro, setCodigoCentro] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCodigo = async () => {
      try {
        const response = await getCodigoCentro();

        if (response && response.data) {
          if (response.data.codigo) {
            setCodigoCentro(response.data.codigo);
          }
        }
      } catch (error) {
        console.error("Error al obtener el código del centro:", error);
        setCodigoCentro("Error");
      } finally {
        setCargando(false);
      }
    };

    fetchCodigo();
  }, []);

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="lg" ta="center">
        Plataforma Caddie Formación
      </Title>

      <Paper withBorder shadow="sm" p="sm" radius="md" mb="md">
        <Group position="center" spacing="xs">
          <Text fw={600} size="sm">
            Código del Centro:
          </Text>

          {cargando ? (
            <Loader size="sm" />
          ) : (
            <>
              <Badge color="blue" size="lg" variant="light">
                {codigoCentro}
              </Badge>
              <CopyButton value={codigoCentro} timeout={2000}>
                {({ copied, copy }) => (
                  <ActionIcon
                    color={copied ? "teal" : "blue"}
                    onClick={copy}
                    variant="subtle"
                  >
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </>
          )}
        </Group>
      </Paper>

      <Paper withBorder shadow="md" p="md" radius="md">
        <Center>
          <iframe
            src="https://caddieformacion.es/CF2024/"
            width="100%"
            height="800px"
            style={{
              border: "none",
              borderRadius: "8px",
            }}
            title="Caddie Formación"
            allowFullScreen
          ></iframe>
        </Center>
      </Paper>
    </Container>
  );
}
