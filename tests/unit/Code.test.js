// ファイルパス: tests/unit/Code.test.js

const fs = require('fs');
const path = require('path');

// グローバルに関数とモックを定義
global.GmailApp = {
  search: jest.fn(),
};
global.Logger = {
  log: jest.fn(),
};

// Code.gsのコードを文字列として読み込む
const code = fs.readFileSync(path.resolve(__dirname, '../../src/Code.gs'), 'utf8');
// 読み込んだコードを実行して、グローバル空間に関数を定義する
eval(code);


// テストケースを記述
describe('getEmails', () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    GmailApp.search.mockClear().mockReturnValue([]);
    Logger.log.mockClear();
  });

  it('検索クエリが空文字列の場合、エラーをスローする', () => {
    expect(() => getEmails('')).toThrow('Search query must be a non-empty string.');
  });

  it('検索クエリがnullの場合、エラーをスローする', () => {
    expect(() => getEmails(null)).toThrow('Search query must be a non-empty string.');
  });

  it('有効なクエリで呼び出された場合、GmailApp.searchを正しい引数で呼び出す', () => {
    const query = 'is:unread';
    const max = 50;
    getEmails(query, max);
    expect(GmailApp.search).toHaveBeenCalledWith(query, 0, max);
  });

  it('maxResultsが指定されない場合、デフォルト値(100)で呼び出す', () => {
    const query = 'is:important';
    getEmails(query);
    expect(GmailApp.search).toHaveBeenCalledWith(query, 0, 100);
  });

  it('maxResultsが500を超える場合、500で呼び出す', () => {
    const query = 'is:starred';
    getEmails(query, 999);
    expect(GmailApp.search).toHaveBeenCalledWith(query, 0, 500);
  });
});