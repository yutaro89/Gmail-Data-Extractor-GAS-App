import { test, expect } from '@playwright/test';

// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
// ★ 必ず、ご自身のWebアプリのデプロイURLに書き換えてください ★
// ★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★
const WEB_APP_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

test.describe('Gmail Data Extractor E2E Test', () => {
  test.beforeEach(async ({ page }) => {
    // 各テストの前にWebアプリのURLにアクセス
    await page.goto(WEB_APP_URL);
  });

  test('should extract emails with a valid query', async ({ page }) => {
    // GAS Webアプリはiframe内に描画されるため、iframeを特定
    const iframe = page.frameLocator('iframe');

    // クエリを入力
    await iframe.locator('#searchQuery').fill('is:starred');
    
    // ボタンをクリック
    await iframe.locator('#extractButton').click();

    // 結果が表示されるのを待つ
    const resultItem = iframe.locator('.result-item').first();
    await expect(resultItem).toBeVisible({ timeout: 30000 }); // 実行に時間がかかるため長めに待つ

    // 結果の件名に何かテキストが含まれていることを確認
    const subject = await resultItem.locator('h3').textContent();
    expect(subject).not.toBeNull();
    expect(subject.length).toBeGreaterThan(0);
  });

  test('should show an error for an empty query', async ({ page }) => {
    const iframe = page.frameLocator('iframe');
    
    // 検索クエリを空にする
    await iframe.locator('#searchQuery').fill('');

    // ボタンをクリック
    await iframe.locator('#extractButton').click();

    // エラーメッセージが表示されることを確認
    const statusDiv = iframe.locator('#status');
    await expect(statusDiv).toBeVisible();
    await expect(statusDiv).toHaveClass(/status-error/);
    await expect(statusDiv).toContainText('Search query must be a non-empty string');
  });
});