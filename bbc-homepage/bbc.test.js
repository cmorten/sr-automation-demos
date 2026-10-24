import { platform, release } from "node:os";
import { screenReaderTest as test } from "@guidepup/playwright";
import { record } from "@guidepup/record";

const MAX_NAVIGATION = 100;

const log = (...messages) =>
  console.log(`[${new Date().toUTCString()}]`, ...messages);

let stopRecording;

test.describe("BBC", () => {
  test.beforeEach(
    async ({ browser, browserName, context, page, screenReader }) => {
      const osName = platform();
      const osVersion = release();
      const browserVersion = browser.version();
      const screenReaderName = screenReader.name;
      const screenReaderVersion = screenReader.version;
      const { retry, title } = test.info();

      const recordingFilePath = `./recordings/bbc-homepage-${title.toLowerCase().replaceAll(/\s/g, "-")}-${osName}-${osVersion}-${screenReaderName}-${screenReaderVersion}-${browserName}-${browserVersion}-attempt-${retry}-${Date.now()}.mov`;

      console.table({
        osName,
        osVersion,
        browserName,
        browserVersion,
        screenReaderName,
        screenReaderVersion,
        retry,
      });

      stopRecording = record(recordingFilePath);

      await context.addCookies([
        {
          name: "ckns_explicit",
          value: "1",
          domain: "www.bbc.co.uk",
          path: "/",
        },
      ]);

      await page.route("https://www.bbc.co.uk/userinfo**", (route) =>
        route.abort(),
      );

      await page.goto("https://www.bbc.co.uk/", {
        waitUntil: "load",
      });

      await page.locator("header").waitFor();

      await screenReader.navigateToWebContent();
    },
  );

  test.afterEach(async () => {
    try {
      await stopRecording?.();
    } catch (error) {
      console.error(error);
    } finally {
      stopRecording = undefined;
    }
  });

  test("I can navigate to BBC Sounds using the screen reader next command", async ({
    screenReader,
  }) => {
    let lastSpokenPhrase = "";
    let navigationCounter = 0;

    while (!/More menu/i.test(lastSpokenPhrase)) {
      if (navigationCounter >= MAX_NAVIGATION) {
        throw new Error("Failed to find 'More menu' button");
      }

      await screenReader.next();
      lastSpokenPhrase = await screenReader.lastSpokenPhrase();
      log(`Last spoken phrase: ${lastSpokenPhrase}`);

      navigationCounter++;
    }

    await screenReader.act();
    lastSpokenPhrase = await screenReader.lastSpokenPhrase();
    log(`Last spoken phrase: ${lastSpokenPhrase}`);

    navigationCounter = 0;

    while (!/Sounds/i.test(lastSpokenPhrase)) {
      if (navigationCounter >= MAX_NAVIGATION) {
        throw new Error("Failed to find 'Sounds' link");
      }

      await screenReader.next();
      lastSpokenPhrase = await screenReader.lastSpokenPhrase();
      log(`Last spoken phrase: ${lastSpokenPhrase}`);

      navigationCounter++;
    }

    await screenReader.act();
    lastSpokenPhrase = await screenReader.lastSpokenPhrase();
    log(`Last spoken phrase: ${lastSpokenPhrase}`);

    log(
      `Spoken phrase log: ${JSON.stringify(
        await screenReader.spokenPhraseLog(),
      )}`,
    );
  });

  test("I can navigate to BBC Sounds using the screenReader next and next link commands", async ({
    screenReader,
  }) => {
    let lastSpokenPhrase = "";
    let navigationCounter = 0;

    while (!/More menu/i.test(lastSpokenPhrase)) {
      if (navigationCounter >= MAX_NAVIGATION) {
        throw new Error("Failed to find 'More menu' button");
      }

      await screenReader.next();
      lastSpokenPhrase = await screenReader.lastSpokenPhrase();
      log(`Last spoken phrase: ${lastSpokenPhrase}`);

      navigationCounter++;
    }

    await screenReader.act();
    lastSpokenPhrase = await screenReader.lastSpokenPhrase();
    log(`Last spoken phrase: ${lastSpokenPhrase}`);

    navigationCounter = 0;

    while (!/Sounds/i.test(lastSpokenPhrase)) {
      if (navigationCounter >= MAX_NAVIGATION) {
        throw new Error("Failed to find 'Sounds' link");
      }

      await screenReader.nextLink();
      lastSpokenPhrase = await screenReader.lastSpokenPhrase();
      log(`Last spoken phrase: ${lastSpokenPhrase}`);

      navigationCounter++;
    }

    await screenReader.act();
    lastSpokenPhrase = await screenReader.lastSpokenPhrase();
    log(`Last spoken phrase: ${lastSpokenPhrase}`);

    log(
      `Spoken phrase log: ${JSON.stringify(
        await screenReader.spokenPhraseLog(),
      )}`,
    );
  });
});
