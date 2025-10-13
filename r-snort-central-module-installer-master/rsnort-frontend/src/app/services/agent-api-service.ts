import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgentService } from './agent.service';

@Injectable({ providedIn: 'root' })
export class AgentApiService {
  constructor(private http: HttpClient, private agentSrv: AgentService) { }

  private get baseUrl(): string {
    const ip = this.agentSrv.current?.ip ?? '127.0.0.1';
    return `http://${ip}:9000`;
  }

  getStatus() {
    return this.http.get<{ agent_id: string; snort_running: boolean }>(`${this.baseUrl}/status`);
  }

  restartSnort() {
    return this.http.post<{ status: string }>(`${this.baseUrl}/restart`, {});
  }

  listArchivedFiles() {
    return this.http.get<string[]>(`${this.baseUrl}/archived-files`);
  }

  downloadFile(file: string) {
    return this.http.get(`${this.baseUrl}/archived-files/${file}`, {
      responseType: 'blob'
    });
  }

  getLastAlert() {
    return this.http.get<any>(`${this.baseUrl}/alerts/last`);
  }

  getAllAgentsStatuses(agents: { id: string; ip: string }[]) {
    return Promise.all(
      agents.map(agent =>
        this.http.get<any>(`http://${agent.ip}:9000/services/status`)
          .toPromise()
          .then(statuses => ({
            id: agent.id,
            ip: agent.ip,
            statuses,
          }))
          .catch(() => ({
            id: agent.id,
            ip: agent.ip,
            statuses: null,
          }))
      )
    );
  }

  getLastAlertFrom(ip: string) {
    return this.http.get<any>(`http://${ip}:9000/alerts/last`);
  }

  restartService(ip: string, service: string) {
    return this.http.post<{ status: string }>(
      `http://${ip}:9000/services/${service}/restart`,
      {}
    );
  }

  getGrafanaDashboardUid(): Promise<string> {
    return this.http
      .get<{ url?: string }>(`${this.baseUrl}/grafana/dashboard-url`)
      .toPromise()
      .then(res => {
        if (!res?.url) return '';
        const match = res.url.match(/\/d\/([^/]+)/);
        return match ? match[1] : '';
      })
      .catch(() => '');
  }

}
