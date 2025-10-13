import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'grafana-frame',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  template: `
    <iframe *ngIf="src"
            [src]="src | safeUrl"
            width="100%" height="260" frameborder="0" loading="lazy"></iframe>
  `,
})
export class GrafanaFrameComponent {
  /** ej. "/d-solo/ALgSiPiWk/snort-ids-ips-dashboard?orgId=1…panelId=14" */
  @Input({ required: true }) path!: string;
  @Input() ip = '';

  get src(): string | null {
    if (!this.ip) return null; // Evita URLs tipo http://:3000...
    const url = `http://${this.ip}:3000${this.path}`;
    console.debug('[GrafanaFrame] ⇒', url);
    return url;
  }
}
