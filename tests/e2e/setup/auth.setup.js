import { test as setup, expect } from '@playwright/test';

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★ 必ず、ご自身のWebアプリのデプロイURLに書き換えてください ★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
const WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

const authFile = 'tests/playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // WebアプリのURLにアクセス
  await page.goto(WEB_APP_URL);
  
  // ログインが必要かどうかを判断（例: "Sign in"ボタンの存在を確認）
  // Googleのログインページは複雑なので、特定の要素で判断するのは難しい場合があります。
  // ここでは、URLがaccounts.google.comを含むかで判断します。
  const isLoginPage = page.url().includes('accounts.google.com');

  if (isLoginPage) {
    console.log('Google login page detected. Please log in manually...');
    // 手動でのログインと承認を待ちます。
    // ログインが成功し、アプリのページにリダイレクトされることを期待します。
    await expect(page).not.toHaveURL(/accounts\.google\.com/, { timeout: 180000 }); // 最大3分待機
  }

  console.log('Login seems complete or was not required.');
  console.log('Saving authentication state...');

  // 現在のページの認証情報（Cookieなど）をファイルに保存
  await page.context().storageState({ path: authFile });
  
  console.log(`Authentication state saved to ${authFile}`);
});