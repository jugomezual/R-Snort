import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private agentService: AgentService 
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  onSubmit() {
    if (!this.form.valid) { return; }

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: async () => {
        console.log('[Login] OK – loading agents...');
        try {
          await this.agentService.load();          // ✅ now with token
        } catch { /* optional: show Toast */ }

        this.router.navigate(['/overview']);
      },
      error: err => alert('Invalid credentials')
    });
  }


  // onSubmit() {
  //   if (this.form.valid) {
  //     const { email, password } = this.form.value;

  //     console.log('[LoginComponent] Enviando login:', email);
  //     this.auth.login(email, password).subscribe({
  //       next: () => {
  //         console.log('[LoginComponent] Login correcto. Redirigiendo...');
  //         this.router.navigate(['/overview']);
  //       },
  //       error: err => {
  //         console.error('[LoginComponent] Error en login:', err);
  //         alert('Login fallido: ' + err.message);
  //       }
  //     });
  //   }
  // }


  // onSubmit() {
  //   if (this.form.valid) {
  //     const { email, password } = this.form.value;

  //     this.auth.login(email, password).subscribe({
  //       next: () => this.router.navigate(['/overview']),
  //       error: err => alert('Login fallido: ' + err.message)
  //     });
  //   }
  // }
}
