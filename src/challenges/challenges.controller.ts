import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { FindChallengeByPlayerDTO } from './dtos/find-challenge-by-player.dto';
import { Challenge } from './interfaces/challenge.interface';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    return this.challengesService.createChallenge(createChallengeDTO);
  }

  @Get()
  @UsePipes(ValidationPipe)
  async getChallenges(
    @Query() findChallengeByPlayerDTO: FindChallengeByPlayerDTO,
  ): Promise<Challenge[]> {
    return this.challengesService.getChallenges(findChallengeByPlayerDTO);
  }
}
