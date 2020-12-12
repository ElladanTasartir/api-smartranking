import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { EditPlayerDTO } from './dtos/edit-player.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<Player[]> {
    return this.playersService.getPlayers();
  }

  @Get('/:email')
  async getPlayersByEmail(@Param('email') email: string): Promise<Player> {
    return this.playersService.getPlayerByEmail(email);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return this.playersService.createOrUpdatePlayer(createPlayerDTO);
  }

  @Put('/:email')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param('email') email: string,
    @Body() editPlayerDTO: EditPlayerDTO,
  ): Promise<Player> {
    return this.playersService.updatePlayer(email, editPlayerDTO);
  }

  @HttpCode(204)
  @Delete('/:email')
  async deletePlayer(@Param('email') email: string): Promise<void> {
    await this.playersService.deletePlayer(email);
  }
}
