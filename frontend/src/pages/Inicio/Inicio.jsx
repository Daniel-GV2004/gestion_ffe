import React, { useState, useEffect } from "react";
import {
  Title,
  Text,
  Container,
  Card,
  Grid,
  Button,
  Group,
  Modal,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import "@mantine/dates/styles.css";
import { getAgendas, postAgenda, updateAgenda, deleteAgenda } from "../../API";

const Inicio = ({ user }) => {
  const [eventos, setEventos] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    fecha: null,
    fecha_fin: null,
  });

  const cargarEventos = async () => {
    try {
      const res = await getAgendas();

      if (res && res.data) {
        const eventosFormateados = res.data.map((evento) => ({
          id: evento.id,
          title: evento.nombre,
          start: evento.fecha,
          end: evento.fecha_fin,
          extendedProps: {
            descripcion: evento.descripcion,
            usuario: evento.usuario,
          },
        }));
        setEventos(eventosFormateados);
      }
    } catch (err) {
      console.error("Error al cargar la agenda:", err);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  const handleDateClick = (arg) => {
    setIsEditing(false);
    setFormData({
      id: null,
      nombre: "",
      descripcion: "",
      fecha: arg.date,
      fecha_fin: new Date(arg.date.getTime() + 60 * 60 * 1000),
    });
    open();
  };

  const handleEventClick = (info) => {
    setIsEditing(true);
    setFormData({
      id: info.event.id,
      nombre: info.event.title,
      descripcion: info.event.extendedProps.descripcion || "",
      fecha: info.event.start,
      fecha_fin: info.event.end || info.event.start,
    });
    open();
  };

  const handleSave = async () => {
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      fecha: formData.fecha ? new Date(formData.fecha).toISOString() : null,
      fecha_fin: formData.fecha_fin
        ? new Date(formData.fecha_fin).toISOString()
        : null,
      usuario: user.name,
    };

    try {
      if (isEditing) {
        await updateAgenda(formData.id, payload);
      } else {
        await postAgenda(payload);
      }
      cargarEventos();
      close();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este evento?")) return;

    try {
      await deleteAgenda(formData.id);
      cargarEventos();
      close();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <Container size="xl" p={0}>
      <div style={{ marginBottom: "2rem" }}>
        <Title order={1}>Bienvenido, {user.name} 👋</Title>
        <Text size="lg" mt="sm" c="dimmed">
          Has iniciado sesión correctamente. Aquí tienes el resumen de tu
          agenda.
        </Text>
      </div>

      <Grid>
        <Grid.Col span={{ base: 12 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Mi Calendario</Title>
              <Button
                size="xs"
                color="blue"
                onClick={() => handleDateClick({ date: new Date() })}
              >
                + Nuevo Evento
              </Button>
            </Group>

            <div style={{ marginTop: "1rem" }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                locales={[esLocale]}
                locale="es"
                firstDay={1}
                events={eventos}
                dateClick={handleDateClick}
                eventClick={handleEventClick}
                height="700px"
              />
            </div>
          </Card>
        </Grid.Col>
      </Grid>

      <Modal
        opened={opened}
        onClose={close}
        title={isEditing ? "Editar Evento" : "Nuevo Evento"}
        centered
      >
        <TextInput
          label="Título del Evento"
          placeholder="Ej: Tutoría con Microsoft"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
          mb="md"
        />

        <Textarea
          label="Descripción"
          placeholder="Detalles de la reunión..."
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          mb="md"
        />

        <Group grow mb="md">
          <DateTimePicker
            label="Fecha Inicio"
            value={formData.fecha}
            onChange={(date) => setFormData({ ...formData, fecha: date })}
            required
          />
          <DateTimePicker
            label="Fecha Fin"
            value={formData.fecha_fin}
            onChange={(date) => setFormData({ ...formData, fecha_fin: date })}
          />
        </Group>

        <Group justify="flex-end" mt="xl">
          {isEditing && (
            <Button color="red" variant="outline" onClick={handleDelete}>
              Eliminar
            </Button>
          )}
          <Button variant="default" onClick={close}>
            Cancelar
          </Button>
          <Button
            color="blue"
            onClick={handleSave}
            disabled={!formData.nombre || !formData.fecha}
          >
            Guardar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default Inicio;
