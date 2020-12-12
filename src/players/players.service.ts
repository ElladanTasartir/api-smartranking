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

  async getPlayerByEmail(email: string): Promise<Player> {
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
    email: string,
    editPlayerDTO: EditPlayerDTO,
  ): Promise<Player> {
    try {
      return this.playerModel.findOneAndUpdate(
        { email: email },
        { $set: editPlayerDTO },
        { new: true },
      );
    } catch {
      throw new BadRequestException(
        `Couldn't update user with email "${email}"`,
      );
    }
  }

  async deletePlayer(email: string): Promise<void> {
    const player = await this.getPlayerByEmail(email);

    await player.remove();
  }
}
