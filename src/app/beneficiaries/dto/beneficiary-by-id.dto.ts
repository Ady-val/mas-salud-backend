import { Expose, Transform } from 'class-transformer';

export class BeneficiaryByIdDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  lastName: string;

  @Expose()
  secondLastName: string;

  @Expose()
  gender: 'Male' | 'Female';

  @Expose()
  curp: string;

  @Expose()
  phone: string;

  @Expose()
  street: string;

  @Expose()
  externalNumber: string;

  @Expose()
  internalNumber?: string;

  @Expose()
  colony: string;

  @Expose()
  postalCode: string;

  @Expose()
  identificationCode: string;

  @Expose()
  @Transform(({ obj }: { obj: { profilePicture?: Buffer } }) =>
    obj.profilePicture ? `data:image/jpeg;base64,${obj.profilePicture.toString('base64')}` : null,
  )
  image: string | null;
}
