import { NavLink as MantineNavLink, Stack } from "@mantine/core";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faGraduationCap,
  faBuilding,
  faBriefcase,
  faDatabase,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ toggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const datos = [
    { label: "Inicio", icon: faHouse, path: "/" },
    { label: "Usuarios", icon: faUsers, path: "/usuarios" },
    { label: "Alumnos", icon: faGraduationCap, path: "/alumnos" },
    { label: "Empresas", icon: faBuilding, path: "/empresas" },
    { label: "Practicas", icon: faBriefcase, path: "/practicas" },
    { label: "Repositorio", icon: faDatabase, path: "/repositorio" },
  ];

  return (
    <Stack gap="xs">
      {datos.map((item) => (
        <MantineNavLink
          key={item.label}
          active={
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path))
          }
          label={item.label}
          leftSection={<FontAwesomeIcon icon={item.icon} size="lg" />}
          onClick={() => {
            navigate(item.path);
            if (toggle) toggle();
          }}
          variant="filled"
        />
      ))}
    </Stack>
  );
}
