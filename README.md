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

5.  **ソースコードをGASプロジェクトにプッシュ:**
    ローカルのソースコード（`src`ディレクトリ配下）をGoogleのサーバーにアップロードします。
    ```bash
    # /app # のようなプロンプトで実行
    clasp push
    ```appsscript.json`の`oauthScopes`について警告が表示された場合は、`y`を入力して続行してください。

6.  **完了！**
    これで開発の準備が整いました。コードを編集した後は、再度`clasp push`を実行して変更を反映させてください。

## 4. デプロイと実行 (Deployment & Usage)

1.  **GASプロジェクトを開く:**
    コンテナ内で以下のコマンドを実行すると、ブラウザでGASのWebエディタが開きます。
    ```bash
    # /app # のようなプロンプトで実行
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
