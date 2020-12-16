import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { Player } from './interfaces/player.interface';
import { Model } from 'mongoose';
import { EditPlayerDTO } from './dtos/edit-player.dto';
import { FindParamDTO } from '../common/dtos/find-param.dto';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<Player>,
  ) {}

  async getPlayers(): Promise<Player[]> {
    return this.playerModel.find();
  }

  async getPlayerById(findParamDTO: FindParamDTO): Promise<Player> {
    const { _id } = findParamDTO;

    const player = await this.playerModel.findOne({ _id });

    if (!player) {
      throw new NotFoundException(`Player not found with the id "${_id}"`);
    }

    return player;
  }

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const foundPlayer = await this.playerModel.findOne({ email });

    if (foundPlayer) {
      throw new BadRequestException(
        `Player with the email "${email}" already exists`,
      );
    }

    const player = new this.playerModel(createPlayerDTO);

    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    return player.save();
  }

  async updatePlayer(
    findParamDTO: FindParamDTO,
    editPlayerDTO: EditPlayerDTO,
  ): Promise<Player> {
    const { _id } = findParamDTO;

    const player = await this.playerModel.findOneAndUpdate(
      { _id },
      { $set: editPlayerDTO },
      { new: true },
    );

    if (!player) {
      throw new NotFoundException(`Player with id "${_id} doesn't exist"`);
    }

    return player;
  }

  async deletePlayer(findParamDTO: FindParamDTO): Promise<void> {
    const player = await this.getPlayerById(findParamDTO);

    await player.remove();
  }
}
