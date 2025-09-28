import { Module } from '@nestjs/common';
import { PASSWORD_HASHER } from '../infra/config/tokens';
import { BcryptPasswordHasherAdapter } from '../infra/adapters/hashing/password-hasher.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: PASSWORD_HASHER,
      useFactory: () => new BcryptPasswordHasherAdapter(),
    },
  ],
  exports: [PASSWORD_HASHER],
})
export class PasswordHasherModule {}
