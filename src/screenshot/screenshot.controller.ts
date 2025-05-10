import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';
import { ScreenshotService } from './screenshot.service';
import {
  Screenshot429ErrorResponse,
  Screenshot500ErrorResponse,
  ScreenshotRequest,
  ScreenshotResponse,
} from './dto';

@Controller('api/screenshot/v1')
export class ScreenshotController {
  private readonly logger = new Logger(ScreenshotController.name);

  constructor(private readonly screenshotService: ScreenshotService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Screenshot request created successfully',
    type: ScreenshotResponse,
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests - Rate limit exceeded',
    type: Screenshot429ErrorResponse,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
    type: Screenshot500ErrorResponse,
  })
  async create(
    @Body() createScreenshotDto: ScreenshotRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.screenshotService.processScreenshot(
      createScreenshotDto.url,
    );

    if (result.statusCode && result.statusCode !== HttpStatus.OK) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(HttpStatus.OK).json(result);
  }
}
