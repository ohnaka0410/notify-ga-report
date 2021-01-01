import { GoogleAnalyticsDataSource } from './datasource/GoogleAnalyticsDataSource';
import { SlackNotifier } from './notifier/SlackNotifier';

/**
 * 設定オブジェクト
 */
const config = {
  webhookUrl: PropertiesService.getScriptProperties().getProperty('webhookUrl') || '',
  spreadSheetUrl: PropertiesService.getScriptProperties().getProperty('spreadSheetUrl') || '',
  sheetName: PropertiesService.getScriptProperties().getProperty('sheetName') || '',
  triggerName: PropertiesService.getScriptProperties().getProperty('triggerName') || '',
};

/**
 * メイン処理クラス
 */
class Main {
  private dataSource: GoogleAnalyticsDataSource;

  private notifier: SlackNotifier;

  /**
   * コンストラクタ
   */
  constructor(dataSource: GoogleAnalyticsDataSource, notifier: SlackNotifier) {
    this.dataSource = dataSource;
    this.notifier = notifier;
  }

  /**
   * 実行処理
   */
  run() {
    const { reportList } = this.dataSource;
    for (const report of reportList) {
      this.notifier.notify(report);
    }
    this.deleteTrigger();
  }

  /**
   * トリガー削除
   */
  deleteTrigger() {
    const triggerList: GoogleAppsScript.Script.Trigger[] = ScriptApp.getProjectTriggers();
    for (const trigger of triggerList) {
      if (trigger.getHandlerFunction() === config.triggerName) {
        ScriptApp.deleteTrigger(trigger);
      }
    }
  }
}

/**
 * 実行用関数
 */
function run() { // @typescript-eslint/no-unused-vars
  // データソース生成
  const dataSource = new GoogleAnalyticsDataSource(config.spreadSheetUrl, config.sheetName);
  // 通知クラス生成
  const notifier = new SlackNotifier(config.webhookUrl);

  const main = new Main(dataSource, notifier);
  main.run();
}

/**
 * トリガーセット
 */
function setTrigger() { // @typescript-eslint/no-unused-vars
  const triggerDay: Date = new Date();
  triggerDay.setHours(2);
  triggerDay.setMinutes(0);
  ScriptApp.newTrigger(config.triggerName).timeBased().at(triggerDay).create();
}
