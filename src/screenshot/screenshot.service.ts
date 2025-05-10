import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import {
  ScreenshotResponse,
  Screenshot429ErrorResponse,
  Screenshot500ErrorResponse,
} from './dto';
import { Browser, launch } from 'puppeteer';

@Injectable()
export class ScreenshotService {
  private readonly logger = new Logger(ScreenshotService.name);
  private readonly browserPool = BrowserPool.getInstance();

  /**
   * Captures a screenshot of the given URL using Puppeteer.
   */
  private async capture(url: string): Promise<Buffer> {
    // const browser = await launch({
    //   headless: true,
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });
    const browser = await this.browserPool.getBrowser();

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 }); // Set viewport size
    await page.goto(url, { waitUntil: 'networkidle2' });

    this.logger.debug(`Capturing screenshot for URL: ${url}`);
    const screenshot = await page.screenshot({ type: 'png' });
    this.logger.debug(
      `Screenshot capture size: ${(screenshot.length / 1024).toFixed(2)} kilobytes`,
    );

    await page.close();
    //await browser.close();

    this.browserPool.releaseBrowser(browser);

    return screenshot as Buffer;
  }

  /**
   * Processes the screenshot request and returns a response.
   */
  async processScreenshot(
    url: string,
  ): Promise<
    ScreenshotResponse | Screenshot429ErrorResponse | Screenshot500ErrorResponse
  > {
    if (!url) {
      this.logger.warn('Screenshot request failed: Missing URL');
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: 'Bad Request',
        errorMessage: 'Missing required parameter: url',
      };
    }

    this.logger.verbose(`Processing screenshot request for URL: ${url}`);

    try {
      const screenshot = await this.capture(url);

      this.logger.verbose(`Screenshot successfully captured for URL: ${url}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Screenshot request completed successfully',
        url,
        rawImage: `data:image/png;base64,${screenshot.toString('base64')}`, // Base64 encoded image,
      };
    } catch (error) {
      this.logger.error(
        `Error processing request for: ${url} -> Error: ${(error as Error).message}`,
      );
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode: 'Internal Server Error',
        errorMessage: 'Failed to process screenshot request',
      };
    }
  }
}

/**
 * Singleton class to manage a pool of Puppeteer browsers. This is a lightweight
 * implementation of a browser pool to reuse browser instances and reduce the
 * overhead of launching new browsers for each request.
 *
 * This class is not thread-safe and should be used in a single-threaded
 * environment. In a multi-threaded environment, consider using a more robust
 * implementation with proper locking mechanisms.
 *
 * This is a simple implementation and may not be suitable for production use
 * without further enhancements. For example, you may want to implement a
 * mechanism to check if a browser is still alive before returning it from the
 * pool, and handle cases where the browser crashes or becomes unresponsive.
 *
 * Additionally, you may want to implement a mechanism to limit the number of
 * concurrent browser instances to avoid overwhelming the system resources.
 * This implementation is for demonstration purposes only and should be
 * thoroughly tested and improved before using it in a production environment.
 *
 * Check out https://github.com/crstnmac/browser-pool/blob/main/src/BrowserPool.ts
 *
 * @class BrowserPool
 * @description A singleton class to manage a pool of Puppeteer browsers.
 */
class BrowserPool {
  private readonly logger = new Logger(BrowserPool.name);
  private static instance: BrowserPool;
  private browsers: Browser[] = [];
  private maxBrowsers = 5;

  private constructor() {
    void this.initPool();
  }

  private async createBrowser(): Promise<Browser> {
    const browser = await launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    browser.on('disconnected', () => {
      this.browsers = this.browsers.filter((b) => b !== browser);
      this.logger.log('Browser disconnected, removing from pool');
    });

    return browser;
  }

  private async initPool(): Promise<void> {
    for (let i = 0; i < this.maxBrowsers; i++) {
      const browser = await this.createBrowser();
      this.browsers.push(browser);
      this.logger.log(
        `Browser created and added to pool [Pool Size: ${this.browsers.length}]`,
      );
    }
  }

  public static getInstance(): BrowserPool {
    if (!BrowserPool.instance) {
      BrowserPool.instance = new BrowserPool();
    }
    return BrowserPool.instance;
  }

  public async getBrowser(): Promise<Browser> {
    if (this.browsers.length < this.maxBrowsers) {
      await this.initPool();
    }

    return this.browsers.pop()!;
  }

  public releaseBrowser(browser: Browser) {
    this.browsers.push(browser);
  }
}
