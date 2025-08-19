import { IsString, Length, IsEnum, IsISO8601, IsOptional, MaxLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ServiceType } from './service-type.enum';

// Custom validator for E.164 phone format
export function IsE164(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isE164',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && /^\+?[1-9]\d{1,14}$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid E.164 phone number`;
        },
      },
    });
  };
}

// Custom validator for startsAt >= now + 15m
export function IsFuturePlus15(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFuturePlus15',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) return false;
          const date = new Date(value);
          return date.getTime() - Date.now() >= 15 * 60 * 1000;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least 15 minutes in the future`;
        },
      },
    });
  };
}

export class CreateBookingDto {
  @IsString()
  @Length(2, 80)
  clientName: string;

  @IsString()
  @IsE164()
  clientPhone: string;

  @IsEnum(ServiceType)
  service: ServiceType;

  @IsString()
  @IsISO8601()
  @IsFuturePlus15()
  startsAt: string;

  @IsOptional()
  @IsString()
  @MaxLength(280)
  notes?: string;
}
