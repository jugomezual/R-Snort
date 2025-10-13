import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-agent-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-wrapper">
      <h2 class="dialog-title">
        <mat-icon>add_circle</mat-icon> New Agent
      </h2>

      <mat-form-field appearance="outline" class="input-field">
        <mat-label>Agent ID</mat-label>
        <input matInput [(ngModel)]="data.id" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="input-field">
        <mat-label>IP Address</mat-label>
        <input matInput [(ngModel)]="data.ip" />
      </mat-form-field>

      <div class="actions">
        <button mat-stroked-button color="warn" (click)="dialogRef.close()">Cancelar</button>
        <button mat-raised-button color="accent"
                [disabled]="!data.id || !data.ip"
                (click)="dialogRef.close(data)">
          Guardar
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {                                  
      font-family: 'JetBrains Mono', monospace;
    }

    /* --- contenedor principal --- */
    .dialog-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      padding: 2rem;
      width: 100%;
      max-width: 420px;
      background: #161a1f;                   /* fondo oscuro coherente */
      border-radius: 18px;
      box-shadow: 0 0 28px rgba(0, 225, 255, .25);
      box-sizing: border-box;
      overflow: hidden;                      /* evita cualquier scroll interno */
    }

    /* --- título --- */
    .dialog-title {
      display: flex;
      align-items: center;
      gap: .5rem;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--primary-neon, #00e1ff);
      margin: 0 0 .5rem;
    }

    /* --- campos --- */
    .input-field {
      width: 100%;
    }
    mat-form-field {
      background: rgba(255,255,255,.04);
      border-radius: 6px;
      --mdc-outlined-text-field-container-shape: 6px; /* bordes radios Material 3 */
    }
    input { font-size: 14px; }

    /* --- botones --- */
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: .5rem;
    }
    button { font-weight: 600; }

    .dialog-wrapper {
      background: #161a1f;      /* ⬅ fondo oscuro coherente */
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  background: transparent;
  box-sizing: border-box;
}

  `]
})
export class AddAgentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddAgentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string; ip: string }
  ) { }
}
