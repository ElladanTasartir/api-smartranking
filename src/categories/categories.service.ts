import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindParamDTO } from 'src/shared/dtos/find-param.dto';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryModel.find();
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
}
