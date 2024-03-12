import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { io, Socket } from 'socket.io-client';
import { PlaceFilter } from '../shared/type';

@Injectable({
  providedIn: 'root',
})
export class RecommendationsService {
  private socket: Socket;
  private readonly serverUrl = 'http://localhost:3000/'; // URL of your NestJS server

  constructor(private cookieService: CookieService) {
    this.socket = io(this.serverUrl);
  }

  requestRecommendations(options: Partial<PlaceFilter>) {
    if (this.cookieService.check('user_id')) {
      const userId = this.cookieService.get('user_id');
      this.socket.emit('requestRecommendations', { userId, options });
    }
  }

  onRecommendationsUpdate(callback: (recommendations: any) => void) {
    this.socket.on('updateRecommendations', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
