import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AgentService } from '../../services/agent.service';
import { GrafanaFrameComponent } from '../grafana-frame/grafana-frame.component';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';
import { HttpClient } from '@angular/common/http';
import { AgentApiService } from '../../services/agent-api-service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    GrafanaFrameComponent,
    SafeUrlPipe,
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {
  agentSrv = inject(AgentService);
  api = inject(AgentApiService);
  http = inject(HttpClient);

  uid: string = ''; // UID del dashboard

  async ngOnInit() {
    try {
      this.uid = await this.api.getGrafanaDashboardUid();
    } catch (error) {
      console.error('Error obtaining dashboard UID:', error);
    }
  }

  downloadCurrentAgentAlerts(): void {
    const agent = this.agentSrv.current;
    if (!agent) return;

    const url = `http://${agent.ip}:9000/download-alerts`;
    window.open(url, '_blank');
  }

  downloadAllAlerts(): void {
    const centralIp = this.agentSrv.getAll().find(a => a.id === 'central')?.ip;
    if (!centralIp) {
      console.error('No central agent found');
      return;
    }

    const url = `http://${centralIp}:9000/download-alerts`;
    window.open(url, '_blank');
  }
}
