export interface Cita {
  id: string;
  nombre: string;
  fecha: string;
  correo: string;
  /** Especialidad o motivo (opcional, enriquece el CRUD) */
  especialidad: string;
}
