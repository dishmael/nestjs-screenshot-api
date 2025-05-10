import { Test, TestingModule } from '@nestjs/testing';
import { ScreenshotController } from './screenshot.controller';
import { ScreenshotService } from './screenshot.service';

describe('ScreenshotController', () => {
  let controller: ScreenshotController;
  let mockScreenshotService: Partial<ScreenshotService>;

  beforeEach(async () => {
    mockScreenshotService = {
      processScreenshot: jest.fn().mockReturnValue({
        message: 'Mock screenshot',
        url: 'https://example.com',
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreenshotController],
      providers: [
        { provide: ScreenshotService, useValue: mockScreenshotService },
      ],
    }).compile();

    controller = module.get<ScreenshotController>(ScreenshotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
