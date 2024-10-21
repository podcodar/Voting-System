export class NotFound extends Error {
  public readonly statusCode: number;

  constructor(entity: string) {
    super(`${entity}: Página não foi encontrada`);
    this.statusCode = 404;
  }
}

export class BadRequestError extends Error {
  public readonly statusCode: number;

  constructor(data: string) {
    super(data);
    this.statusCode = 400;
  }
}
