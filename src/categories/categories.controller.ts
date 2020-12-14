import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindParamDTO } from '../shared/dtos/find-param.dto';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { InsertPlayerInCategoryDTO } from './dtos/insert-player-category.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
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

  @Post('/:category/player/:player')
  @UsePipes(ValidationPipe)
  async insertPlayerInCategory(
    @Param() insertPlayerInCategoryDTO: InsertPlayerInCategoryDTO,
  ): Promise<Category> {
    return this.categoriesService.insertPlayerInCategory(
      insertPlayerInCategoryDTO,
    );
  }

  @Put('/:category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Param('category') category: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<Category> {
    return this.categoriesService.updateCategory(category, updateCategoryDTO);
  }
}
