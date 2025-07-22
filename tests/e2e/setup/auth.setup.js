import { test as setup } from '@playwright/test';

const authFile = 'tests/playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // 環境変数から各種設定を取得
  const email = process.env.GOOGLE_EMAIL;
  const password = process.env.GOOGLE_PASSWORD;
  const WEB_APP_URL = process.env.WEB_APP_URL;

  if (!email || !password || !WEB_APP_URL) {
    throw new Error('Required environment variables not set in .env file.');
  }
  
  // 1. Webアプリにアクセス
  await page.goto(WEB_APP_URL);

  // 2. メールアドレスを入力
  await page.locator('input[type="email"]').fill(email);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // 3. パスワードの入力欄が表示されるのを待つ
  console.log(await page.content()); // ← この行に変更
  await page.waitForSelector('input[type="password"]');
  
  // 4. パスワードを入力
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: 'Next' }).click();
  
  // 5. ログインが完了し、元のWebアプリのURLに戻るのを待つ
  await page.waitForURL(url => !url.includes("accounts.google.com"));

  // 6. 現在のページの認証情報をファイルに保存
  await page.context().storageState({ path: authFile });
  console.log(`Authentication state saved to ${authFile}`);
});