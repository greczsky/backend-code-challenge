import { HttpStatusCodeToMessage } from 'src/types/constants';

import type { ErrorResponse, ErrorResponseNestJsParams } from 'src/types/types';

const UNKNOWN_HTTP_STATUS_CODE_MESSAGE = 'Unknown';

/**
 * Function only for nestjs controllers for proper formatted success response.
 *
 * @typeParam T - Response body definition type (DTO)
 *
 * @param body - Response body defined by type parameter or ResponseSetDto<T> used for list/arrays in response
 * with optional parameter for pagination.
 * @returns T | ResponseSetDto<T> - Response format defined by definition type parameter / ResponseSetDto<T>
 *
 * @example
 * interface ExampleDto {
 *   id: string;
 *   foo: {
 *       bar: number;
 *   }
 * };
 *
 * interface ExampleResultSetDto extends ResponseSetDto<ExampleDto> { };
 * ...
 * const exampleDto = {
 *  id: '1234-5678-abcd-efgh',
 *  foo: {
 *      bar: 1
 *   }
 * };
 *
 * const testingResultSetDto: TestingResultSetDto = {
 *   resultSetDescriptor: {
 *       currentResultPage: 1,
 *       totalNumberOfResults: 10,
 *       pageSize: 10
 *   },
 *   resultSet: exampleDto
 * };
 * return successResponse(exampleResultSetDto);
 */
export const successResponseNestjs = <T>(body: T): T => ({
  ...body,
});

/**
 * Function only for nestjs controllers for formatting error response.
 *
 * @param params.statusCode - http status code (only >= 400)
 * @param params.message - human readable error explanation
 * @param params.error - string with explanation of the error. Library will try to map status code to general error message, when not provided.
 * @param params.errorCodes - machine parsable error code
 */
export function errorResponseNestjs({
  statusCode,
  message,
  error,
  errorCodes = [],
}: ErrorResponseNestJsParams): ErrorResponse {
  if (!error && statusCode in HttpStatusCodeToMessage === false) {
    error = UNKNOWN_HTTP_STATUS_CODE_MESSAGE;
  }

  return {
    statusCode,
    error: error ? error : HttpStatusCodeToMessage[statusCode],
    messages: Array.isArray(message) ? message : [message],
    errorCodes: errorCodes,
  };
}
