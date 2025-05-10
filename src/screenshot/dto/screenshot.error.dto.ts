import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// Interface for standard error response structure
export interface ScreenshotErrorResponse {
  statusCode: HttpStatus;
  errorCode: string;
  errorMessage: string;
}

// Too Many Requests Error Response
export class Screenshot429ErrorResponse implements ScreenshotErrorResponse {
  @ApiProperty({
    description: 'The HTTP status code',
    example: HttpStatus.TOO_MANY_REQUESTS,
  })
  statusCode!: HttpStatus;

  @ApiProperty({ description: 'The error code', example: 'TOO_MANY_REQUESTS' })
  errorCode!: string;

  @ApiProperty({
    description: 'The error message',
    example: 'You have exceeded the allowed request limit.',
  })
  errorMessage!: string;

  constructor() {
    this.statusCode = HttpStatus.TOO_MANY_REQUESTS;
    this.errorCode = 'TOO_MANY_REQUESTS';
    this.errorMessage =
      'You have exceeded the allowed request limit. Please slow down.';
  }
}

// Internal Server Error Response
export class Screenshot500ErrorResponse implements ScreenshotErrorResponse {
  @ApiProperty({
    description: 'The HTTP status code',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  statusCode!: HttpStatus;

  @ApiProperty({
    description: 'The error code',
    example: 'INTERNAL_SERVER_ERROR',
  })
  errorCode!: string;

  @ApiProperty({
    description: 'The error message',
    example: 'An unexpected server error occurred. Please try again later.',
  })
  errorMessage!: string;

  constructor() {
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this.errorCode = 'INTERNAL_SERVER_ERROR';
    this.errorMessage =
      'An unexpected server error occurred. Please try again later.';
  }
}
