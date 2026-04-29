import { Injectable, signal } from '@angular/core';
import { Cita } from '../models/cita.model';

const STORAGE_KEY = 'hospital-el-poli-citas';

@Injectable({ providedIn: 'root' })
export class CitaService {
  readonly citas = signal<Cita[]>(this.readStorage());

  getById(id: string): Cita | undefined {
    return this.citas().find((c) => c.id === id);
  }

  create(data: Omit<Cita, 'id'>): Cita {
    const cita: Cita = { ...data, id: crypto.randomUUID() };
    const next = [...this.citas(), cita];
    this.persist(next);
    return cita;
  }

  update(cita: Cita): void {
    const next = this.citas().map((c) => (c.id === cita.id ? cita : c));
    this.persist(next);
  }

  delete(id: string): void {
    const next = this.citas().filter((c) => c.id !== id);
    this.persist(next);
  }

  private readStorage(): Cita[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => {
        const c = item as Partial<Cita> & { id?: string };
        return {
          id: String(c.id ?? crypto.randomUUID()),
          nombre: String(c.nombre ?? ''),
          fecha: String(c.fecha ?? ''),
          correo: String(c.correo ?? ''),
          especialidad: String(c.especialidad ?? ''),
        };
      });
    } catch {
      return [];
    }
  }

  private persist(list: Cita[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this.citas.set(list);
  }
}
