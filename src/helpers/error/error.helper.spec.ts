/* eslint-disable max-len */
import { toLogFriendlyError } from './error.helper';

import type { AxiosError, AxiosRequestHeaders } from 'axios';

describe('toLogFriendlyError', () => {
  describe('error is primitive value', () => {
    it('should transform null', () => {
      // Given
      const originalError = null;

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      const { stack, ...errorWithoutStack } = logFriendlyError;
      expect(errorWithoutStack).toMatchInlineSnapshot(`
        {
          "error": {
            "message": "Unknown error",
            "name": "Unknown error",
          },
        }
      `);
      expect(typeof stack).toEqual('string');
    });

    it('should transform string', () => {
      // Given
      const originalError = 'My error';

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      const { stack, ...errorWithoutStack } = logFriendlyError;
      expect(errorWithoutStack).toMatchInlineSnapshot(`
        {
          "error": {
            "detail": "My error",
            "message": "Unknown error",
            "name": "Unknown error",
          },
        }
      `);
      expect(typeof stack).toEqual('string');
    });
  });

  describe('error is object', () => {
    it('should transform generic object', () => {
      // Given
      const originalError = {
        message: 'Custom message',
        error: 'Custom error',
        name: 'Custom name',
        stack: 'Custom stack',
        other: 'Exclude',
      };

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      expect(logFriendlyError).toMatchInlineSnapshot(`
        {
          "error": {
            "detail": "{
          message: 'Custom message',
          error: 'Custom error',
          name: 'Custom name',
          stack: 'Custom stack',
          other: 'Exclude'
        }",
            "message": "Custom message",
            "name": "Custom name",
          },
          "stack": "Custom stack",
        }
      `);
    });

    it('should transform object with circular reference', () => {
      // Given
      const circular = {
        cRef: {},
      };
      circular.cRef = circular;
      const originalError = {
        message: 'Custom message',
        error: 'Custom error',
        name: 'Custom name',
        stack: 'Custom stack',
        other: 'Exclude',
        circular,
      };

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      expect(JSON.stringify(logFriendlyError, null, ' ')).toMatchInlineSnapshot(`
        "{
         "stack": "Custom stack",
         "error": {
          "name": "Custom name",
          "message": "Custom message",
          "detail": "{\\n  message: 'Custom message',\\n  error: 'Custom error',\\n  name: 'Custom name',\\n  stack: 'Custom stack',\\n  other: 'Exclude',\\n  circular: <ref *1> { cRef: [Circular *1] }\\n}"
         }
        }"
      `);
    });

    it('should transform Error', () => {
      // Given
      const originalError = new Error('custom.message');

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      expect(logFriendlyError).toMatchInlineSnapshot(
        {
          error: expect.objectContaining({
            detail: expect.any(String) as string,
          }) as Error,
          stack: expect.any(String) as string,
        },
        `
        {
          "error": ObjectContaining {
            "detail": Any<String>,
          },
          "stack": Any<String>,
        }
      `,
      );
      expect(logFriendlyError.error).toMatchInlineSnapshot(
        {
          detail: expect.any(String) as string,
        },
        `
        {
          "detail": Any<String>,
          "message": "custom.message",
          "name": "Error",
        }
      `,
      );
    });

    it('should use default properties when they are not present in error', () => {
      // Given
      const originalError = {};

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      const { stack, ...errorWithoutStack } = logFriendlyError;
      expect(errorWithoutStack).toMatchInlineSnapshot(`
        {
          "error": {
            "detail": "{}",
            "message": "Unknown error",
            "name": "Unknown error",
          },
        }
      `);
      expect(typeof stack).toEqual('string');
    });
  });

  describe('error is AxiosError', () => {
    it('should transform empty axios error', () => {
      // Given
      const originalError: Partial<AxiosError> = {
        isAxiosError: true,
      };

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      const { stack, ...errorWithoutStack } = logFriendlyError;
      expect(errorWithoutStack).toMatchInlineSnapshot(`
        {
          "error": {
            "detail": {
              "isAxiosError": true,
              "method": undefined,
              "response": undefined,
              "status": undefined,
              "url": undefined,
            },
            "message": "Unknown error",
            "name": "Unknown error",
          },
        }
      `);
      expect(typeof stack).toEqual('string');
    });

    it('should transform axios error without response', () => {
      // Given
      const url = 'http://example.com';
      const method = 'GET';
      const originalError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Axios message',
        code: 'Axios code',
        config: {
          url,
          method,
          headers: {
            apiKey: 'apiKey',
          } as unknown as AxiosRequestHeaders,
        },
        request: {
          headers: {
            apiKey: 'apiKey',
          },
        },
        name: 'AxiosError',
        stack: 'Axios stack',
      };

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      expect(logFriendlyError).toMatchInlineSnapshot(`
        {
          "error": {
            "detail": {
              "isAxiosError": true,
              "method": "GET",
              "response": undefined,
              "status": undefined,
              "url": "http://example.com",
            },
            "message": "Axios message",
            "name": "AxiosError",
          },
          "stack": "Axios stack",
        }
      `);
    });

    it('should transform axios error with response', () => {
      // Given
      const url = 'http://example.com';
      const method = 'GET';
      const status = 200;
      const data = {
        results: [],
      };
      const config = {
        url,
        method,
        headers: {
          apiKey: 'apiKey',
        } as unknown as AxiosRequestHeaders,
      };

      const originalError: Partial<AxiosError> = {
        isAxiosError: true,
        message: 'Axios message',
        code: 'Axios code',
        config,
        request: {
          headers: {
            apiKey: 'apiKey',
          },
        },
        response: {
          status,
          statusText: 'ok',
          config,
          headers: {
            apiKey: 'apiKey',
          },
          data,
        },
        status,
        name: 'AxiosError',
        stack: 'Axios stack',
      };

      // When
      const logFriendlyError = toLogFriendlyError(originalError);

      // Then
      expect(logFriendlyError).toMatchInlineSnapshot(`
        {
          "error": {
            "detail": {
              "isAxiosError": true,
              "method": "GET",
              "response": {
                "results": [],
              },
              "status": 200,
              "url": "http://example.com",
            },
            "message": "Axios message",
            "name": "AxiosError",
          },
          "stack": "Axios stack",
        }
      `);
    });
  });
});
