import { readFileSync } from 'node:fs';

import { plainToClass, Transform } from 'class-transformer';
import { validateSync } from 'class-validator';

import type { ClassConstructor } from 'class-transformer';

export function ToBoolean() {
  return Transform(({ value }: { value: string | number | boolean }) => {
    return ['1', 1, 'true', true].includes(value);
  });
}

export function toEnvVars(
  envVars: Record<string, string | number | boolean>,
): Record<string, string> {
  return Object.fromEntries(Object.entries(envVars).map(([key, value]) => [key, String(value)]));
}

export function validateEnvironmentVariables<T>(
  config: Record<string, unknown>,
  cls: ClassConstructor<T>,
): T {
  const validatedConfig = plainToClass(cls, config);
  const errors = validateSync(validatedConfig as unknown as Record<string, string>, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export function validateEnvironmentVariablesFromFile<T>(
  path: string,
  cls: ClassConstructor<T>,
  opts?: { key?: string; envVars?: Record<string, unknown> },
) {
  const data = readFileSync(path);
  const obj = JSON.parse(data.toString()) as Record<string, unknown>;

  return validateEnvironmentVariables(
    {
      ...((opts?.key ? obj[opts.key] : obj) as Record<string, unknown>),
      ...(opts?.envVars ? opts.envVars : {}),
    },
    cls,
  );
}
