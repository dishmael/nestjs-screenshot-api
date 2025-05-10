import { ApiProperty } from '@nestjs/swagger';

// Data Transfer Object (DTO) for the screenshot request
export class ScreenshotRequest {
  @ApiProperty({
    description: 'The URL for the screenshot',
    example: 'https://example.com',
  })
  url!: string;
}
