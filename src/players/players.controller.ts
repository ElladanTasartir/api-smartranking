import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.inteface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player[] | Player> {
    return this.playersService.getPlayers(email);
  }

  @Post()
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return this.playersService.createOrUpdatePlayer(createPlayerDTO);
  }
}
