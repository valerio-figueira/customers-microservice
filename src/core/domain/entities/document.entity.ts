import { DocumentInterface } from './interfaces/document.interface';
import { DocumentTypeEnum } from '../enums/document-type.enum';
import { ApplicationValidationError } from '../../app/commons/errors/errors';

export class Document implements DocumentInterface {
  private _id: string | null = null;

  constructor(
    private readonly _customerId: string,
    private readonly _type: DocumentTypeEnum,
    private readonly _value: string,
    private readonly _issuingAuthority: string | null = null,
    private readonly _issueDate: Date | null = null,
    private readonly _expirationDate: Date | null = null,
  ) {}

  public get id(): string {
    if (!this._id) {
      throw new ApplicationValidationError(
        'O id do documento não pode estar vazio.',
      );
    }
    return this._id;
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get type(): DocumentTypeEnum {
    return this._type;
  }

  public get value(): string {
    return this._value;
  }

  public get issuingAuthority(): string | null {
    return this._issuingAuthority;
  }

  public get issueDate(): Date | null {
    return this._issueDate;
  }

  public get expirationDate(): Date | null {
    return this._expirationDate;
  }

  public isExpired(): boolean {
    if (!this._expirationDate) return false;
    return this._expirationDate.getTime() < Date.now();
  }

  public withId(id: string): void {
    this._id = id;
  }
}
