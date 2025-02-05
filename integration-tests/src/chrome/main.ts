import { Builder, By, WebDriver, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const timeout: number = 10000;
const headless: boolean = true;
const url: string = 'http://127.0.0.1:8080';

async function runSeleniumTest() {
  const chromeOptions = new chrome.Options();
  if (headless) {
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
  }
  const driver: WebDriver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    await driver.get(url);

    // Check the title of the page
    await driver.wait(
      until.titleIs('Essentials of Health Informatics'),
      timeout
    );

    // Check main banner is displayed
    const imageElement = await driver.findElement(
      By.css('img[src="./media/single-rj45.jpg"]')
    );
    const isImageDisplayed = await imageElement.isDisplayed();
    if (!isImageDisplayed) {
      throw new Error("'single-rj45.jpg' image is not displayed");
    }

    // Check the 'Chapters' page
    await driver.get(`${url}/chapters/`);

    // Check the title of the chapters page
    await driver.wait(
      until.elementLocated(By.xpath("//h1[text()='Chapters']")),
      timeout
    );

    // Check the for the 'Introduction to Health Informatics' h2 header
    await driver.wait(
      until.elementLocated(
        By.xpath("//h2[text()='Introduction to Health Informatics']")
      ),
      timeout
    );

    // Check the 'Code Documentation' chapter
    await driver.get(`${url}/chapters/code-documentation/`);

    // Check the title of the code documentation page
    await driver.wait(
      until.titleIs('Essentials of Health Informatics Code Documentation'),
      timeout
    );

    console.log('\x1b[34m%s\x1b[0m', 'Completed successfully');
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', 'Failed!');
    console.error(error);
    await driver.quit();
    process.exit(1);
  } finally {
    await driver.quit();
  }
}

runSeleniumTest().catch(console.error);
