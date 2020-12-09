import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.inteface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private readonly players: Player[] = [];

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return this.create(createPlayerDTO);
  }

  private create(createPlayerDTO: CreatePlayerDTO): Player {
    const { name, email, phoneNumber } = createPlayerDTO;

    const player: Player = {
      _id: uuid(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      position: 1,
      avatarUrl: 'http://github.com/ElladanTasartir.png',
    };
    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    this.players.push(player);
    return player;
  }
}
