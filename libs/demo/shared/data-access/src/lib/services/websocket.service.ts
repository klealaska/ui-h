import { Injectable } from '@angular/core';
import { Game, Message } from '@ui-coe/demo/shared/util';
import { GameFacade } from '../+state/game.facade';
// import { environment } from '../../../../../../../apps/demo/zombie-dice/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  constructor(private gameFacade: GameFacade) {
    // if (!environment.production) {
    //   if (window['Cypress']) {
    //     window['WebsocketService'] = this;
    //   }
    // }
  }

  private ws: WebSocket;

  initConnection(token: string): void {
    this.ws = new WebSocket(token);

    this.ws.onopen = e => {
      console.log('websocket connected');
    };

    this.ws.onmessage = event => {
      const message = JSON.parse(event.data);
      this.gameFacade.processWebSocketMessage(message);
    };

    this.ws.onerror = error => {
      console.log('connection error: ' + error);
    };
  }

  processMessage(currentGame: Game, message: Message): Message {
    if (currentGame && message?.game?._id === currentGame?._id) {
      this.gameFacade.updateGameState(message.game);
      return message;
    }
    return null;
  }
}
