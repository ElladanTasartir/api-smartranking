import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindParamDTO } from 'src/common/dtos/find-param.dto';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { FindChallengeByPlayerDTO } from './dtos/find-challenge-by-player.dto';
import { insertMatchDTO } from './dtos/insert-match.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatusPipe } from './pipes/challenge-status.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Get()
  @UsePipes(ValidationPipe)
  async getChallenges(
    @Query() findChallengeByPlayerDTO: FindChallengeByPlayerDTO,
  ): Promise<Challenge[]> {
    return this.challengesService.getChallenges(findChallengeByPlayerDTO);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return this.challengesService.createChallenge(createChallengeDTO);
  }

  @Post('/:_id/match')
  @UsePipes(ValidationPipe)
  async insertMatch(
    @Param() findParamDTO: FindParamDTO,
    @Body() insertMatchDTO: insertMatchDTO,
  ): Promise<Challenge> {
    return this.challengesService.insertMatch(findParamDTO, insertMatchDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updateChallenge(
    @Param() findParamDTO: FindParamDTO,
    @Body(ChallengeStatusPipe) updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<Challenge> {
    return this.challengesService.updateChallenge(
      findParamDTO,
      updateChallengeDTO,
    );
  }

  @HttpCode(204)
  @Delete('/:_id')
  @UsePipes(ValidationPipe)
  async deleteChallenge(@Param() findParamDTO: FindParamDTO): Promise<void> {
    return this.challengesService.deleteChallenge(findParamDTO);
  }
}
