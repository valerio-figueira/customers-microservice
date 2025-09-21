import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import type { CreateCustomerInterface } from '../../core/app/usecases/create-customer/create-customer.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CREATE_CUSTOMER_USECASE } from '../tokens';
import { HttpExceptionMapper } from './exceptions/http-exception.mapper';

@Controller()
export class CustomersController {
  constructor(
    @Inject(CREATE_CUSTOMER_USECASE)
    private readonly createCustomerUseCase: CreateCustomerInterface,
  ) {}

  @Post()
  public async create(@Body() body: CreateCustomerDto) {
    try {
      return this.createCustomerUseCase.create(body);
    } catch (error) {
      const { status, message } = HttpExceptionMapper.toHttp(error);
      throw new HttpException(message, status);
    }
  }
}
