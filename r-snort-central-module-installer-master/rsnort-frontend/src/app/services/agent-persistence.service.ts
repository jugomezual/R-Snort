import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/agent.model';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AgentPersistenceService {
  private baseUrl = 'http://localhost:8080/api/agents';

  constructor(private http: HttpClient) {}

  getAgents(): Promise<Agent[]> {
    return firstValueFrom(this.http.get<Agent[]>(this.baseUrl));
  }

  addAgent(agent: Agent): Promise<void> {
    return firstValueFrom(this.http.post<void>(this.baseUrl, agent));
  }
}
