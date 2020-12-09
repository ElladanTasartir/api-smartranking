import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.inteface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private readonly players: Player[] = [];

  async getPlayers(): Promise<Player[]> {
    return this.players;
  }

  async createOrUpdatePlayer(
    createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    const { email } = createPlayerDTO;

    const player = this.players.find((player) => player.email === email);

    if (player) {
      return this.update(player, createPlayerDTO);
    }

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

  private update(player: Player, createPlayerDTO: CreatePlayerDTO): Player {
    const { name } = createPlayerDTO;

    player.name = name;

    return player;
  }
}
