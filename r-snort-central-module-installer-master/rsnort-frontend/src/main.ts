import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './app/interceptors/jwt.interceptor';
import { APP_INITIALIZER } from '@angular/core';
import { AgentService } from './app/services/agent.service';

// Precarga de agentes con manejo de errores
export function preloadAgents(agentSrv: AgentService) {
  return () =>
    agentSrv.load().catch(err => {
      console.error('[APP_INITIALIZER] Error:', err);
      return Promise.resolve(); // evita bloqueo de la carga inicial
    });
}

bootstrapApplication(AppComponent, {
  providers: [
    // ✅ Activa los interceptores registrados en DI
    provideHttpClient(withInterceptorsFromDi()),

    // ✅ Proporciona el enrutamiento
    provideRouter(routes),

    // ✅ Precarga asíncrona de agentes
    {
      provide: APP_INITIALIZER,
      useFactory: preloadAgents,
      deps: [AgentService],
      multi: true
    },

    // ✅ Registra el JwtInterceptor como multi-provider
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
});
