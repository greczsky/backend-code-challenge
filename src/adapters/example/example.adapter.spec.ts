import { ExampleAdapter } from './example.adapter';

describe('Example adapter', () => {
  let adapter: ExampleAdapter;

  beforeEach(() => {
    adapter = new ExampleAdapter();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });
});
