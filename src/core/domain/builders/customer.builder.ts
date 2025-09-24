import { Customer } from '../entities/customer.entity';
import { Phone } from '../entities/phone.entity';
import { Gender } from '../entities/gender.entity';
import { Email } from '../entities/email.entity';
import { Document } from '../entities/document.entity';
import { GenderEnum } from '../enums/gender.enum';
import { CustomerDocumentInterface } from '../entities/interfaces/customer.interface';
import { IdGeneratorInterface } from '../../app/ports/id-generator.interface';
import { Avatar } from '../entities/avatar.entity';
import { Address } from '../entities/address.entity';
import { Password } from '../entities/password.entity';
import { DomainDocumentError } from '../exceptions/domain-document.error';
import { DomainCustomerError } from '../exceptions/domain-customer.error';
import { DomainEmailError } from '../exceptions/domain-email.error';
import { DomainPasswordError } from '../exceptions/domain-password.error';
import { DomainPhoneError } from '../exceptions/domain-phone.error';
import { DomainGenderError } from '../exceptions/domain-gender.error';
import { DomainDateOfBirthError } from '../exceptions/domain-date-of-birth.error';

export class CustomerBuilder {
  private _id: string;
  private _name: string;
  private _email: Email;
  private _password: Password;
  private _phone: Phone;
  private _gender: Gender;
  private _dateOfBirth: Date;
  private _documents: Document[] = [];
  private _avatar: Avatar = new Avatar();
  private _addresses: Address[] = [];

  constructor(private readonly idGenerator: IdGeneratorInterface) {}

  public withId(id: string): this {
    this._id = id;
    return this;
  }

  public withName(name: string): this {
    this._name = name;
    return this;
  }

  public withEmail(email: string): this {
    this._email = new Email(email);
    return this;
  }

  public withPassword(password: Password): this {
    this._password = password;
    return this;
  }

  public withPhone(phone: string): this {
    this._phone = new Phone(phone);
    return this;
  }

  public withGender(gender: GenderEnum): this {
    this._gender = new Gender(gender);
    return this;
  }

  public withDateOfBirth(date: Date): this {
    if (!date) {
      throw new DomainDateOfBirthError('A data de nascimento é obrigatória.');
    }
    this._dateOfBirth = new Date(date);
    return this;
  }

  public withDocuments(
    documents: Array<CustomerDocumentInterface & { id?: string }>,
  ): this {
    if (!this._id) {
      throw new DomainDocumentError(
        'Não é possível adicionar documentos sem o id de usuário.',
      );
    }
    documents.forEach((d) => {
      const newDoc = new Document({
        id: d.id ? d.id : this.idGenerator.generate('doc'),
        customerId: this._id,
        type: d.type,
        value: d.value,
        issuingAuthority: d.issuingAuthority,
        issueDate: d.issueDate,
        expirationDate: d.expirationDate,
      });

      this._documents.push(newDoc);
    });
    return this;
  }

  public build(options?: { validate: true }): Customer {
    if (options?.validate === true) {
      this.validate();
    }

    return new Customer({
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
      phone: this._phone,
      gender: this._gender,
      dateOfBirth: this._dateOfBirth,
      documents: this._documents,
      avatar: this._avatar,
      addresses: this._addresses,
    });
  }

  private validate(): void {
    this.validateId();
    this.validateName();
    this.validateEmail();
    this.validatePassword();
    this.validatePhone();
    this.validateDateOfBirth();
    this.validateGender();
    this.validateDocuments();
  }

  private validateId(): void {
    if (!this._id) {
      throw new DomainCustomerError('Está faltando o id de usuário.');
    }
  }

  private validateName(): void {
    if (!this._name) {
      throw new DomainCustomerError('Está faltando o nome do usuário.');
    }
  }

  private validateEmail(): void {
    if (!this._email) {
      throw new DomainEmailError('Está faltando o e-mail.');
    }
  }

  private validatePassword(): void {
    if (!this._password) {
      throw new DomainPasswordError('Está faltando a senha.');
    }
  }

  private validatePhone(): void {
    if (!this._phone) {
      throw new DomainPhoneError('Está faltando o telefone.');
    }
  }

  private validateGender(): void {
    if (!this._gender) {
      throw new DomainGenderError('Está faltando o gênero.');
    }
  }

  private validateDateOfBirth(): void {
    if (!this._dateOfBirth) {
      throw new DomainDateOfBirthError('Está faltando a data de nascimento.');
    }
  }

  private validateDocuments(): void {
    if (!this._documents.length) {
      throw new DomainDocumentError('Está faltando os documentos do usuário.');
    }
  }
}
