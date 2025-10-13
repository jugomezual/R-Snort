import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AgentService } from '../../services/agent.service';

@Component({
  selector: 'app-rule-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './rule-list.component.html',
  styleUrls: ['./rule-list.component.css']
})
export class RuleListComponent implements OnInit {
  private http = inject(HttpClient);
  private agentSrv = inject(AgentService);
  private snackBar = inject(MatSnackBar);

  rules: any[] = [];
  loading = true;
  newRuleText = '';

  ngOnInit(): void {
    this.agentSrv.current$.subscribe(agent => {
      if (agent) this.fetchRules(agent.ip);
    });
  }

  private fetchRules(ip: string): void {
    this.loading = true;
    const url = `http://${ip}:9000/rules`;
    this.http.get<{ rules: any[] }>(url).subscribe({
      next: res => {
        this.rules = res.rules.filter(r => r.source === 'custom');
        this.loading = false;
      },
      error: err => {
        console.error('[RuleListComponent] Error al cargar reglas:', err);
        this.rules = [];
        this.loading = false;
      }
    });
  }

  addRule(): void {
    const agent = this.agentSrv.current;
    if (!agent || !this.newRuleText.trim()) return;

    const url = `http://${agent.ip}:9000/rules`;
    const body = { rule: this.newRuleText.trim() };

    this.http.post(url, body).subscribe({
      next: res => {
        this.snackBar.open(`✅ Rule added to "${agent.id}"`, 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.newRuleText = '';
        this.fetchRules(agent.ip);
      },
      error: err => {
        const msg = err?.error?.detail || 'Unknown error';
        this.snackBar.open(`❌ Error adding rule to "${agent.id}": ${msg}`, 'Close', {
          duration: 6000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  confirmDelete(sid: number): void {
    const agent = this.agentSrv.current;
    if (!agent) return;

    const confirmed = confirm(`Are you sure you want to delete the rule with SID ${sid} from agent "${agent.id}"?`);
    if (!confirmed) return;

    const url = `http://${agent.ip}:9000/rules/${sid}`;
    this.http.delete(url).subscribe({
      next: () => {
        this.snackBar.open(`🗑 Rule with SID ${sid} deleted from "${agent.id}"`, 'Close', {
          duration: 4000,
          panelClass: ['snackbar-success']
        });
        this.fetchRules(agent.ip);
      },
      error: err => {
        const msg = err?.error?.detail || 'Unknown error';
        this.snackBar.open(`❌ Error deleting rule from "${agent.id}": ${msg}`, 'Close', {
          duration: 6000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}
