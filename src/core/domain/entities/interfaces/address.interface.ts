export interface AddressInterface {
  readonly customerId: string;
  readonly street: string;
  readonly number: string;
  readonly neighborhood: string;
  readonly zipcode: string;
  readonly city: string;
  readonly state: string;
  readonly isDefault: boolean;

  /**
   * @method fullAddress
   * @description
   * Retorna o endereço formatado.
   * @returns {string} O endereço completo em uma única string.
   */
  fullAddress(): string;
}

export interface PersistedAddressInterface extends AddressInterface {
  readonly id: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
  readonly deletedAt: Date | null;
}
