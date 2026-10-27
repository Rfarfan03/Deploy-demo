import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../environments/environment';

interface Contact {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// [AWS Paso 5] La URL base sale del environment: localhost en desarrollo, ECS en producción.
const API = environment.apiUrl + '/api/contacts';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  template: `
    <main>
      <h1>Prisma + AWS RDS</h1>

      <form #f="ngForm" (ngSubmit)="save(f)">
        <input name="email" type="email" placeholder="Email" ngModel required />
        <input name="firstName" placeholder="Nombre" ngModel required />
        <input name="lastName" placeholder="Apellido" ngModel required />
        <input name="phone" type="tel" placeholder="Teléfono" ngModel required />
        <button [disabled]="f.invalid || saving()">{{ saving() ? 'Guardando…' : 'Guardar' }}</button>
      </form>

      @if (message()) {
        <p class="msg">{{ message() }}</p>
      }

      @if (contacts().length) {
        <h2>Registros en RDS</h2>
        <ul>
          @for (c of contacts(); track c.id) {
            <li>{{ c.firstName }} {{ c.lastName }} · {{ c.email }} · {{ c.phone }}</li>
          }
        </ul>
      }
    </main>
  `,
})
export class App {
  private http = inject(HttpClient);
  protected contacts = signal<Contact[]>([]);
  protected message = signal('');
  protected saving = signal(false);

  constructor() {
    this.load();
  }

  load() {
    this.http.get<Contact[]>(API).subscribe({
      next: (data) => this.contacts.set(data),
      error: () => this.message.set('No se pudo conectar con la API / base de datos'),
    });
  }

  save(form: { value: Omit<Contact, 'id'>; resetForm: () => void }) {
    this.saving.set(true);
    this.http.post<Contact>(API, form.value).subscribe({
      next: () => {
        this.message.set('✓ Guardado en RDS');
        form.resetForm();
        this.saving.set(false);
        this.load();
      },
      error: () => {
        this.message.set('Error al guardar');
        this.saving.set(false);
      },
    });
  }
}
