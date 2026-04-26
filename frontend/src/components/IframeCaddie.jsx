import { Container, Title, Paper, Center } from "@mantine/core";

export default function IframeCaddie() {
  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="lg" align="center">
        Plataforma Caddie Formación
      </Title>

      <Paper withBorder shadow="md" p="md" radius="md">
        <Center>
          {/* El iframe con la URL que has pedido */}
          <iframe
            src="https://caddieformacion.es/CF2024/"
            width="100%"
            height="800px" // Puedes ajustar la altura como prefieras
            style={{
              border: "none",
              borderRadius: "8px",
            }}
            title="Caddie Formación"
            allowFullScreen // Permite pantalla completa si la web lo soporta
          ></iframe>
        </Center>
      </Paper>
    </Container>
  );
}
