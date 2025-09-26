import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  Param,
} from '@nestjs/common';
import type {
  CreateCustomerInterface,
  CreateCustomerOutput,
} from '../../core/app/usecases/create-customer/create-customer.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import {
  CREATE_CUSTOMER_USECASE,
  READ_ONE_CUSTOMER_USECASE,
} from '../config/tokens';
import { HttpExceptionMapper } from './exceptions/http-exception.mapper';
import type {
  ReadOneCustomerOutput,
  ReadOneCustomerUseCaseInterface,
} from '../../core/app/usecases/read-customer/read-customer.interface';

@Controller()
export class CustomersController {
  constructor(
    @Inject(CREATE_CUSTOMER_USECASE)
    private readonly createCustomerUseCase: CreateCustomerInterface,
    @Inject(READ_ONE_CUSTOMER_USECASE)
    private readonly readOneCustomerUseCase: ReadOneCustomerUseCaseInterface,
  ) {}

  @Post()
  public async create(
    @Body() body: CreateCustomerDto,
  ): Promise<CreateCustomerOutput> {
    try {
      return this.createCustomerUseCase.create(body);
    } catch (error) {
      const { status, message } = HttpExceptionMapper.toHttp(error);
      throw new HttpException(message, status);
    }
  }

  @Get('/:id')
  public async readOne(
    @Param('id') id: string,
  ): Promise<ReadOneCustomerOutput> {
    try {
      return this.readOneCustomerUseCase.readOne(id);
    } catch (error) {
      const { status, message } = HttpExceptionMapper.toHttp(error);
      throw new HttpException(message, status);
    }
  }
}
