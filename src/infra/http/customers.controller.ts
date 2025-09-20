import { Body, Controller, HttpException, Inject, Post } from '@nestjs/common';
import type { CreateCustomerUseCaseInterface } from '../../core/app/usecases/create-customer/interfaces/create-customer.usecase.interface';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CREATE_CUSTOMER_USECASE } from '../tokens';
import { HttpErrorMapper } from './errors/http-error.mapper';

@Controller()
export class CustomersController {
  constructor(
    @Inject(CREATE_CUSTOMER_USECASE)
    private readonly createCustomerUseCase: CreateCustomerUseCaseInterface,
  ) {}

  @Post()
  public async create(@Body() body: CreateCustomerDto) {
    try {
      return this.createCustomerUseCase.create(body);
    } catch (error) {
      console.log(`TESTE: ${error}`);
      const { status, instance } = HttpErrorMapper.toHttp(error);
      console.log({ status, instance });
      throw new HttpException(instance, status);
    }
  }
}
