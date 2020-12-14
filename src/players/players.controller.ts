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
import { FindParamDTO } from '../shared/dtos/find-param.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(): Promise<Player[]> {
    return this.playersService.getPlayers();
  }

  @Get('/:_id')
  @UsePipes(ValidationPipe)
  async getPlayerById(@Param() findParamDTO: FindParamDTO): Promise<Player> {
    return this.playersService.getPlayerById(findParamDTO);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return this.playersService.createPlayer(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Param() findParamDTO: FindParamDTO,
    @Body() editPlayerDTO: EditPlayerDTO,
  ): Promise<Player> {
    return this.playersService.updatePlayer(findParamDTO, editPlayerDTO);
  }

  @HttpCode(204)
  @UsePipes(ValidationPipe)
  @Delete('/:_id')
  async deletePlayer(@Param() findParamDTO: FindParamDTO): Promise<void> {
    await this.playersService.deletePlayer(findParamDTO);
  }
}
