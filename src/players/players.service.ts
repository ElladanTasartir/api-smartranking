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
import { FindParamDTO } from './dtos/find-param.dto';

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

  async getPlayerByEmail(findParamDTO: FindParamDTO): Promise<Player> {
    const { email } = findParamDTO;

    const player = await this.playerModel.findOne({ email });

    if (!player) {
      throw new NotFoundException(`Player not found with the email "${email}"`);
    }

    return player;
  }

  async createOrUpdatePlayer(
    createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
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
    const { email } = findParamDTO;

    try {
      return this.playerModel.findOneAndUpdate(
        { email },
        { $set: editPlayerDTO },
        { new: true },
      );
    } catch {
      throw new BadRequestException(
        `Couldn't update user with email "${email}"`,
      );
    }
  }

  async deletePlayer(findParamDTO: FindParamDTO): Promise<void> {
    const player = await this.getPlayerByEmail(findParamDTO);

    await player.remove();
  }
}
