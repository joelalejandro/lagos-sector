export default class Score {
  constructor() {
    this.__element__ = window.document.createElement('score');
    this.__element__.controllerObject = this;
    this.__meta__ = { score: 0 };
    document.body.appendChild(this.__element__);
    this.refreshScoreUI();
  }

  increaseBy(points) {
    this.__meta__.score += points;
    this.refreshScoreUI();
  }

  decreaseBy(points) {
    this.__meta__.score -= points;
    this.refreshScoreUI();
  }

  refreshScoreUI() {
    const score = this.__meta__.score.toString();
    this.__element__.textContent = "0".repeat(8).substr(0, 8 - score.length) + score;
  }
}
