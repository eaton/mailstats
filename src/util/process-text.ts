import natural from 'natural';

export class NLP {
  private _sentiment?: natural.SentimentAnalyzer;
  private _classifier?: natural.ClassifierBase;

  getWords(text: string) {
    return text.split(/\s+/);
  }

  get sentiment() {
    this._sentiment ??= new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
    return this._sentiment;
  }

  get classifier() {
    this._classifier ??= new natural.LogisticRegressionClassifier(natural.PorterStemmer);
    return this._classifier;
  }

  stripQuotedLines(text: string) {
    let val = text.split(/-+\s*Original Message\s*-+/)[0];
    val = val.split('\n')
      .filter(s => !s.startsWith('>'))
      .filter(s => (!s.startsWith('On ') && !s.endsWith(', wrote:')))
      .join('\n');
    return val;
  }
}
