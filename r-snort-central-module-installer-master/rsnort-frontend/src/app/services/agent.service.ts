import { Injectable, inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/agent.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private http = inject(HttpClient);
  private zone = inject(NgZone);
  private agents: Agent[] = [];

  private currentSubject = new BehaviorSubject<Agent | null>(null);
  current$ = this.currentSubject.asObservable();
  current: Agent | null = null;

  async load(): Promise<void> {
    console.log('[AgentService] Starting agent loading...');
    try {
      this.agents = await firstValueFrom(
        this.http.get<Agent[]>(`${environment.backendUrl}/api/agents`)
      );
      console.log('[AgentService] Agents loaded:', this.agents);
      if (this.agents.length) this.setCurrent(this.agents[0].id);
    } catch (e) {
      console.error('[AgentService] Error loading agents:', e);
    }
  }

  getAll(): Agent[] {
    return this.agents;
  }

  setCurrent(id: string) {
    const found = this.agents.find(a => a.id === id) ?? null;
    this.current = found;
    this.zone.run(() => this.currentSubject.next(found));
  }

  async add(agent: Agent): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.backendUrl}/api/agents`, agent)
      );
      this.agents.push(agent);
      console.log(`[AgentService] Agent added: ${agent.id}`);
    } catch (error) {
      console.error('[AgentService] Error adding agent:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await firstValueFrom(
        this.http.delete(`${environment.backendUrl}/api/agents/${id}`)
      );
      this.agents = this.agents.filter(a => a.id !== id);
      console.log(`[AgentService] Agent removed: ${id}`);
    } catch (e) {
      console.error('[AgentService] Error removing agent:', e);
      throw e;
    }
  }
}
