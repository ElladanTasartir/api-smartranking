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
import { FindParamDTO } from './dtos/find-param.dto';
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
  @UsePipes(ValidationPipe)
  async getPlayersByEmail(
    @Param() findParamDTO: FindParamDTO,
  ): Promise<Player> {
    return this.playersService.getPlayerByEmail(findParamDTO);
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
    @Param() findParamDTO: FindParamDTO,
    @Body() editPlayerDTO: EditPlayerDTO,
  ): Promise<Player> {
    return this.playersService.updatePlayer(findParamDTO, editPlayerDTO);
  }

  @HttpCode(204)
  @UsePipes(ValidationPipe)
  @Delete('/:email')
  async deletePlayer(@Param() findParamDTO: FindParamDTO): Promise<void> {
    await this.playersService.deletePlayer(findParamDTO);
  }
}
