/**
 * Strategy interface/base class for file upload validation.
 * Implementations must throw an Error when validation fails.
 */
export default class BaseValidationStrategy {
  validate(_file) {
    throw new Error('validate(file) must be implemented by a concrete strategy');
  }
}
