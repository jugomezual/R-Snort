import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AgentService } from './agent.service';

export interface Alert {
  id: number;
  timestamp: string;
  proto: string;
  dir: string;
  srcAddr: string;
  srcPort: number;
  dstAddr: string;
  dstPort: number;
  msg: string;
  sid: number;
  gid: number;
  priority: number;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(
    private http: HttpClient,
    private agentService: AgentService
  ) {}

  getLatestAlerts(limit = 10, ip?: string): Observable<Alert[]> {
    const host = ip ?? this.agentService.current?.ip;
    if (!host) return of([]);

    const url = `/api/alerts/latest?limit=${limit}`;
    return this.http.get<Alert[]>(url);
  }
}
