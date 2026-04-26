import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Group,
  SimpleGrid,
  Card,
  Text,
  Center,
  Modal,
  Button,
  Select,
  MultiSelect,
  Stack,
  Divider,
} from "@mantine/core";
import { IconFileDescription, IconFileExport } from "@tabler/icons-react";

export default function ListRepositorio({ nombreProfesor }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [docSeleccionado, setDocSeleccionado] = useState(null);
  const [opcionesAlumnos, setOpcionesAlumnos] = useState([]);
  const [opcionesEmpresas, setOpcionesEmpresas] = useState([]);

  const [alumnoId, setAlumnoId] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);

  const [loading, setLoading] = useState(false);

  const repositorio = [
    {
      // Funciona
      id: "A6- Solicitud Excepcional",
      nombre: "A6 - Solicitud Excepcional",
      esMulti: true,
    },
    {
      id: "Anexo I Modelo Acuerdo",
      nombre: "Anexo I - Modelo Acuerdo",
      soloEmpresa: true,
    },
    {
      id: "Anexo I.1 compensación beca",
      nombre: "Anexo I.1 - Compensación Beca",
      soloAlumno: true,
    },
    {
      id: "Anexo II Plan formativo",
      nombre: "Anexo II - Plan Formativo",
      soloAlumno: true,
    },
    {
      id: "Anexo III Relación de alumnado",
      nombre: "Anexo III - Relación Alumnado",
      esMulti: true,
    },
    {
      id: "Anexo IV Informe valorativo",
      nombre: "Anexo IV - Informe Valorativo",
      soloAlumno: true,
    },
    {
      id: "Anexo IX Solicitud Exención FFE",
      nombre: "Anexo IX - Solicitud Exención FFE",
      soloAlumno: true,
    },
    {
      id: "Anexo V Solicitud inicio FFE-actualizado",
      nombre: "Anexo V - Solicitud Inicio FFE",
      soloEmpresa: true,
    },
    {
      id: "Anexo VII Solicitud Extraordinaria",
      nombre: "Anexo VII - Solicitud Extraordinaria",
      soloAlumno: true,
      esMulti: true,
    },
    {
      id: "Anexo VIII Solicitud Modificación FFE",
      nombre: "Anexo VIII - Solicitud Modificación FFE",
    },
    {
      id: "Solicitud no realización",
      nombre: "Solicitud exención",
      soloAlumno: true,
    },
  ];

  useEffect(() => {
    const fetchOpciones = async () => {
      try {
        const resA = await fetch("http://127.0.0.1:5000/api/alumno/alumnos");
        const dataA = await resA.json();
        const arrayAlumnos = Array.isArray(dataA) ? dataA : dataA.alumnos || [];
        setOpcionesAlumnos(
          arrayAlumnos.map((a) => ({
            value: a.id || a._id?.$oid || a.nif,
            label:
              `${a.nombre || ""} ${a.apellidos || ""} - ${a.nif || ""}`.trim(),
          })),
        );

        const resE = await fetch("http://127.0.0.1:5000/api/empresa/empresas");
        const dataE = await resE.json();
        const arrayEmpresas = Array.isArray(dataE)
          ? dataE
          : dataE.empresas || [];
        setOpcionesEmpresas(
          arrayEmpresas.map((e) => ({
            value: e.id || e._id?.$oid || e.cif,
            label:
              `${e.nombre_empresa || e.nombre || "Empresa"} - ${e.cif || ""}`.trim(),
          })),
        );
      } catch (error) {
        console.error("Error cargando opciones:", error);
      }
    };
    fetchOpciones();
  }, []);

  const abrirModal = (doc) => {
    setDocSeleccionado(doc);
    // Resetear selecciones
    setAlumnoId(doc.esMulti ? [] : null);
    setEmpresaId(null);
    setModalAbierto(true);
  };

  const handleGenerar = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/repositorio/generar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            docId: docSeleccionado.id,
            // Enviamos ambos identificadores. El backend usará los que necesite.
            alumno_id: alumnoId,
            empresa_id: empresaId,
            es_multi: docSeleccionado.esMulti,
            usuario: {
              nombre: nombreProfesor,
            },
          }),
        },
      );

      if (!response.ok) throw new Error("Error al generar el documento");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${docSeleccionado.id.replace(/ /g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setModalAbierto(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const esExclusivoAlumno = docSeleccionado?.soloAlumno;
  const esExclusivoEmpresa = docSeleccionado?.soloEmpresa;
  const requiereAmbos = !esExclusivoAlumno && !esExclusivoEmpresa;

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl">
        Repositorio de plantillas
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
        {repositorio.map((doc) => (
          <Card
            key={doc.id}
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            onClick={() => abrirModal(doc)}
            style={{ cursor: "pointer" }}
          >
            <Center style={{ flexDirection: "column", gap: "10px" }}>
              <IconFileDescription size={40} color="#228be6" />
              <Text fw={500} ta="center">
                {doc.nombre}
              </Text>
            </Center>
          </Card>
        ))}
      </SimpleGrid>

      <Modal
        opened={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={<Text fw={700}>Generar: {docSeleccionado?.nombre}</Text>}
        size="md"
        centered
      >
        <Stack spacing="lg">
          {/* SECCIÓN EMPRESA: Se muestra si NO es exclusivo de Alumno */}
          {(requiereAmbos || esExclusivoEmpresa) && (
            <Select
              label="Seleccionar Empresa"
              placeholder="Busca la empresa..."
              data={opcionesEmpresas}
              searchable
              value={empresaId}
              onChange={setEmpresaId}
              nothingFoundMessage="No se encontró la empresa"
            />
          )}

          {requiereAmbos && <Divider label="y" labelPosition="center" />}

          {/* SECCIÓN ALUMNO: Se muestra si NO es exclusivo de Empresa */}
          {(requiereAmbos || esExclusivoAlumno) &&
            (docSeleccionado?.esMulti ? (
              <MultiSelect
                label="Seleccionar Alumnos"
                placeholder="Selecciona uno o varios alumnos..."
                data={opcionesAlumnos}
                searchable
                value={alumnoId || []}
                onChange={setAlumnoId}
                nothingFoundMessage="No se encontró el alumno"
              />
            ) : (
              <Select
                label="Seleccionar Alumno"
                placeholder="Busca el alumno..."
                data={opcionesAlumnos}
                searchable
                value={alumnoId}
                onChange={setAlumnoId}
                nothingFoundMessage="No se encontró el alumno"
              />
            ))}

          <Button
            fullWidth
            leftSection={<IconFileExport size={18} />}
            onClick={handleGenerar}
            loading={loading}
            disabled={
              ((requiereAmbos || esExclusivoEmpresa) && !empresaId) ||
              ((requiereAmbos || esExclusivoAlumno) &&
                (docSeleccionado?.esMulti ? alumnoId?.length === 0 : !alumnoId))
            }
          >
            Descargar Documento
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
}
