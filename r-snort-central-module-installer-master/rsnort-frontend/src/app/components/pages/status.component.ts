import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { AgentApiService } from '../../services/agent-api-service';
import { AgentService } from '../../services/agent.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-status',
  standalone: true,
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    SafeUrlPipe,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule
  ],
})
export class StatusComponent implements OnInit, OnDestroy {
  agentSrv = inject(AgentService);
  api = inject(AgentApiService);

  uid: string = '';
  status?: { agent_id: string; snort_running: boolean };
  lastAlert?: any;
  archived: string[] = [];
  selectedFile = '';
  loading = false;

  private sub?: Subscription;
  private intervalId?: ReturnType<typeof setInterval>;
  private allAgentsInterval?: ReturnType<typeof setInterval>;

  agentStates: {
    id: string;
    ip: string;
    statuses: { [k: string]: string } | null;
    lastAlert?: { msg: string; timestamp: string };
  }[] = [];

  loadingServices: Record<string, Record<string, boolean>> = {};

  async ngOnInit() {
    try {
      this.uid = await this.api.getGrafanaDashboardUid();
    } catch (error) {
      console.error('Error obtaining dashboard UID:', error);
    }

    this.sub = this.agentSrv.current$.subscribe(agent => {
      if (agent) {
        this.refreshStatus();
        this.loadArchived();
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.refreshStatus(), 5000);
      }
    });

    this.refreshAllAgentsStates();
    this.allAgentsInterval = setInterval(() => {
      this.refreshAllAgentsStates();
    }, 5000);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.allAgentsInterval) clearInterval(this.allAgentsInterval);
  }

  refreshStatus() {
    this.api.getStatus().subscribe({
      next: s => this.status = s,
      error: () => this.status = undefined
    });

    this.api.getLastAlert().subscribe({
      next: a => this.lastAlert = a,
      error: () => this.lastAlert = undefined
    });
  }

  loadArchived() {
    this.api.listArchivedFiles().subscribe(files => {
      this.archived = files;
    });
  }

  restartSnort() {
    this.loading = true;
    this.api.restartSnort().subscribe({
      next: () => {
        this.refreshStatus();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  download(name: string) {
    this.api.downloadFile(name).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  get ip(): string {
    return this.agentSrv.current?.ip ?? '127.0.0.1';
  }

  get tempPanelUrl(): string {
    return `http://${this.ip}:3000/d-solo/${this.uid}/snort-ids-ips-dashboard?orgId=1&panelId=29&refresh=1m`;
  }

  get sysPanelUrl(): string {
    return `http://${this.ip}:3000/d-solo/${this.uid}/snort-ids-ips-dashboard?orgId=1&panelId=28&refresh=1m`;
  }

  async refreshAllAgentsStates() {
    const agents = this.agentSrv.getAll();
    const data = await this.api.getAllAgentsStatuses(agents);
    const enriched = await Promise.all(
      data.map(async agent => {
        try {
          const lastAlert = await this.api.getLastAlertFrom(agent.ip).toPromise();
          return { ...agent, lastAlert };
        } catch {
          return { ...agent, lastAlert: undefined };
        }
      })
    );
    this.agentStates = enriched;

    enriched.forEach(agent => {
      if (!this.loadingServices[agent.id]) {
        this.loadingServices[agent.id] = {
          snort: false,
          ingest: false,
          metrics: false
        };
      }
    });
  }

  restartAgentService(agentId: string, ip: string, service: string) {
    this.loadingServices[agentId][service] = true;
    this.api.restartService(ip, service).subscribe({
      next: () => {
        this.refreshAllAgentsStates();
        this.loadingServices[agentId][service] = false;
      },
      error: () => {
        this.loadingServices[agentId][service] = false;
      }
    });
  }

  confirmDelete(id: string): void {
    const name = id;
    const paso1 = confirm(`🗑 Are you sure you want to delete the agent "${name}"?\n\nThis action will remove its entry from the system.`);
    if (!paso1) return;

    const paso2 = confirm(`⚠️ Final confirmation:\n\nAre you COMPLETELY sure you want to delete "${name}"?`);
    if (!paso2) return;

    this.agentSrv.remove(id).then(() => {
      alert(`✅ Agent "${name}" successfully removed.`);
      this.refreshAllAgentsStates();

      // 🔄 Force reload agents in the service (and global notification)
      this.agentSrv.load().then(() => {
        this.agentSrv.setCurrent('central'); // optional: return to central after deletion
      });

    }).catch(err => {
      const msg = err?.error || err;
      if (msg.includes('central')) {
        alert(`⚠️ The central module cannot be deleted.`);
      } else {
        alert(`❌ Error deleting agent "${name}": ${msg}`);
      }
    });
  }
}
