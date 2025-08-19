import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class WsGateway {
  @WebSocketServer()
  server: Server;

  notifyBookingCreated(booking: any) {
    this.server.emit('booking.created', booking);
  }
}
