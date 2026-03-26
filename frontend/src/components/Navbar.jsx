import { NavLink, Stack } from '@mantine/core';
import { useState } from 'react';
// 1. IMPORTA el componente y los iconos específicos que necesites
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse, 
  faGraduationCap, // En lugar de faUserGraduation
  faBuilding, 
  faBriefcase, 
  faDatabase 
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ setSeccion }) {
  const [active, setActive] = useState(0);

  // 2. Define los iconos como objetos, no como strings
    const datos = [
    { label: 'Inicio', icon: faHouse },
    { label: 'Alumnos', icon: faGraduationCap }, // Actualizado aquí también
    { label: 'Empresas', icon: faBuilding },
    { label: 'Practicas', icon: faBriefcase },
    { label: 'Repositorio', icon: faDatabase },
    ];

  return (
    <Stack gap="xs">
      {datos.map((item, index) => (
        <NavLink
          key={item.label}
          active={index === active}
          label={item.label}
          // 3. Renderiza el icono usando leftSection
          leftSection={<FontAwesomeIcon icon={item.icon} size="lg" />}
          onClick={() => {
            setActive(index);
            setSeccion(item.label);
          }}
          variant="filled"
        />
      ))}
    </Stack>
  );
}