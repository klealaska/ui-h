import {
  mockGame1,
  mockGame2,
  mockGameData,
  mockMessage,
  mockPlayer1,
} from '@ui-coe/demo/shared/util';
import { GameFacade } from '../+state/game.facade';
import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockGameFacade: any;
  let mockWebSocket: any;

  beforeEach(() => {
    mockGameFacade = {
      processWebSocketMessage: jest.fn(),
      updateGameState: jest.fn(),
    };

    mockWebSocket = {
      onopen: jest.fn(),
      onmessage: jest.fn(),
      onerror: jest.fn(),
    };

    (global.WebSocket as any) = jest.fn().mockImplementation(() => {
      return mockWebSocket;
    });

    service = new WebsocketService(mockGameFacade);
  });

  it('should call gameFacade.processWebSocketMessage on message event', () => {
    const data = JSON.stringify({ test: 'message' });
    service.initConnection('test_token');
    mockWebSocket.onmessage({ data });
    expect(mockGameFacade.processWebSocketMessage).toBeCalledWith({ test: 'message' });
  });

  it('should call gameFacade.updateGameState on valid message', () => {
    service.processMessage(mockGame1, mockMessage);
    expect(mockGameFacade.updateGameState).toBeCalledWith(mockMessage.game);
  });

  it('should not call gameFacade.updateGameState on invalid message', () => {
    service.processMessage(mockGame2, mockMessage);
    expect(mockGameFacade.updateGameState).not.toBeCalled();
  });
});
