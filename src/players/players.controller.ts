import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.inteface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<Player[]> {
    return this.playersService.getPlayers();
  }

  @Post()
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return this.playersService.createOrUpdatePlayer(createPlayerDTO);
  }
}
