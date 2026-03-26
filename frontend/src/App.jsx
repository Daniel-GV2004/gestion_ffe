import { AppShell, Burger, Group, Title, Button, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Alumnos from './pages/Alumno';
import Empresas from './pages/Empresa';
import Practicas from './pages/Practica';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [seccion, setSeccion] = useState('Inicio');
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLogin={(nombre) => setUser({ name: nombre })} />;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Panel de Gestión</Title>
          </Group>
          <Button variant="subtle" color="red" onClick={() => setUser(null)}>
            Salir
          </Button>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar setSeccion={setSeccion} />
      </AppShell.Navbar>

      <AppShell.Main>
        {seccion === 'Inicio' && (
          <div>
            <Title order={1}>Bienvenido, {user.name} 👋</Title>
            <Text size="lg" mt="md" c="dimmed">
              Has iniciado sesión correctamente. Selecciona una opción en el menú lateral.
            </Text>
          </div>
        )}

        {seccion === 'Alumnos' && <Alumnos />}
        {seccion === 'Empresas' && <Empresas />}
        {seccion === 'Practicas' && <Practicas />}

        {seccion !== 'Inicio' && seccion !== 'Alumnos' && seccion !== 'Empresas' && seccion !== 'Practicas' && (
          <Title order={1}>{seccion}</Title>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;