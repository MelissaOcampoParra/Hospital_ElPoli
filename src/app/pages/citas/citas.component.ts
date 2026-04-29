import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../services/cita.service';
import { Cita } from '../../models/cita.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css',
})
export class CitasComponent {
  nombre = '';
  fecha = '';
  correo = '';
  especialidad = '';

  editingId: string | null = null;
  formMessage = '';
  formMessageClass: 'mensaje-error' | 'mensaje-exito' | '' = '';

  constructor(protected readonly citaService: CitaService) {}

  startEdit(c: Cita): void {
    this.editingId = c.id;
    this.nombre = c.nombre;
    this.fecha = c.fecha;
    this.correo = c.correo;
    this.especialidad = c.especialidad;
    this.clearMessage();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.resetForm();
    this.clearMessage();
  }

  submit(): void {
    if (!this.nombre.trim()) {
      this.setError('⚠️ Por favor escribe el nombre completo.');
      return;
    }
    if (!this.fecha) {
      this.setError('⚠️ Por favor selecciona una fecha.');
      return;
    }
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaElegida = new Date(this.fecha + 'T00:00:00');
    if (fechaElegida < hoy) {
      this.setError('⚠️ La fecha no puede ser anterior a hoy.');
      return;
    }
    if (!this.correo.trim()) {
      this.setError('⚠️ Por favor escribe el correo electrónico.');
      return;
    }
    if (!this.especialidad.trim()) {
      this.setError('⚠️ Por favor indica la especialidad.');
      return;
    }

    const payload = {
      nombre: this.nombre.trim(),
      fecha: this.fecha,
      correo: this.correo.trim(),
      especialidad: this.especialidad.trim(),
    };

    if (this.editingId) {
      const existing = this.citaService.getById(this.editingId);
      if (!existing) {
        this.setError('⚠️ No se encontró la cita a actualizar.');
        return;
      }
      this.citaService.update({ ...existing, ...payload });
      this.setSuccess('✅ Cita actualizada correctamente.');
    } else {
      this.citaService.create(payload);
      this.setSuccess('✅ Cita registrada correctamente.');
    }
    this.editingId = null;
    this.resetForm();
  }

  remove(c: Cita): void {
    if (!confirm(`¿Eliminar la cita de ${c.nombre}?`)) {
      return;
    }
    this.citaService.delete(c.id);
    if (this.editingId === c.id) {
      this.cancelEdit();
    }
  }

  private resetForm(): void {
    this.nombre = '';
    this.fecha = '';
    this.correo = '';
    this.especialidad = '';
  }

  private clearMessage(): void {
    this.formMessage = '';
    this.formMessageClass = '';
  }

  private setError(msg: string): void {
    this.formMessage = msg;
    this.formMessageClass = 'mensaje-error';
  }

  private setSuccess(msg: string): void {
    this.formMessage = msg;
    this.formMessageClass = 'mensaje-exito';
  }
}
