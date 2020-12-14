import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindParamDTO } from '../shared/dtos/find-param.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.getCategories();
  }

  @Get('/:_id')
  @UsePipes(ValidationPipe)
  async getCategoryById(
    @Param() findParamDTO: FindParamDTO,
  ): Promise<Category> {
    return this.categoriesService.getCategoryById(findParamDTO);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return this.categoriesService.createCategory(createCategoryDTO);
  }
}
