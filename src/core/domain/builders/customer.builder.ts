import { Customer } from '../entities/customer.entity';
import { Phone } from '../entities/phone.entity';
import { Gender } from '../entities/gender.entity';
import { Email } from '../entities/email.entity';
import { Document } from '../entities/document.entity';
import { GenderEnum } from '../enums/gender.enum';
import { CustomerDocumentInterface } from '../entities/interfaces/customer.interface';
import { IdGeneratorInterface } from '../../app/ports/id-generator.interface';
import { ApplicationValidationError } from '../../app/commons/errors/errors';

export class CustomerBuilder {
  private _id: string;
  private _name: string;
  private _email: Email;
  private _password: string;
  private _phone: Phone;
  private _gender: Gender;
  private _dateOfBirth: Date;
  private _documents: Document[] = [];

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

  public withPassword(hash: string): this {
    this._password = hash;
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
      throw new ApplicationValidationError(
        'A data de nascimento é obrigatória.',
      );
    }
    this._dateOfBirth = new Date(date);
    return this;
  }

  public withDocuments(
    documents: Array<CustomerDocumentInterface & { id?: string }>,
    idGenerator?: IdGeneratorInterface,
  ): this {
    const customerId = this._id;
    if (!customerId) {
      throw new ApplicationValidationError(
        'Não é possível adicionar documentos sem o id de usuário.',
      );
    }
    documents.forEach((d) => {
      const newDoc = new Document(
        customerId,
        d.type,
        d.value,
        d.issuingAuthority,
        d.issueDate,
        d.expirationDate,
      );
      if (idGenerator) {
        newDoc.withId(idGenerator.generate('doc'));
      }
      this._documents.push(newDoc);
    });
    return this;
  }

  public build(options?: { validate: true }): Customer {
    if (options?.validate === true) {
      this.validate();
    }

    return new Customer(
      this._id,
      this._name,
      this._email,
      this._password,
      this._phone,
      this._gender,
      this._dateOfBirth,
      this._documents,
    );
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
      throw new ApplicationValidationError('Está faltando o id de usuário.');
    }
  }

  private validateName(): void {
    if (!this._name) {
      throw new ApplicationValidationError('Está faltando o nome do usuário.');
    }
  }

  private validateEmail(): void {
    if (!this._email) {
      throw new ApplicationValidationError('Está faltando o e-mail.');
    }
  }

  private validatePassword(): void {
    if (!this._password) {
      throw new ApplicationValidationError('Está faltando a senha.');
    }
  }

  private validatePhone(): void {
    if (!this._phone) {
      throw new ApplicationValidationError('Está faltando o telefone.');
    }
  }

  private validateGender(): void {
    if (!this._gender) {
      throw new ApplicationValidationError('Está faltando o gênero.');
    }
  }

  private validateDateOfBirth(): void {
    if (!this._dateOfBirth) {
      throw new ApplicationValidationError(
        'Está faltando a data de nascimento.',
      );
    }
  }

  private validateDocuments(): void {
    if (!this._documents.length) {
      throw new ApplicationValidationError(
        'Está faltando os documentos do usuário.',
      );
    }
  }
}
