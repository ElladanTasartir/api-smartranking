import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from 'src/categories/categories.service';
import { FindParamDTO } from 'src/common/dtos/find-param.dto';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDTO } from './dtos/create-challenge.dto';
import { FindChallengeByPlayerDTO } from './dtos/find-challenge-by-player.dto';
import { UpdateChallengeDTO } from './dtos/update-challenge.dto';
import { ChallengeStatus } from './enums/challenge-status.enum';
import { Challenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getChallenges(
    findChallengeByPlayerDTO: FindChallengeByPlayerDTO,
  ): Promise<Challenge[]> {
    if (findChallengeByPlayerDTO._id) {
      return this.getChallengesByPlayerId(findChallengeByPlayerDTO);
    }

    return this.challengeModel
      .find()
      .populate(['players', 'challenger', 'match']);
  }

  async getChallengesByPlayerId(
    findChallengeByPlayerDTO: FindChallengeByPlayerDTO,
  ): Promise<Challenge[]> {
    const player = await this.playersService.getPlayerById(
      findChallengeByPlayerDTO,
    );

    return this.challengeModel
      .find()
      .where('players')
      .in([player])
      .populate(['players', 'challenger', 'match']);
  }

  async getChallengeById(findParamDTO: FindParamDTO): Promise<Challenge> {
    const { _id } = findParamDTO;

    const challenge = await this.challengeModel
      .findOne({ _id })
      .populate(['players', 'challenger', 'match']);

    if (!challenge) {
      throw new NotFoundException(`Challenge with ID "${_id}" does not exist`);
    }

    return challenge;
  }

  async createChallenge(
    createChallengeDTO: CreateChallengeDTO,
  ): Promise<Challenge> {
    const { players, challenger } = createChallengeDTO;

    await Promise.all(
      players.map(async (player) => {
        await this.playersService.getPlayerById({
          _id: player._id,
        });
      }),
    );

    const isChallenger = players.filter((player) => player._id === challenger);

    if (!isChallenger.length) {
      throw new BadRequestException(
        `Challenger "${challenger}" is not one of the players`,
      );
    }

    const { category } = await this.categoriesService.getCategoryByPlayerId({
      _id: challenger,
    });

    const createdChallenge = new this.challengeModel(createChallengeDTO);

    createdChallenge.category = category;
    createdChallenge.status = ChallengeStatus.PENDING;
    createdChallenge.requested_at = new Date();
    this.logger.log(`Created Challenge: ${JSON.stringify(createdChallenge)}`);

    return createdChallenge.save();
  }

  async updateChallenge(
    findParamDTO: FindParamDTO,
    updateChallengeDTO: UpdateChallengeDTO,
  ): Promise<Challenge> {
    const { date, status } = updateChallengeDTO;

    const foundChallenge = await this.getChallengeById(findParamDTO);

    foundChallenge.status = status;
    foundChallenge.date = date;

    return foundChallenge.save();
  }
}
