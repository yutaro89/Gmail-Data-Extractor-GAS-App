# テスト実施ガイド (Testing Guide)

このプロジェクトには、「ユニットテスト」と「E2Eテスト」の2種類のテストが用意されています。

---

## ユニットテスト (Unit Testing)

サーバーサイドのロジック (`src/Code.gs`) の単体機能を検証します。

-   **ツール**: [Jest](https://jestjs.io/)
-   **テストコード**: `tests/unit/` ディレクトリ内に配置します。

### 実行方法

1.  開発用のDockerコンテナに接続します。
    ```bash
    docker compose exec clasp-dev /bin/sh
    ```

2.  コンテナ内で、以下のコマンドを実行します。
    ```bash
    # /app # のようなプロンプトで実行
    npm run test:unit
    ```

---

## E2Eテスト (End-to-End Testing)

実際にWebアプリをブラウザで操作し、ユーザーの一連の操作をシミュレートして全体の動作を検証します。

-   **ツール**: [Playwright](https://playwright.dev/)
-   **テストコード**: `tests/e2e/` ディレクトリ内に配置します。
-   **実行環境**: E2Eテスト専用のDocker環境を使用します。（開発用コンテナとは別です）

### 実行手順

#### ステップ1: 初回セットアップ（認証情報の保存）

E2EテストではGoogleへのログインが必要なため、最初に一度だけ手動でログインし、その状態を保存します。

1.  以下のコマンドを実行すると、Playwrightのブラウザが起動します。
    ```bash
    # ホストマシンで実行
    docker compose -f tests/docker-compose.e2e.yml run --rm e2e-tester npm run test:e2e:auth
    ```

2.  開かれたブラウザで、**手動でGoogleアカウントにログイン**し、アプリの権限を許可してください。

3.  ログインが完了すると、認証情報が `tests/playwright/.auth/` ディレクトリに保存されます。このファイルは`.gitignore`で管理対象外となっています。

#### ステップ2: テストの実行

セットアップ完了後、以下のコマンドでいつでもE2Eテストを実行できます。

1.  E2Eテスト用のコンテナを起動し、テストを実行します。
    ```bash
    # ホストマシンで実行
    docker compose -f tests/docker-compose.e2e.yml run --rm e2e-tester npm run test:e2e
    ```
