import type { HttpStatusCode } from './enums';

/**
 * Definition type for http error responses, defined & described in https://365bank.sharepoint.com/:w:/r/sites/Horizon-AWS-DevOps/_layouts/15/doc2.aspx?sourcedoc=%7BE82EC051-61A2-44E8-B91C-9D9BD24FC485%7D&file=AWS_programming_ErrorHandling_03.docx&action=default&mobileredirect=true&DefaultItemOpen=1&ct=1635340441082&wdOrigin=OFFICECOM-WEB.MAIN.OTHER&cid=685c9031-1fd1-4f29-9fbc-8ef210f1120b
 *
 * @field message - replaced with messages, will be removed in the future
 */
export type ErrorResponse = {
  statusCode: HttpStatusCode;
  messages: string[];
  error: string;
  errorCodes?: string[];
};

export interface ErrorResponseNestJsParams {
  statusCode: HttpStatusCode;
  message: string | string[];
  error?: string;
  errorCodes?: string[];
}

export type LogFriendlyError = {
  error: {
    message: string;
    name: string;
    detail?: unknown;
  };
  stack: string;
};
