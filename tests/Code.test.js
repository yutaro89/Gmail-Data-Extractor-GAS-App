// getEmails関数をインポート
const { getEmails } = require('./src/Code.gs');

// GASのグローバルオブジェクトをモックする
global.GmailApp = {
  // searchメソッドの挙動を偽装
  search: jest.fn().mockReturnValue([]), // デフォルトでは空配列を返す
};

global.Logger = {
  log: jest.fn(), // Logger.logが呼ばれたことを確認できるようにする
};

// テストケースを記述
describe('getEmails', () => {

  // 各テストの前にモックをリセット
  beforeEach(() => {
    GmailApp.search.mockClear();
    Logger.log.mockClear();
  });

  it('検索クエリが空文字列の場合、エラーをスローする', () => {
    // 期待する挙動：関数を呼び出すとエラーが発生すること
    expect(() => getEmails('')).toThrow('Search query must be a non-empty string.');
  });

  it('有効なクエリで呼び出された場合、GmailApp.searchを正しい引数で呼び出す', () => {
    const query = 'is:unread';
    const max = 50;
    getEmails(query, max);
    // 期待する挙動：GmailApp.searchが正しい引数で1回呼ばれたこと
    expect(GmailApp.search).toHaveBeenCalledWith(query, 0, max);
  });
  
  // 他にも「不正なmaxResultsの場合」などのテストケースを追加できます
});