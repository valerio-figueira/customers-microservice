import {
  DocumentAttributes,
  DocumentInterface,
  DocumentTypes,
} from './interfaces/document.interface';
import { DomainDocumentError } from '../exceptions/domain-document.error';
import { DocumentTypeEnum } from '../enums/document-type.enum';

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
    this._type = <DocumentTypes>attr.type.toUpperCase().trim();
    this._value = attr.value.replace(/[.\-/]/g, '').trim();
    this._issuingAuthority = attr.issuingAuthority;
    this._issueDate = attr.issueDate;
    this._expirationDate = attr.expirationDate;
    this.validate();
    Object.freeze(this);
  }

  public get id(): string {
    if (!this._id) {
      throw new DomainDocumentError('O id do documento não pode estar vazio.');
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

  private validate(): void {
    this.validateId();
    this.validateCustomerId();
    this.validateValue();
    this.validateType();
  }

  private validateId(): void {
    if (!this._id) throw new DomainDocumentError();
  }

  private validateCustomerId(): void {
    if (!this._customerId) {
      throw new DomainDocumentError();
    }
  }

  private validateValue(): void {
    if (!this._value) {
      throw new DomainDocumentError('Número do documento é obrigatório.');
    }
    if (!/(^\d{7,15}$)|(^[a-zA-Z]{2,3}\d{5,10}$)/g.test(this.value)) {
      throw new DomainDocumentError('Número do documento é inválido.');
    }
  }

  private validateType(): void {
    const validTypes = new Set<DocumentTypes>([
      DocumentTypeEnum.CNH,
      DocumentTypeEnum.CPF,
      DocumentTypeEnum.CNPJ,
      DocumentTypeEnum.RG,
      DocumentTypeEnum.PASSPORT,
    ]);
    if (!validTypes.has(this._type)) {
      throw new DomainDocumentError('Tipo do documento inválido.');
    }
  }
}
