import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<Category>,
  ) {}

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
