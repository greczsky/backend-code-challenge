import { BadRequestException, Injectable } from '@nestjs/common';
import { maxLength } from 'class-validator';

import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';

@Injectable()
export class MaxLengthValidationPipe implements PipeTransform {
  constructor(private maxLengthValue: number) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (maxLength(value, this.maxLengthValue) === false) {
      const data = String(metadata.data);

      throw new BadRequestException([
        `${data} must be shorter than or equal to ${this.maxLengthValue} characters`,
      ]);
    }
    return value;
  }
}
