const puppeteer = require('puppeteer');

module.exports = async function Login(options = {}) {
  const browser = await puppeteer.launch({
    headless: options.headless,
    args: options.args || ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 1280, height: 800 });
    await page.setRequestInterception(true);
    page.on('request', preventApplicationRedirect(options.callbackUrl));

    await page.goto(options.loginUrl);

    // Enter credentials.
    await writeUsername({ page, options });
    await writePassword({ page, options });

    // The press login.
    const response = await clickLogin({ page, options });

    // The login failed.
    if (response.status() >= 400) {
      throw new Error(`'Login with user ${options.username} failed, error ${response.status()}`);
    }

    // Redirected to MFA/consent/... which is not implemented yet.
    const url = response.url();
    if (url.indexOf(options.callbackUrl) !== 0) {
      throw new Error(`User was redirected to unexpected location: ${url}`);
    }

    // Now let's fetch all cookies.
    const { cookies } = await page._client.send('Network.getAllCookies', {});
    return {
      callbackUrl: url,
      cookies
    };
  } finally {
    await page.close();
    await browser.close();
  }
};

async function writeUsername({ page, options } = {}) {
  await page.waitForSelector('#username');
  await page.type('#username', options.username);
}

async function writePassword({ page, options } = {}) {
  await page.waitForSelector('#password', { visible: true });
  await page.type('#password', options.password);
}

async function clickLogin({ page } = {}) {
  await page.waitForSelector('.ulp-button', {
    visible: true,
    timeout: 5000
  });

  const [response] = await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), page.click('.ulp-button')]);
  return response;
}

function preventApplicationRedirect(callbackUrl) {
  return (request) => {
    const url = request.url();
    if (request.isNavigationRequest() && url.indexOf(callbackUrl) === 0) request.respond({ body: url, status: 200 });
    else request.continue();
  };
}
