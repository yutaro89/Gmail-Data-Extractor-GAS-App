const { defineConfig, devices } = require('@playwright/test');
const path = require('path');

// 保存する認証情報のパス
const AUTH_FILE = path.join(__dirname, 'playwright/.auth/user.json');

module.exports = defineConfig({
  // テストファイルが格納されているディレクトリ
  testDir: './e2e',

  // すべてのテストが完了するまでの最大時間（ミリ秒）
  timeout: 60 * 1000,

  // アサーションのデフォルトタイムアウト
  expect: {
    timeout: 10000,
  },

  // 並列実行を有効にする
  fullyParallel: true,

  // 失敗したテストのリトライ回数（CI環境でのみ）
  retries: process.env.CI ? 2 : 0,

  // レポーターの設定
  reporter: 'html',

  use: {
    // 各テストステップのアクションを追跡する
    trace: 'on-first-retry',
  },

  // プロジェクトごとの設定
  projects: [
    // 認証を行うためのセットアッププロジェクト
    {
      name: 'setup',
      testMatch: /.*\.setup\.js/,
    },

    // 認証済みの状態でテストを実行するメインプロジェクト
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // 保存した認証情報を使ってテストを実行
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'], // 'setup'プロジェクトが完了してから実行
    },
  ],
});