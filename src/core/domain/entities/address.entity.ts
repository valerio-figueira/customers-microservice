import { AddressInterface } from './interfaces/address.interface';
import { DomainAddressError } from '../exceptions/domain-address.error';

export class Address implements AddressInterface {
  constructor(
    private readonly _customerId: string,
    private readonly _street: string,
    private readonly _number: string,
    private readonly _neighborhood: string,
    private readonly _zipcode: string,
    private readonly _city: string,
    private readonly _state: string,
    private readonly _isDefault: boolean,
  ) {
    if (!_street || !_number || !_zipcode || !_city || !_state) {
      throw new DomainAddressError(
        'Endereço inválido. Campos obrigatórios estão ausentes.',
      );
    }

    if (!/^\d{5}-?\d{3}$/.test(_zipcode)) {
      throw new DomainAddressError('CEP inválido.');
    }
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get street(): string {
    return this._street;
  }

  public get number(): string {
    return this._number;
  }

  public get neighborhood(): string {
    return this._neighborhood;
  }

  public get zipcode(): string {
    return this._zipcode;
  }

  public get city(): string {
    return this._city;
  }

  public get state(): string {
    return this._state;
  }

  public get isDefault(): boolean {
    return this._isDefault;
  }

  public fullAddress(): string {
    return `${this._street}, ${this._number} - ${this._neighborhood}, ${this._city} - ${this._state}, ${this._zipcode}`;
  }
}
