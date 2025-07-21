<details>
<summary>日本語 (Japanese)</summary>

# Gmail Data Extractor GAS App

## 1. 概要 (Overview)

本プロジェクトは、Google Apps Script (GAS) を利用し、ユーザーのGmailから指定された検索クエリに基づいてメールデータを抽出する汎用的なWebアプリケーションです。

Web UIを通じて手動で抽出を実行できるほか、Dockerを活用することで、ローカル開発環境をクリーンに保ち、再現性を高めています。

![アプリのスクリーンショット](./.assets/screenshot.png)

> **Note:** 上記のスクリーンショットを表示するには、このリポジトリに`.assets/screenshot.png`という名前で画像を配置してください。

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
    git clone [https://github.com/yutaro89/Gmail-Data-Extractor-GAS-App.git](https://github.com/yutaro89/Gmail-Data-Extractor-GAS-App.git)
    cd Gmail-Data-Extractor-GAS-App
    ```

2.  **Dockerイメージの再構築とコンテナの起動:**
    プロジェクトのルートディレクトリで以下のコマンドを実行します。`Dockerfile`が更新されたため、`--build`フラグを付けてイメージを再構築し、コンテナを起動します。
    ```bash
    docker compose up -d --build
    ```

3.  **`clasp`でGoogleにログイン (重要):**
    Dockerコンテナ内からのログインは少し特殊な手順が必要です。**ターミナルを2つ使って作業します。**

    **【ターミナル ①】 - `clasp login` を実行する**
    a. 以下のコマンドでコンテナのシェルに接続します。
    ```bash
    docker compose exec clasp-dev /bin/sh
    ```
    b. コンテナ内で `clasp login` を実行します。
    ```bash
    # /app # のようなプロンプトで実行
    clasp login
    ```
    c. `Authorize clasp by visiting this URL:` の後に表示される `https://accounts.google.com/...` から始まる長いURLをコピーします。
    d. ホストPCのブラウザでそのURLを開き、Googleアカウントでログインして、権限を許可（続行）します。
    e. 許可すると、ブラウザは `http://localhost:xxxx` のようなアドレスにリダイレクトしようとして「このサイトにアクセスできません」といったエラー画面になります。**それで正常です。**
    f. そのエラー画面に表示されているURL（`http://localhost:xxxx/?code=4/0A...` のような形式）をすべてコピーします。
    g. **このターミナル①は、このまま待機させておきます。**

    **【ターミナル ②】 - 認証コードをコンテナに渡す**
    a. PCで**新しいターミナル**を開きます。
    b. 以下のコマンドを実行します。`'コピーしたURL'` の部分を、先ほど手順(f)でコピーしたURLに置き換えてください。**URLは必ずシングルクォート(')で囲ってください。**
    ```bash
    docker compose exec clasp-dev curl 'コピーしたURL'
    ```
    c. このコマンドを実行すると、ターミナル①の方で `Logged in successfully.` と表示され、ログインが完了します。

4.  **GASプロジェクトの作成と紐付け (推奨手順):**
    `clasp create`コマンドが不安定な場合があるため、手動でプロジェクトを作成し、`clasp clone`で紐付ける方法を推奨します。

    a. **ブラウザでGASプロジェクトを作成:**
       - [script.google.com](https://script.google.com/home/my) にアクセスします。
       - 「新しいプロジェクト」をクリックします。
       - 左上の「無題のプロジェクト」をクリックし、`Gmail Data Extractor` のような分かりやすい名前に変更します。

    b. **スクリプトIDをコピー:**
       - 左側のメニューから「プロジェクトの設定」（歯車アイコン）をクリックします。
       - 「ID」の項目にある「スクリプトID」をコピーします。

    c. **`clasp clone` を実行:**
       - ログインが完了している**ターミナル①**に戻ります。
       - 以下のコマンドを実行します。`YOUR_SCRIPT_ID`の部分を、先ほどコピーしたスクリプトIDに置き換えてください。
    ```bash
    # /app # のようなプロンプトで実行
    clasp clone "YOUR_SCRIPT_ID" --rootDir ./src
    ```
    このコマンドにより、`.clasp.json`ファイルが正しく生成されます。

5.  **Apps Script APIの有効化 (初回のみ):**
    `clasp push`を初めて実行する前に、お使いのGoogleアカウントで **Apps Script API** を有効にする必要があります。
    
    a. **[こちら](https://script.google.com/home/usersettings)のリンクから設定ページにアクセスします。**
    
    b. 「Google Apps Script API」の項目を見つけ、スイッチを「オン」に切り替えます。
    
    c. 設定の変更がシステム全体に反映されるまで数分かかることがあります。

6.  **ソースコードをGASプロジェクトにプッシュ:**
    APIを有効にした後、ターミナル①で以下のコマンドを実行します。
    ```bash
    # /app # のようなプロンプトで実行
    clasp push
    ```appsscript.json`の`oauthScopes`について警告が表示された場合は、`y`を入力して続行してください。

7.  **完了！**
    これで開発の準備が整いました。コードを編集した後は、再度`clasp push`を実行して変更を反映させてください。

## 4. デプロイと実行 (Deployment & Usage)

1.  **GASプロジェクトを開く:**
    `clasp open`コマンドはバージョンによって動作しないことがあるため、より確実な方法としてブラウザで直接プロジェクトを開きます。

    a. **スクリプトIDを確認:** 以下のコマンドで、`.clasp.json`ファイルに保存されているスクリプトIDを確認します。
    ```bash
    # /app # のようなプロンプトで実行
    cat .clasp.json
    ```
    b. **URLを開く:** ホストPCのブラウザで、以下のURLにアクセスします。`YOUR_SCRIPT_ID`の部分を、上記で確認したIDに置き換えてください。
    `https://script.google.com/d/YOUR_SCRIPT_ID/edit`

2.  **Webアプリとしてデプロイ:**
    - Webエディタ右上の「デプロイ」ボタンをクリックし、「新しいデプロイ」を選択します。
    - 歯車アイコンをクリックし、「ウェブアプリ」を選択します。
    - **説明:** (任意) `Initial deployment`など
    - **次のユーザーとして実行:** `自分` (USER_DEPLOYING)
    - **アクセスできるユーザー:** `自分のみ` (MYSELF)
    - 「デプロイ」ボタンをクリックします。

3.  **Webアプリへのアクセスと権限の許可 (初回のみ):**
    デプロイが完了すると、ウェブアプリのURLが表示されます。このURLに初めてアクセスすると、「Google hasn't verified this app (このアプリは Google で確認されていません)」という警告画面が表示されますが、これは正常な動作です。

    a. **警告画面を回避:**
       - **「詳細」** (Advanced) をクリックします。
       - **「(アプリ名)に移動（安全ではないページ）」** (Go to [App Name] (unsafe)) をクリックします。

    b. **権限を許可:**
       - 次の画面で、このアプリが要求する権限の一覧が表示されます。
       - 内容を確認し、**「許可」** (Allow) をクリックします。

    これでアプリケーションが表示され、利用できるようになります。

## 5. テスト (Testing)

アプリケーションが正しく動作することを確認するための手動テストケースをまとめています。機能の追加や修正を行った際は、以下のドキュメントを参照してリグレッションテストを実施してください。

- **[TESTING.md](./TESTING.md)**

## 6. プロジェクト構成 (Project Structure)

```
/
├── .github/              # GitHub Actions workflows
├── .gitignore            # Files to be ignored by Git
├── .clasp.json           # clasp configuration (Important: Do not ignore)
├── appsscript.json       # GAS manifest file
├── src/                  # Source code
│   ├── Code.gs           # Server-side logic
│   └── Index.html        # Web UI (HTML, CSS, JS)
├── README.md             # This file
├── TESTING.md            # Manual testing guide
├── LICENSE               # Project license
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Code of conduct
├── Dockerfile            # Docker image definition
└── docker-compose.yml    # Docker Compose configuration
```

## 7. ライセンス (License)

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

</details>

<details open>
<summary>English</summary>

# Gmail Data Extractor GAS App

## 1. Overview

This project is a versatile web application built with Google Apps Script (GAS) that extracts email data from a user's Gmail account based on a specified search query.

It allows manual extraction through a web UI and utilizes Docker to maintain a clean and reproducible local development environment.

![App Screenshot](./.assets/screenshot.png)

> **Note:** To display the screenshot above, place an image named `screenshot.png` in the `.assets/` directory of this repository.

## 2. Features

- **Email Extraction via Web UI:** Specify a Gmail search query and the maximum number of results to extract and display email data directly from your browser.
- **Flexible Search:** Supports all search operators provided by Gmail (e.g., `from:`, `subject:`, `is:unread`).
- **Modern Development Environment:** Streamlines local development and deployment using Docker and `clasp` (The Apps Script CLI).
- **Open Source:** Published under the MIT License, allowing you to freely modify and use the code.

## 3. Development Setup

This project uses Docker to build the development environment. You do not need to install Node.js or `clasp` directly on your host machine.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine must be installed.
- A Google Account.

### Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yutaro89/Gmail-Data-Extractor-GAS-App.git](https://github.com/yutaro89/Gmail-Data-Extractor-GAS-App.git)
    cd Gmail-Data-Extractor-GAS-App
    ```

2.  **Build the Docker image and start the container:**
    In the project root directory, run the following command. The `--build` flag rebuilds the image, which is necessary if the `Dockerfile` has been updated.
    ```bash
    docker compose up -d --build
    ```

3.  **Log in to Google with `clasp` (Important):**
    Logging in from within a Docker container requires a special procedure using **two terminals**.

    **[Terminal ①] - Run `clasp login`**
    a. Connect to the container's shell:
    ```bash
    docker compose exec clasp-dev /bin/sh
    ```
    b. Run `clasp login` inside the container:
    ```bash
    # Run this at a prompt like /app #
    clasp login
    ```
    c. Copy the long URL that appears after `Authorize clasp by visiting this URL:`, which starts with `https://accounts.google.com/...`.
    d. Open this URL in your host machine's browser, log in to your Google account, and grant the necessary permissions.
    e. After granting permission, your browser will try to redirect to an address like `http://localhost:xxxx` and show an error like "This site can’t be reached." **This is normal.**
    f. Copy the entire URL from the address bar of that error page (it will look like `http://localhost:xxxx/?code=4/0A...`).
    g. **Leave Terminal ① open and waiting.**

    **[Terminal ②] - Pass the authorization code to the container**
    a. Open a **new terminal** on your computer.
    b. Run the following command. Replace `'COPIED_URL'` with the URL you copied in step (f). **Make sure to enclose the URL in single quotes (').**
    ```bash
    docker compose exec clasp-dev curl 'COPIED_URL'
    ```
    c. After running this command, you should see `Logged in successfully.` in Terminal ①.

4.  **Create and link the GAS project (Recommended):**
    Since `clasp create` can sometimes be unstable, the recommended method is to create the project manually in the browser and then link it using `clasp clone`.

    a. **Create a GAS project in your browser:**
       - Go to [script.google.com](https://script.google.com/home/my).
       - Click "New project".
       - Click on "Untitled project" in the top-left and rename it to something recognizable, like `Gmail Data Extractor`.

    b. **Copy the Script ID:**
       - In the left sidebar, click on "Project Settings" (the gear icon).
       - Under "IDs", copy the "Script ID".

    c. **Run `clasp clone`:**
       - Return to **Terminal ①**, where you are logged in.
       - Run the following command, replacing `YOUR_SCRIPT_ID` with the ID you just copied.
    ```bash
    # Run this at a prompt like /app #
    clasp clone "YOUR_SCRIPT_ID" --rootDir ./src
    ```
    This command will correctly generate the `.clasp.json` file.

5.  **Enable the Apps Script API (First time only):**
    Before you can `clasp push` for the first time, you must enable the Apps Script API for your Google Account.
    
    a. **Visit the settings page using [this link](https://script.google.com/home/usersettings).**
    
    b. Find the "Google Apps Script API" setting and turn the switch "On".
    
    c. It may take a few minutes for the setting to take effect.

6.  **Push the source code to the GAS project:**
    After enabling the API, run the following command in Terminal ①:
    ```bash
    # Run this at a prompt like /app #
    clasp push
    ```
    If you see a warning about `oauthScopes` in `appsscript.json`, type `y` to proceed.

7.  **Done!**
    Your development environment is now ready. After editing your code, run `clasp push` again to sync your changes.

## 4. Deployment & Usage

1.  **Open the GAS Project:**
    Since `clasp open` can be unreliable depending on the version, it's more robust to open the project directly in your browser.

    a. **Get the Script ID:** Check the script ID stored in your `.clasp.json` file.
    ```bash
    # Run this at a prompt like /app #
    cat .clasp.json
    ```
    b. **Open the URL:** In your host machine's browser, navigate to the following URL, replacing `YOUR_SCRIPT_ID` with the ID from the previous step.
    `https://script.google.com/d/YOUR_SCRIPT_ID/edit`

2.  **Deploy as a Web App:**
    - In the top-right of the web editor, click the "Deploy" button and select "New deployment".
    - Click the gear icon and select "Web app".
    - **Description:** (Optional) e.g., `Initial deployment`
    - **Execute as:** `Me` (USER_DEPLOYING)
    - **Who has access:** `Only myself` (MYSELF)
    - Click "Deploy".

3.  **Access the Web App and Grant Permissions (First time only):**
    Once deployed, a URL for the web app will be displayed. When you first visit this URL, you will see a warning screen saying "Google hasn't verified this app." This is normal.

    a. **Bypass the warning:**
       - Click **"Advanced"**.
       - Click **"Go to [App Name] (unsafe)"**.

    b. **Grant permissions:**
       - On the next screen, a list of permissions required by the app will be displayed.
       - Review them and click **"Allow"**.

    The application will now load and be ready to use.

## 5. Testing

Manual test cases to ensure the application works correctly are outlined in this document. Please refer to it to perform regression testing after making changes or adding features.

- **[TESTING.md](./TESTING.md)**

## 6. Project Structure

```
/
├── .github/              # GitHub Actions workflows
├── .gitignore            # Files to be ignored by Git
├── .clasp.json           # clasp configuration (Important: Do not ignore)
├── appsscript.json       # GAS manifest file
├── src/                  # Source code
│   ├── Code.gs           # Server-side logic
│   └── Index.html        # Web UI (HTML, CSS, JS)
├── README.md             # This file
├── TESTING.md            # Manual testing guide
├── LICENSE               # Project license
├── CONTRIBUTING.md       # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Code of conduct
├── Dockerfile            # Docker image definition
└── docker-compose.yml    # Docker Compose configuration
```

## 7. License

This project is licensed under the [MIT License](LICENSE).

</details>