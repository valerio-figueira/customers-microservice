import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  Param,
} from '@nestjs/common';
import { CREATE_DOCUMENT_USECASE } from '../config/tokens';
import { HttpExceptionMapper } from './exceptions/http-exception.mapper';
import type { CreateDocumentUseCaseInterface } from '../../core/app/usecases/create-document/create-document.interface';
import { CreateDocumentDto } from '../dtos/create-document.dto';

@Controller('documents')
export class DocumentsController {
  constructor(
    @Inject(CREATE_DOCUMENT_USECASE)
    private readonly createDocumentUseCase: CreateDocumentUseCaseInterface,
  ) {}

  @Post('/:customerId')
  public async create(
    @Body() input: CreateDocumentDto,
    @Param('customerId') customerId: string,
  ) {
    try {
      return this.createDocumentUseCase.create({ ...input, customerId });
    } catch (error) {
      const { status, message } = HttpExceptionMapper.toHttp(error);
      throw new HttpException(message, status);
    }
  }
}
