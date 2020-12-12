import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async getPlayers(email: string): Promise<Player[] | Player> {
    if (email) {
      return this.getPlayerByEmail(email);
    }

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

    const player = await this.playerModel.findOne({ email });

    if (player) {
      return this.update(createPlayerDTO);
    }

    return this.create(createPlayerDTO);
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const player = new this.playerModel(createPlayerDTO);

    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);

    return player.save();
  }

  private async update(editPlayerDTO: EditPlayerDTO): Promise<Player> {
    return this.playerModel.findOneAndUpdate(
      { email: editPlayerDTO.email },
      { $set: editPlayerDTO },
      { new: true },
    );
  }

  async deletePlayer(email: string): Promise<void> {
    const player = await this.getPlayerByEmail(email);

    await player.remove();
  }
}
