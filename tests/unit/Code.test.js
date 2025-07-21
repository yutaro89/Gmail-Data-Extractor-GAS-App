// getEmails関数をインポート
// `jest.mock`が`require`より先に評価されるように、モジュールのモックを先に記述
global.GmailApp = {
  search: jest.fn(),
};
global.Logger = {
  log: jest.fn(),
};

// `Code.gs`内の`GmailApp`と`Logger`が上記モックを使うように設定
jest.mock('../../src/Code.gs', () => {
  const originalModule = jest.requireActual('../../src/Code.gs');
  return {
    __esModule: true,
    ...originalModule,
  };
});

const { getEmails } = require('../../src/Code.gs');

// テストケースを記述
describe('getEmails', () => {

  // 各テストの前にモックをリセット
  beforeEach(() => {
    // `search`メソッドのモックをクリアし、デフォルトで空配列を返すように再設定
    GmailApp.search.mockClear().mockReturnValue([]);
    Logger.log.mockClear();
  });

  it('検索クエリが空文字列の場合、エラーをスローする', () => {
    // 期待する挙動：関数を呼び出すとエラーが発生すること
    expect(() => getEmails('')).toThrow('Search query must be a non-empty string.');
  });
  
  it('検索クエリがnullの場合、エラーをスローする', () => {
    expect(() => getEmails(null)).toThrow('Search query must be a non-empty string.');
  });

  it('有効なクエリで呼び出された場合、GmailApp.searchを正しい引数で呼び出す', () => {
    const query = 'is:unread';
    const max = 50;
    getEmails(query, max);
    // 期待する挙動：GmailApp.searchが正しい引数で1回呼ばれたこと
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