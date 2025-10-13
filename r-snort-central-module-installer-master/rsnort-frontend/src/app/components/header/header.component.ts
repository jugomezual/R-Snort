import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';
import { AgentService } from '../../services/agent.service';
import { AgentVerificationService } from '../../services/agent-verification.service';
import { AddAgentDialogComponent } from '../dialogs/add-agent-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private verifier = inject(AgentVerificationService);
  agentSrv = inject(AgentService);

  agents: { id: string; ip: string }[] = [];
  currentId = '';

  async ngOnInit() {
    await this.agentSrv.load();
    this.agents = this.agentSrv.getAll();
    this.currentId = this.agentSrv.current?.id || '';
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  switchAgent(id: string) {
    this.agentSrv.setCurrent(id);
    const segments = this.router.url.split('/');
    const currentTab = segments.pop() || 'alerts';
    this.router.navigate(['/agents', id, currentTab]);
    this.currentId = id;
  }

  getAgentIp(id: string): string {
    return this.agents.find(a => a.id === id)?.ip || '';
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddAgentDialogComponent, {
      width: 'auto',
      maxHeight: '90vh',
      data: { id: '', ip: '' },
      panelClass: 'transparent-dialog',
      backdropClass: 'blur-backdrop'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result?.id && result?.ip) {
        const { id, ip } = result;
        console.log(`[Header] Verify Agent ${id} (${ip})...`);

        const pingOk = await this.verifier.ping(ip);
        if (!pingOk) {
          alert(`❌ Cannot connect to ${ip}. Machine is offline.`);
          return;
        }

        const docsOk = await this.verifier.checkDocsEndpoint(ip);
        if (!docsOk) {
          alert(`⚠️ The /docs endpoint is not available on ${ip}. The agent may be misconfigured.`);
          return;
        }

        try {
          await this.agentSrv.add({ id, ip });
          this.agents = this.agentSrv.getAll();
          this.switchAgent(id);
          console.log(`[Header] Agent ${id} added successfully.`);
        } catch (e) {
          alert(`❌ Error adding agent: ${(e as any)?.error || e}`);
        }
      }
    });
  }

  playLogoSound(): void {
    const sounds = ['oink1.mp3', 'oink2.mp3', 'oink3.mp3'];
    const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
    const audio = new Audio(`assets/sounds/${randomSound}`);
    audio.play().catch(e => console.warn('Could not play logo sound:', e));
  }
}
