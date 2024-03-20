import { ConflictException } from '@nestjs/common';

export class CustomConflictException extends ConflictException {}
