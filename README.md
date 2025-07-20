Vibe Codingにて作成中。
動作確認取れておりません！！！

# Gmail Data Extractor GAS App

## 1. 概要 (Overview)

本プロジェクトは、Google Apps Script (GAS) を利用し、ユーザーのGmailから指定された検索クエリに基づいてメールデータを抽出する汎用的なWebアプリケーションです。

Web UIを通じて手動で抽出を実行できるほか、Dockerを活用することで、ローカル開発環境をクリーンに保ち、再現性を高めています。

![アプリのスクリーンショット](https://placehold.co/800x450/f0f0f0/333333?text=App%20Screenshot)

## 2. 主な機能 (Features)

- **Web UIによるメール抽出:** ブラウザからGmailの検索クエリと最大取得件数を指定して、メールデータを抽出・表示できます。
- **柔軟な検索:** Gmailがサポートする全ての検索演算子（`from:`, `subject:`, `is:unread`など）を利用可能です。
- **モダンな開発環境:** Dockerと`clasp` (The Apps Script CLI) を利用し、ローカルでの開発とデプロイを効率化します。
- **オープンソース:** MITライセンスのもとで公開されており、自由に改変・利用できます。

## 3. 開発環境のセットアップ (Development Setup)

本プロジェクトでは、開発環境の構築にDockerを使用します。ホストマシンにNode.jsや`clasp`を直接インストールする必要はありません。

### 前提条件 (Prerequisites)

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) または Docker Engine がインストールされていること。
- Googleアカウントを持っていること。

### セットアップ手順 (Setup Steps)

1.  **リポジトリをクローン:**
    ```bash
    git clone [https://github.com/](https://github.com/)<YOUR_USERNAME>/gmail-data-extractor-gas-app.git
    cd gmail-data-extractor-gas-app
    ```

2.  **Dockerコンテナを起動:**
    プロジェクトのルートディレクトリで以下のコマンドを実行し、開発用コンテナをバックグラウンドで起動します。
    ```bash
    docker-compose up -d
    ```

3.  **コンテナに接続:**
    起動したコンテナのシェルに接続します。これ以降の`clasp`コマンドは、すべてこのコンテナ内で実行します。
    ```bash
    docker-compose exec clasp-dev /bin/sh
    ```
    接続すると、プロンプトが `/app #` のようになります。

4.  **`clasp`でGoogleにログイン:**
    コンテナ内で以下のコマンドを実行し、ブラウザ経由でGoogleアカウント認証を行います。
    ```bash
    clasp login
    ```
    表示されるURLをブラウザで開き、アカウントを選択してログインしてください。認証コードが表示されたら、それをコンテナのターミナルに貼り付けます。

5.  **GASプロジェクトの作成:**
    新しいGASプロジェクトをWebアプリとして作成します。
    ```bash
    clasp create --type webapp --title "Gmail Data Extractor" --rootDir ./src
    ```
    このコマンドを実行すると、`.clasp.json`ファイルが自動的に生成（または更新）され、`scriptId`が設定されます。

    **既存のプロジェクトを使用する場合:**
    既存のGASプロジェクトにコードを紐付けたい場合は、`create`の代わりに`clone`を使用します。
    ```bash
    # GASプロジェクトのURLからScript IDをコピーして貼り付け
    clasp clone "YOUR_SCRIPT_ID" --rootDir ./src
    ```

6.  **ソースコードをGASプロジェクトにプッシュ:**
    ローカルのソースコード（`src`ディレクトリ配下）をGoogleのサーバーにアップロードします。
    ```bash
    clasp push
    ```appsscript.json`の`oauthScopes`について警告が表示された場合は、`y`を入力して続行してください。

7.  **完了！**
    これで開発の準備が整いました。コードを編集した後は、再度`clasp push`を実行して変更を反映させてください。

## 4. デプロイと実行 (Deployment & Usage)

1.  **GASプロジェクトを開く:**
    コンテナ内で以下のコマンドを実行すると、ブラウザでGASのWebエディタが開きます。
    ```bash
    clasp open
    ```

2.  **Webアプリとしてデプロイ:**
    - Webエディタ右上の「デプロイ」ボタンをクリックし、「新しいデプロイ」を選択します。
    - 歯車アイコンをクリックし、「ウェブアプリ」を選択します。
    - **説明:** (任意) `Initial deployment`など
    - **次のユーザーとして実行:** `自分` (USER_DEPLOYING)
    - **アクセスできるユーザー:** `自分のみ` (MYSELF)
    - 「デプロイ」ボタンをクリックします。
    - 権限の承認を求められたら、指示に従って承認してください。

3.  **Webアプリにアクセス:**
    デプロイが完了すると、ウェブアプリのURLが表示されます。このURLをコピーしてブラウザで開くと、アプリケーションのUIが表示されます。

4.  **メールを抽出:**
    - 「検索クエリ」と「最大件数」を入力します。
    - 「メールを抽出」ボタンをクリックすると、指定した条件でGmailからメールが検索され、結果が画面に表示されます。

## 5. プロジェクト構成 (Project Structure)

```
/
├── .github/              # GitHub Actions workflows
├── .gitignore            # Files to be ignored by Git
├── .clasp.json           # clasp configuration
├── appsscript.json       # GAS manifest file
├── src/                  # Source code
│   ├── Code.gs           # Server-side logic
│   └── Index.html        # Web UI (HTML, CSS, JS)
├── README.md             # This file
├── LICENSE               # Project license
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Code of conduct
├── Dockerfile            # Docker image definition
└── docker-compose.yml    # Docker Compose configuration
```

## 6. ライセンス (License)

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。