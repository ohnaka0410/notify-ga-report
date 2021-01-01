/**
 * Slack通知クラス
 */
class SlackNotifier {
  private webhookUrl: string;

  private defaultParams: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
    method: 'post',
    contentType: 'application/json',
  };

  /**
   * コンストラクタ
   */
  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  /**
   * 通知処理
   */
  notify({ title, text }: { text: string; title: string }) {
    // メッセージを分割する
    const chunkedMessageList = SlackNotifier.chunk(text);
    chunkedMessageList.unshift(title);
    // メッセージを送信する

    chunkedMessageList.forEach((chunkedMessage) => {
      // 送信パラメータの構築
      const params: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        ...this.defaultParams,
        payload: JSON.stringify({
          text: chunkedMessage,
        }),
      };
      // 送信処理
      UrlFetchApp.fetch(this.webhookUrl, params);
    });
  }

  /**
   * メッセージを投稿上限行数で分割する
   */
  private static chunk(message: string): string[] {
    // 1投稿あたり40行まで
    const limit: number = 40;
    // 改行コードで分割(+改行コードの統一)
    const messageList: string[] = message.replace(/\r?\n/g, '\n').split('\n');

    const chunkedMessageList = [];
    let index: number = 0;

    // 上限行数毎に配列にセットする
    while (index < messageList.length) {
      chunkedMessageList.push(`\`\`\`${messageList.slice(index, index + limit).join('\n')}\`\`\``);
      index += limit;
    }

    return chunkedMessageList;
  }
}

export { SlackNotifier };
export default SlackNotifier;
