import {
  DocumentAttributes,
  DocumentInterface,
  DocumentTypes,
} from './interfaces/document.interface';
import { DomainDocumentError } from '../exceptions/domain-document.error';

export class Document implements DocumentInterface {
  private readonly _id: string;
  private readonly _customerId: string;
  private readonly _type: DocumentTypes;
  private readonly _value: string;
  private readonly _issuingAuthority: string | null = null;
  private readonly _issueDate: Date | null = null;
  private readonly _expirationDate: Date | null = null;

  constructor(attr: DocumentAttributes) {
    this._id = attr.id;
    this._customerId = attr.customerId;
    this._type = attr.type;
    this._value = attr.value;
    this._issuingAuthority = attr.issuingAuthority;
    this._issueDate = attr.issueDate;
    this._expirationDate = attr.expirationDate;
    Object.freeze(this);
  }

  public get id(): string {
    if (!this._id) {
      throw new DomainDocumentError(
        'O id do documento não pode estar vazio.',
      );
    }
    return this._id;
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get type(): DocumentTypes {
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
}
