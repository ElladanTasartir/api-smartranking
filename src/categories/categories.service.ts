import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { FindParamDTO } from 'src/common/dtos/find-param.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { InsertPlayerInCategoryDTO } from './dtos/insert-player-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find().populate('players');
  }

  async getCategoryById(findParamDTO: FindParamDTO): Promise<Category> {
    const { _id } = findParamDTO;

    const category = await this.categoryModel.findOne({ _id });

    if (!category) {
      throw new NotFoundException(`Category with ID "${_id}" not found`);
    }

    return category;
  }

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDTO;

    const foundCategory = await this.categoryModel.findOne({ category });

    if (foundCategory) {
      throw new BadRequestException(`Category "${category}" already exists`);
    }

    const createdCategory = new this.categoryModel(createCategoryDTO);

    return createdCategory.save();
  }

  async insertPlayerInCategory(
    insertPlayerInCategoryDTO: InsertPlayerInCategoryDTO,
  ): Promise<Category> {
    const { category, player } = insertPlayerInCategoryDTO;

    const foundCategory = await this.categoryModel.findOne({ category });

    if (!foundCategory) {
      throw new NotFoundException(`Category "${category}" doesn't exist`);
    }

    await this.playersService.getPlayerById({
      _id: player,
    });

    const playerAlreadyInCategory = await this.categoryModel
      .findOne({
        category,
      })
      .where('players')
      .in([player]);

    if (playerAlreadyInCategory) {
      throw new BadRequestException(
        `Player with the ID "${player}" is already in category "${category}"`,
      );
    }

    foundCategory.players.push(player);

    return foundCategory.save();
  }

  async updateCategory(
    category: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ category });

    if (!foundCategory) {
      throw new NotFoundException(`Category "${category}" doesn't exist`);
    }

    return this.categoryModel.findOneAndUpdate(
      { category },
      {
        $set: updateCategoryDTO,
      },
      {
        new: true,
      },
    );
  }

  async getCategoryByUserId(findParamDTO: FindParamDTO): Promise<Category> {
    const { _id } = findParamDTO;

    const player = await this.playersService.getPlayerById({ _id });

    const playerInCategory = await this.categoryModel
      .findOne()
      .where('players')
      .in([player]);

    if (!playerInCategory) {
      throw new BadRequestException(
        `Player with ID "${_id}" isn't in any category`,
      );
    }

    return playerInCategory;
  }
}
