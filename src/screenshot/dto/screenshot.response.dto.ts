import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

// Data Transfer Object (DTO) for the screenshot response
export class ScreenshotResponse {
  @ApiProperty({
    description: 'The HTTP status code',
    example: 200,
  })
  statusCode!: HttpStatus;

  @ApiProperty({
    description: 'The message indicating the result of the screenshot request',
    example: 'Screenshot request completed successfully',
  })
  message!: string;

  @ApiProperty({
    description: 'The URL for which the screenshot was requested',
    example: 'https://example.com',
  })
  url!: string;

  @ApiProperty({
    description: 'The screenshot image in PNG format',
    type: 'string',
    format: 'binary',
  })
  rawImage!: string;
}
