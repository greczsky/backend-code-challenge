import { BadRequestException } from '@nestjs/common';
import { plainToInstance, Type } from 'class-transformer';
import { IsDateString, IsNumberString, validate, ValidateNested } from 'class-validator';

import { transformValidationErrors } from './validation.helper';

describe('validationHelper', () => {
  describe('transformValidationErrors', () => {
    it('Should throw BadRequestException with correct structure', async () => {
      class TestDto {
        @IsNumberString()
        invalid!: string;
      }

      const instance = plainToInstance(TestDto, { invalid: 'invalid' });
      const errors = await validate(instance);

      const transformedErrors = transformValidationErrors(errors);
      expect(transformedErrors).toBeInstanceOf(BadRequestException);

      const response = transformedErrors.getResponse();
      expect(typeof response).toEqual('object');

      const responseObject = response as Record<string, unknown>;
      expect(Array.isArray(responseObject.message)).toBe(true);
      expect(Array.isArray(responseObject.errorCodes)).toBe(true);
    });

    it('Should collect error messages', async () => {
      class TestDto {
        @IsNumberString(undefined, { message: 'invalid must be numeric string' })
        invalid!: string;

        @IsDateString(undefined, { message: 'invalid2 must be date string' })
        invalid2!: string;
      }

      const instance = plainToInstance(TestDto, {
        invalid: 'invalid',
        invalid2: 'invalid',
      });
      const errors = await validate(instance);

      const transformedErrors = transformValidationErrors(errors);
      const { message } = transformedErrors.getResponse() as Record<string, unknown>;

      expect(message).toHaveLength(2);
      expect(message).toContain('invalid must be numeric string');
      expect(message).toContain('invalid2 must be date string');
    });

    it('Should collect nested error messages', async () => {
      class NestedDto {
        @IsNumberString(undefined, { message: 'nestedInvalid must be numeric string' })
        nestedInvalid!: string;
      }

      class TestDto {
        @IsNumberString(undefined, { message: 'invalid must be numeric string' })
        invalid!: string;

        @ValidateNested()
        @Type(() => NestedDto)
        nested!: NestedDto;
      }

      const instance = plainToInstance(TestDto, {
        invalid: 'invalid',
        nested: {
          nestedInvalid: 'invalid',
        },
      });
      const errors = await validate(instance);

      const transformedErrors = transformValidationErrors(errors);
      const { message } = transformedErrors.getResponse() as Record<string, unknown>;

      expect(message).toHaveLength(2);
      expect(message).toContain('invalid must be numeric string');
      expect(message).toContain('nested.nestedInvalid must be numeric string');
    });

    it('Should collect error codes from context', async () => {
      class TestDto {
        @IsNumberString(undefined, {
          context: {
            errorCode: 'invalid_err',
          },
        })
        invalid!: string;

        @IsDateString(undefined, {
          context: {
            errorCode: 'invalid_2_err',
          },
        })
        invalid2!: string;
      }

      const instance = plainToInstance(TestDto, {
        invalid: 'invalid',
        invalid2: 'invalid',
      });
      const errors = await validate(instance);

      const transformedErrors = transformValidationErrors(errors);
      const { errorCodes } = transformedErrors.getResponse() as Record<string, unknown>;

      expect(errorCodes).toHaveLength(2);
      expect(errorCodes).toContain('invalid_err');
      expect(errorCodes).toContain('invalid_2_err');
    });

    it('Should collect nested error codes from context', async () => {
      class NestedDto {
        @IsNumberString(undefined, {
          context: {
            errorCode: 'nested_invalid_err',
          },
        })
        nestedInvalid!: string;
      }

      class TestDto {
        @IsNumberString(undefined, {
          context: {
            errorCode: 'invalid_err',
          },
        })
        invalid!: string;

        @ValidateNested()
        @Type(() => NestedDto)
        nested!: NestedDto;
      }

      const instance = plainToInstance(TestDto, {
        invalid: 'invalid',
        nested: {
          nestedInvalid: 'invalid',
        },
      });
      const errors = await validate(instance);

      const transformedErrors = transformValidationErrors(errors);
      const { errorCodes } = transformedErrors.getResponse() as Record<string, unknown>;

      expect(errorCodes).toHaveLength(2);
      expect(errorCodes).toContain('invalid_err');
      expect(errorCodes).toContain('nested_invalid_err');
    });
  });
});
