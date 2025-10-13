import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AgentVerificationService {
  constructor(private http: HttpClient) {}

  ping(ip: string): Promise<boolean> {
    return fetch(`http://${ip}:9000/ping`, { mode: 'no-cors' })
      .then(() => true)
      .catch(() => false);
  }

  checkDocsEndpoint(ip: string): Promise<boolean> {
    return this.http.get(`http://${ip}:9000/docs`, { responseType: 'text' })
      .toPromise()
      .then(() => true)
      .catch(() => false);
  }
}
