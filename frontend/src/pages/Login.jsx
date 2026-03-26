import { TextInput, PasswordInput, Paper, Title, Container, Button, Text } from '@mantine/core';
import { useState } from 'react';

export default function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el backend dice que OK, pasamos el nombre al estado global de App.jsx
        onLogin(data.nombre);
      } else {
        // Mostramos el error que viene del backend (ej: "Usuario incorrecto")
        setError(data.message);
      }
    } catch {
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Panel de Acceso</Title>
      
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput 
            label="Usuario" 
            placeholder="Tu nombre de usuario" 
            required 
            value={nombre}
            onChange={(e) => setNombre(e.currentTarget.value)}
          />
          <PasswordInput 
            label="Contraseña" 
            placeholder="Tu contraseña" 
            required 
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button type="submit" fullWidth mt="xl" loading={loading}>
            Entrar
          </Button>
        </form>
      </Paper>
    </Container>
  );
}