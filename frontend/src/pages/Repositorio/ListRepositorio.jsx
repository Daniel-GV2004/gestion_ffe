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
  FileInput,
} from "@mantine/core";
import {
  IconFileDescription,
  IconFileExport,
  IconUpload,
} from "@tabler/icons-react";
import IframeCaddie from "../../components/IframeCaddie";
import {
  getAlumnos,
  getEmpresas,
  getPracticas,
  generarDocumento,
} from "../../api";

export default function ListRepositorio({ nombreProfesor }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [docSeleccionado, setDocSeleccionado] = useState(null);

  const [opcionesAlumnos, setOpcionesAlumnos] = useState([]);
  const [opcionesEmpresas, setOpcionesEmpresas] = useState([]);
  const [opcionesPracticas, setOpcionesPracticas] = useState([]);

  const [alumnoId, setAlumnoId] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const [practicaId, setPracticaId] = useState(null);
  const [archivoPlantilla, setArchivoPlantilla] = useState(null);

  const [loading, setLoading] = useState(false);

  const repositorio = [
    {
      id: "A6- Solicitud Excepcional",
      nombre: "A6 - Solicitud Excepcional",
      reqAlumno: true,
      reqEmpresa: false,
      reqPractica: false,
      esMulti: true,
    },
    {
      id: "Anexo I Modelo Acuerdo",
      nombre: "Anexo I - Modelo Acuerdo",
      reqAlumno: false,
      reqEmpresa: true,
      reqPractica: false,
    },
    {
      id: "Anexo I.1 compensación beca",
      nombre: "Anexo I.1 - Compensación Beca",
      reqAlumno: false,
      reqEmpresa: false,
      reqPractica: true,
    },
    {
      id: "Anexo II Plan formativo",
      nombre: "Anexo II - Plan Formativo",
      reqAlumno: false,
      reqEmpresa: false,
      reqPractica: true,
      reqArchivo: true,
    },
    {
      id: "Anexo III Relación de alumnado",
      nombre: "Anexo III - Relación Alumnado",
      reqAlumno: true,
      reqEmpresa: true,
      reqPractica: false,
      esMulti: true,
    },
    {
      id: "Anexo IV Informe valorativo",
      nombre: "Anexo IV - Informe Valorativo",
      reqAlumno: false,
      reqEmpresa: false,
      reqPractica: true,
      reqArchivo: true,
    },
    {
      id: "Anexo IX Solicitud Exención FFE",
      nombre: "Anexo IX - Solicitud Exención FFE",
      reqAlumno: true,
      reqEmpresa: false,
      reqPractica: false,
    },
    {
      id: "Anexo V Solicitud inicio FFE-actualizado",
      nombre: "Anexo V - Solicitud Inicio FFE",
      reqAlumno: false,
      reqEmpresa: true,
      reqPractica: false,
    },
    {
      id: "Anexo VII Solicitud Extraordinaria",
      nombre: "Anexo VII - Solicitud Extraordinaria",
      reqAlumno: true,
      reqEmpresa: false,
      reqPractica: false,
      esMulti: true,
    },
    {
      id: "Anexo VIII Solicitud Modificación FFE",
      nombre: "Anexo VIII - Solicitud Modificación FFE",
      reqAlumno: false,
      reqEmpresa: false,
      reqPractica: true,
    },
    {
      id: "Solicitud no realización",
      nombre: "Solicitud exención",
      reqAlumno: true,
      reqEmpresa: false,
      reqPractica: false,
    },
    {
      id: "Caddie",
      nombre: "Formulario Caddie",
      reqAlumno: false,
      reqEmpresa: false,
      reqPractica: false,
    },
  ];

  useEffect(() => {
    const extraerId = (item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (item.$oid) return String(item.$oid);
      if (item._id?.$oid) return String(item._id.$oid);
      return String(item.id || item._id || item);
    };

    const fetchOpciones = async () => {
      try {
        const [resA, resE, resP] = await Promise.all([
          getAlumnos(),
          getEmpresas(),
          getPracticas(),
        ]);

        const dataA = await resA.json();
        const dataE = await resE.json();
        const dataP = await resP.json();

        const arrayAlumnos = Array.isArray(dataA) ? dataA : dataA.alumnos || [];
        setOpcionesAlumnos(
          arrayAlumnos.map((a) => ({
            value: extraerId(a),
            label:
              `${a.nombre || ""} ${a.apellidos || ""} - ${a.nif || ""}`.trim(),
          })),
        );

        const arrayEmpresas = Array.isArray(dataE)
          ? dataE
          : dataE.empresas || [];
        setOpcionesEmpresas(
          arrayEmpresas.map((e) => ({
            value: extraerId(e),
            label:
              `${e.nombre_empresa || e.nombre || "Empresa"} - ${e.cif || ""}`.trim(),
          })),
        );

        const arrayPracticas = Array.isArray(dataP)
          ? dataP
          : dataP.practicas || [];
        setOpcionesPracticas(
          arrayPracticas.map((p) => ({
            value: extraerId(p),
            label: `${p.alumno || "Sin Alumno"} - ${p.empresa || "Sin Empresa"}`,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchOpciones();
  }, []);

  const abrirModal = (doc) => {
    setDocSeleccionado(doc);
    setAlumnoId(doc.esMulti ? [] : null);
    setEmpresaId(null);
    setPracticaId(null);
    setArchivoPlantilla(null);
    setModalAbierto(true);
  };

  const handleGenerar = async () => {
    setLoading(true);
    try {
      let bodyData;
      const isFormData = !!docSeleccionado.reqArchivo;

      if (isFormData) {
        const formData = new FormData();
        formData.append("file", archivoPlantilla);
        formData.append("docId", docSeleccionado.id);
        formData.append("usuario_nombre", nombreProfesor);
        if (alumnoId) formData.append("alumno_id", JSON.stringify(alumnoId));
        if (empresaId) formData.append("empresa_id", empresaId);
        if (practicaId) formData.append("practicaId", practicaId);
        formData.append("es_multi", docSeleccionado.esMulti ? "true" : "false");
        bodyData = formData;
      } else {
        bodyData = JSON.stringify({
          docId: docSeleccionado.id,
          alumno_id: alumnoId,
          empresa_id: empresaId,
          practicaId: practicaId,
          es_multi: docSeleccionado.esMulti,
          usuario: { nombre: nombreProfesor },
        });
      }

      const response = await generarDocumento(bodyData, isFormData);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Error al generar el documento");
      }

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

  const showCaddie = docSeleccionado?.id === "Caddie";

  const faltanDatos = () => {
    if (!docSeleccionado) return true;
    if (docSeleccionado.reqArchivo && !archivoPlantilla) return true;
    if (docSeleccionado.reqEmpresa && !empresaId) return true;
    if (docSeleccionado.reqPractica && !practicaId) return true;
    if (docSeleccionado.reqAlumno) {
      if (docSeleccionado.esMulti) return !alumnoId || alumnoId.length === 0;
      return !alumnoId;
    }
    return false;
  };

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
        size={showCaddie ? "xl" : "md"}
        centered
      >
        {showCaddie ? (
          <IframeCaddie />
        ) : (
          <Stack spacing="lg">
            {docSeleccionado?.reqArchivo && (
              <>
                <FileInput
                  label="Plantilla de Word Oficial (.docx)"
                  placeholder="Sube el archivo de la Junta..."
                  required
                  withAsterisk
                  accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  leftSection={<IconUpload size={16} />}
                  value={archivoPlantilla}
                  onChange={setArchivoPlantilla}
                />
                <Divider />
              </>
            )}

            {docSeleccionado?.reqEmpresa && (
              <Select
                label="Seleccionar Empresa"
                placeholder="Busca la empresa..."
                data={opcionesEmpresas}
                searchable
                value={empresaId}
                onChange={setEmpresaId}
              />
            )}

            {docSeleccionado?.reqPractica && (
              <Select
                label="Seleccionar Práctica / Acuerdo"
                placeholder="Busca la práctica..."
                data={opcionesPracticas}
                searchable
                value={practicaId}
                onChange={setPracticaId}
              />
            )}

            {docSeleccionado?.reqAlumno &&
              (docSeleccionado.esMulti ? (
                <MultiSelect
                  label="Seleccionar Alumnos"
                  placeholder="Selecciona uno o varios..."
                  data={opcionesAlumnos}
                  searchable
                  value={alumnoId || []}
                  onChange={setAlumnoId}
                />
              ) : (
                <Select
                  label="Seleccionar Alumno"
                  placeholder="Busca el alumno..."
                  data={opcionesAlumnos}
                  searchable
                  value={alumnoId}
                  onChange={setAlumnoId}
                />
              ))}

            <Button
              fullWidth
              leftSection={<IconFileExport size={18} />}
              onClick={handleGenerar}
              loading={loading}
              disabled={faltanDatos()}
            >
              {docSeleccionado?.reqArchivo
                ? "Rellenar y Descargar"
                : "Generar Documento"}
            </Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
