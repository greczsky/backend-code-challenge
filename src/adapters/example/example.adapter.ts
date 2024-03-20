import type { ExampleResponse } from './types/interfaces';

export class ExampleAdapter {
  doSomething(): ExampleResponse {
    console.log('Doing something useful..');
    return { response: 'example-response' };
  }
}
