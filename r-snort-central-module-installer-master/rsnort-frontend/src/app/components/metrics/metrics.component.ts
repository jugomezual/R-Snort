import { Component, OnInit, inject } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { GrafanaFrameComponent } from '../grafana-frame/grafana-frame.component';
import { AgentService }      from '../../services/agent.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector   : 'app-metrics',
  standalone : true,
  imports    : [CommonModule, GrafanaFrameComponent, MatProgressSpinnerModule],
  templateUrl: './metrics.component.html',
  styleUrls  : ['./metrics.component.css']
})
export class MetricsComponent {
  agentSrv = inject(AgentService);
}
