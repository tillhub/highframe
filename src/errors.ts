export class SerializationError extends Error {
  public static code = 'SERIALIZATION_ERROR'
  public originalError?: Error

  constructor(message: string = 'Could not serialize message', originalError?: Error) {
    super(message)
    this.name = 'SerializationError'
    this.originalError = originalError
    this.stack = (new Error() as any).stack
  }
}

export class DeserializationError extends Error {
  public static code = 'DESERIALIZATION_ERROR'
  public originalError?: Error

  constructor(message: string = 'Could not deserialize message', originalError?: Error) {
    super(message)
    this.name = 'DeserializationError'
    this.stack = (new Error() as any).stack
  }
}
