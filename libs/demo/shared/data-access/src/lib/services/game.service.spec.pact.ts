import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { pactWith } from 'jest-pact';
import { Matchers } from '@pact-foundation/pact';

import { GameService } from './game.service';
import { ConfigService } from '@ui-coe/shared/util/services';
import { getGamesInLobbyResponse } from '@ui-coe/demo/shared/util';

pactWith(
  {
    consumer: 'demo-app',
    provider: 'GameService',
  },
  provider => {
    let gameService: GameService;

    const mockConfigService: Partial<ConfigService> = {
      get: jest.fn(() => provider.mockService.baseUrl),
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [GameService, { provide: ConfigService, useValue: mockConfigService }],
      });
      gameService = TestBed.inject(GameService);
    });

    describe('Get games in lobby', () => {
      beforeEach(() =>
        provider.addInteraction({
          state: 'Server is healthy',
          uponReceiving: 'A request for games in lobby',
          willRespondWith: {
            status: 200,
            body: Matchers.like(getGamesInLobbyResponse),
          },
          withRequest: {
            method: 'GET',
            path: '/api/game/games',
          },
        })
      );

      it('returns games in lobby', done => {
        gameService.getGamesInLobby().subscribe(res => {
          expect(res).toEqual(getGamesInLobbyResponse);
          done();
        });
      });
    });
  }
);
