import { hasMessage, hasName, hasStack, isAxiosError, isObject } from './type.helper';

describe('typeHelpers', () => {
  describe('isObject', () => {
    it('should return true when input is object', () => {
      expect(isObject({})).toBe(true);
    });

    it('should return false when input is primitive value', () => {
      expect(isObject('string')).toBe(false);
    });

    it('should return false when input is null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false when input is undefined', () => {
      expect(isObject(undefined)).toBe(false);
    });
  });

  describe('hasName', () => {
    it('should return true when object contains name', () => {
      expect(hasName({ name: 'value' })).toBe(true);
    });

    it('should return false when name is not string', () => {
      expect(hasStack({ name: {} })).toBe(false);
    });

    it("should return false when object doesn't contain name", () => {
      expect(hasName({})).toBe(false);
    });
  });

  describe('hasMessage', () => {
    it('should return true when object contains message', () => {
      expect(hasMessage({ message: 'value' })).toBe(true);
    });

    it('should return false when message is not string', () => {
      expect(hasStack({ message: {} })).toBe(false);
    });

    it("should return false when object doesn't contain message", () => {
      expect(hasMessage({})).toBe(false);
    });
  });

  describe('hasStack', () => {
    it('should return true when object contains stack', () => {
      expect(hasStack({ stack: 'value' })).toBe(true);
    });

    it('should return false when stack is not string', () => {
      expect(hasStack({ stack: {} })).toBe(false);
    });

    it("should return false when object doesn't contain stack", () => {
      expect(hasStack({})).toBe(false);
    });
  });

  describe('isAxiosError', () => {
    it('should return true when input is axios error', () => {
      expect(isAxiosError({ isAxiosError: true })).toBe(true);
    });

    it('should return false when input is not axios error', () => {
      expect(isAxiosError({})).toBe(false);
    });

    it('should return false when input is not object', () => {
      expect(isAxiosError(null)).toBe(false);
    });
  });
});
