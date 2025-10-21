// レーキ計算アプリケーション
class RakeCalculatorApp {
  constructor() {
    this.currentQuestion = 0;
    this.totalQuestions = 20;
    this.correctAnswers = 0;
    this.questions = [];
    this.currentAnswer = null;
    
    // デフォルト設定
    this.settings = {
      rakeRate: 10,        // レーキ率（%）
      roundingUnit: 20,   // 切り上げ単位（点）
      roundingMode: 'ceil', // 丸め方法（ceil/floor/round）
      maxRake: 50,        // 最大レーキ（点）
      maxPot: 1000,       // ポットの最大額（点）
      minChip: 1          // 最小チップ額（点）
    };
    
    this.initializeElements();
    this.bindEvents();
    this.loadSettings();
    this.showScreen('main-screen');
    this.updateStats();
  }

  // DOM要素の初期化
  initializeElements() {
    // 画面要素
    this.screens = {
      main: document.getElementById('main-screen'),
      settings: document.getElementById('settings-screen'),
      rules: document.getElementById('rules-screen'),
      practice: document.getElementById('practice-screen'),
      result: document.getElementById('result-screen'),
      calculator: document.getElementById('calculator-screen'),
      finalResult: document.getElementById('final-result-screen')
    };

    // タイトル要素
    this.titleElement = document.getElementById('main-title');

    // 統計要素
    this.statsElements = {
      totalQuestions: document.getElementById('total-questions'),
      correctCount: document.getElementById('correct-count'),
      accuracy: document.getElementById('accuracy')
    };

    // 練習画面要素
    this.practiceElements = {
      progressFill: document.getElementById('progress-fill'),
      progressText: document.getElementById('progress-text'),
      questionText: document.getElementById('question-text'),
      answerInput: document.getElementById('answer-input'),
      submitBtn: document.getElementById('submit-btn')
    };

    // 結果画面要素
    this.resultElements = {
      resultIcon: document.getElementById('result-icon'),
      resultTitle: document.getElementById('result-title'),
      resultMessage: document.getElementById('result-message'),
      potValue: document.getElementById('pot-value'),
      correctAnswer: document.getElementById('correct-answer'),
      userAnswer: document.getElementById('user-answer')
    };

    // 最終結果画面要素
    this.finalResultElements = {
      finalTotal: document.getElementById('final-total'),
      finalCorrect: document.getElementById('final-correct'),
      finalAccuracy: document.getElementById('final-accuracy'),
      encouragement: document.getElementById('encouragement')
    };

    // 設定画面要素
    this.settingsElements = {
      rakeRate: document.getElementById('rake-rate'),
      // roundingUnit: document.getElementById('rounding-unit'), // コメントアウト
      roundingMode: document.querySelectorAll('input[name="rounding-mode"]'),
      maxRake: document.getElementById('max-rake'),
      maxPot: document.getElementById('max-pot'),
      minChip: document.getElementById('min-chip'),
      preview101: document.getElementById('preview-101'),
      preview206: document.getElementById('preview-206')
    };

    // ルール画面要素
    this.rulesElements = {
      basicRuleText: document.getElementById('basic-rule-text'),
      calculationExamples: document.getElementById('calculation-examples'),
      calculationFormula: document.getElementById('calculation-formula'),
      maxRakeNote: document.getElementById('max-rake-note')
    };

    // レーキ計算機画面要素
    this.calculatorElements = {
      potInput: document.getElementById('pot-input'),
      calculateBtn: document.getElementById('calculate-rake-btn'),
      resultSection: document.getElementById('calculator-result'),
      potDisplay: document.getElementById('calc-pot-display'),
      rateDisplay: document.getElementById('calc-rate-display'),
      finalRakeDisplay: document.getElementById('calc-final-rake'),
      explanation: document.getElementById('calculation-explanation')
    };
  }

  // イベントリスナーの設定
  bindEvents() {
    // メイン画面のボタン
    document.getElementById('start-practice-btn').addEventListener('click', () => this.startPractice());
    document.getElementById('show-calculator-btn').addEventListener('click', () => this.showCalculator());
    document.getElementById('show-settings-btn').addEventListener('click', () => this.showSettings());
    document.getElementById('show-rules-btn').addEventListener('click', () => this.showRules());

    // 設定画面のボタン
    document.getElementById('save-settings-btn').addEventListener('click', () => this.saveSettings());
    document.getElementById('reset-settings-btn').addEventListener('click', () => this.resetSettings());
    document.getElementById('back-to-main-from-settings-btn').addEventListener('click', () => this.showScreen('main-screen'));

    // 設定入力フィールドのイベント
    this.settingsElements.rakeRate.addEventListener('input', () => this.updatePreview());
    this.settingsElements.maxRake.addEventListener('input', () => this.updatePreview());
    this.settingsElements.maxPot.addEventListener('input', () => this.updatePreview());
    this.settingsElements.minChip.addEventListener('input', () => this.updatePreview());
    
    // 丸め方法のラジオボタンのイベント
    this.settingsElements.roundingMode.forEach(radio => {
      radio.addEventListener('change', () => this.updatePreview());
    });

    // ルール画面のボタン
    document.getElementById('back-to-main-btn').addEventListener('click', () => this.showScreen('main-screen'));

    // レーキ計算機画面のボタン
    document.getElementById('calculate-rake-btn').addEventListener('click', () => this.calculateRakeForCalculator());
    document.getElementById('back-to-main-from-calculator-btn').addEventListener('click', () => this.showScreen('main-screen'));

    // レーキ計算機の入力フィールドイベント
    this.calculatorElements.potInput.addEventListener('input', () => this.validateCalculatorInput());
    this.calculatorElements.potInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.calculatorElements.calculateBtn.disabled) {
        this.calculateRakeForCalculator();
      }
    });

    // 練習画面のボタン
    document.getElementById('submit-btn').addEventListener('click', () => this.submitAnswer());
    document.getElementById('back-to-main-from-practice-btn').addEventListener('click', () => this.backToMain());

    // 結果画面のボタン
    document.getElementById('next-question-btn').addEventListener('click', () => this.nextQuestion());
    document.getElementById('finish-practice-btn').addEventListener('click', () => this.backToMain());

    // 最終結果画面のボタン
    document.getElementById('restart-btn').addEventListener('click', () => this.startPractice());
    document.getElementById('back-to-main-final-btn').addEventListener('click', () => this.backToMain());

    // 入力フィールドのイベント
    this.practiceElements.answerInput.addEventListener('input', () => this.validateInput());
    this.practiceElements.answerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !this.practiceElements.submitBtn.disabled) {
        this.submitAnswer();
      }
    });
  }

  // 画面切り替え
  showScreen(screenId) {
    Object.values(this.screens).forEach(screen => screen.classList.remove('active'));
    this.screens[screenId.replace('-screen', '')].classList.add('active');
    
    // タイトルの更新
    this.updateTitle(screenId);
  }

  // タイトル更新
  updateTitle(screenId) {
    const titles = {
      'main-screen': 'レーキ計算',
      'calculator-screen': 'レーキ計算機',
      'settings-screen': 'レーキ計算 - 設定',
      'rules-screen': 'レーキ計算 - ルール',
      'practice-screen': 'レーキ計算 - 練習中',
      'result-screen': 'レーキ計算 - 結果',
      'final-result-screen': 'レーキ計算 - 最終結果'
    };
    
    this.titleElement.textContent = titles[screenId] || 'レーキ計算';
  }

  // 統計の更新
  updateStats() {
    this.statsElements.totalQuestions.textContent = this.totalQuestions;
    this.statsElements.correctCount.textContent = this.correctAnswers;
    const accuracy = this.totalQuestions > 0 ? Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;
    this.statsElements.accuracy.textContent = `${accuracy}%`;
  }

  // 練習開始
  startPractice() {
    this.currentQuestion = 0;
    this.correctAnswers = 0;
    this.generateQuestions();
    this.showNextQuestion();
    this.showScreen('practice-screen');
  }

  // 問題生成
  generateQuestions() {
    this.questions = [];
    for (let i = 0; i < this.totalQuestions; i++) {
      const pot = Math.floor(Math.random() * this.settings.maxPot) + 1; // 1〜設定された最大額
      const rake = this.calculateRake(pot);
      this.questions.push({
        pot: pot,
        rake: rake
      });
    }
  }

  // レーキ計算（設定可能な値に対応）
  calculateRake(pot) {
    if (pot <= 0) return 0;
    
    // レーキ率に基づく基本計算（小数点以下を含む）
    const basicRake = (pot * this.settings.rakeRate) / 100;
    
    // 最小チップ額の単位で丸める
    let roundedRake = this.roundToMinChip(basicRake);
    
    // 最大レーキで制限
    return Math.min(roundedRake, this.settings.maxRake);
  }

  // 最小チップ額の単位で丸める
  roundToMinChip(rake) {
    const minChip = this.settings.minChip;
    
    // 最小チップ額未満の場合は最小チップ額に
    if (rake < minChip) {
      return minChip;
    }
    
    // 最小チップ額での単位に変換
    const chipUnits = rake / minChip;
    let roundedUnits;
    
    // 設定された丸め方法で処理
    switch (this.settings.roundingMode) {
      case 'ceil':
        roundedUnits = Math.ceil(chipUnits);
        break;
      case 'floor':
        roundedUnits = Math.floor(chipUnits);
        break;
      case 'round':
        roundedUnits = Math.round(chipUnits);
        break;
      default:
        roundedUnits = Math.ceil(chipUnits);
    }
    
    return roundedUnits * minChip;
  }

  // 次の問題を表示
  showNextQuestion() {
    const question = this.questions[this.currentQuestion];
    this.practiceElements.questionText.textContent = `ポット ${question.pot} 点のレーキは？`;
    this.practiceElements.answerInput.value = '';
    this.practiceElements.submitBtn.disabled = true;
    this.practiceElements.answerInput.focus();

    // 進捗バーの更新
    const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
    this.practiceElements.progressFill.style.width = `${progress}%`;
    this.practiceElements.progressText.textContent = `問題 ${this.currentQuestion + 1} / ${this.totalQuestions}`;
  }

  // 入力値の検証
  validateInput() {
    const value = parseInt(this.practiceElements.answerInput.value);
    // 最大レーキを超えても回答できるようにする（負の値のみ無効）
    this.practiceElements.submitBtn.disabled = isNaN(value) || value < 0;
  }

  // 回答送信
  submitAnswer() {
    const userAnswer = parseInt(this.practiceElements.answerInput.value);
    const question = this.questions[this.currentQuestion];
    const isCorrect = userAnswer === question.rake;

    if (isCorrect) {
      this.correctAnswers++;
    }

    this.showResult(question, userAnswer, isCorrect);
  }

  // 結果表示
  showResult(question, userAnswer, isCorrect) {
    this.resultElements.resultIcon.textContent = isCorrect ? '◯' : '×';
    this.resultElements.resultIcon.className = `result-icon ${isCorrect ? 'correct' : 'incorrect'}`;
    this.resultElements.resultTitle.textContent = isCorrect ? '正解！' : '不正解';
    this.resultElements.resultTitle.className = isCorrect ? 'correct' : 'incorrect';
    
    this.resultElements.resultMessage.textContent = isCorrect 
      ? '素晴らしいです！' 
      : '頑張りましょう！次は正解できるはずです。';

    this.resultElements.potValue.textContent = question.pot;
    this.resultElements.correctAnswer.textContent = question.rake;
    this.resultElements.userAnswer.textContent = userAnswer;

    this.showScreen('result-screen');
  }

  // 次の問題へ
  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion < this.totalQuestions) {
      this.showNextQuestion();
      this.showScreen('practice-screen');
    } else {
      this.finishPractice();
    }
  }

  // 練習終了
  finishPractice() {
    this.updateFinalResults();
    this.updateStats();
    this.showScreen('final-result-screen');
  }

  // 最終結果の更新
  updateFinalResults() {
    this.finalResultElements.finalTotal.textContent = this.totalQuestions;
    this.finalResultElements.finalCorrect.textContent = this.correctAnswers;
    const accuracy = Math.round((this.correctAnswers / this.totalQuestions) * 100);
    this.finalResultElements.finalAccuracy.textContent = `${accuracy}%`;

    // 励ましメッセージ
    let encouragement = '';
    if (accuracy === 100) {
      encouragement = '完璧です！🎉 あなたはレーキ計算のマスターです！';
    } else if (accuracy >= 90) {
      encouragement = '素晴らしい成績です！🌟 ほぼ完璧な計算力を持っています。';
    } else if (accuracy >= 80) {
      encouragement = 'とても良い成績です！👏 安定した計算力があります。';
    } else if (accuracy >= 70) {
      encouragement = '良い成績です！👍 もう少し練習すれば更に向上します。';
    } else if (accuracy >= 60) {
      encouragement = 'まずまずの成績です。💪 継続して練習しましょう。';
    } else {
      encouragement = '練習を続けることで必ず上達します！🚀 諦めずに頑張りましょう。';
    }
    this.finalResultElements.encouragement.textContent = encouragement;
  }

  // メイン画面に戻る
  backToMain() {
    this.showScreen('main-screen');
  }

  // 設定の読み込み
  loadSettings() {
    const savedSettings = localStorage.getItem('rakeCalculatorSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
    this.updateSettingsUI();
  }

  // 設定の保存
  saveSettings() {
    // 選択された丸め方法を取得
    const selectedRoundingMode = document.querySelector('input[name="rounding-mode"]:checked');
    
    this.settings = {
      rakeRate: parseFloat(this.settingsElements.rakeRate.value),
      roundingUnit: 20, // 固定値（将来の拡張用）
      roundingMode: selectedRoundingMode ? selectedRoundingMode.value : 'ceil',
      maxRake: parseInt(this.settingsElements.maxRake.value),
      maxPot: parseInt(this.settingsElements.maxPot.value),
      minChip: parseInt(this.settingsElements.minChip.value)
    };
    
    localStorage.setItem('rakeCalculatorSettings', JSON.stringify(this.settings));
    this.updateRulesUI();
    this.showScreen('main-screen');
  }

  // 設定のリセット
  resetSettings() {
    this.settings = {
      rakeRate: 10,
      roundingUnit: 20,
      roundingMode: 'ceil',
      maxRake: 50,
      maxPot: 1000,
      minChip: 1
    };
    
    this.updateSettingsUI();
    this.updatePreview();
  }

  // 設定UIの更新
  updateSettingsUI() {
    this.settingsElements.rakeRate.value = this.settings.rakeRate;
    // this.settingsElements.roundingUnit.value = this.settings.roundingUnit; // コメントアウト
    this.settingsElements.maxRake.value = this.settings.maxRake;
    this.settingsElements.maxPot.value = this.settings.maxPot;
    this.settingsElements.minChip.value = this.settings.minChip;
    
    // 丸め方法のラジオボタンを設定
    this.settingsElements.roundingMode.forEach(radio => {
      radio.checked = radio.value === this.settings.roundingMode;
    });
    
    this.updatePreview();
  }

  // プレビューの更新
  updatePreview() {
    const rake101 = this.calculateRakeWithSettings(105);
    const rake206 = this.calculateRakeWithSettings(220);
    
    this.settingsElements.preview101.textContent = rake101;
    this.settingsElements.preview206.textContent = rake206;
  }

  // 設定値でのレーキ計算（プレビュー用）
  calculateRakeWithSettings(pot) {
    if (pot <= 0) return 0;
    
    const rakeRate = parseFloat(this.settingsElements.rakeRate.value) || 5;
    const maxRake = parseInt(this.settingsElements.maxRake.value) || 25;
    const maxPot = parseInt(this.settingsElements.maxPot.value) || 520;
    const minChip = parseInt(this.settingsElements.minChip.value) || 1;
    const selectedRoundingMode = document.querySelector('input[name="rounding-mode"]:checked');
    const roundingMode = selectedRoundingMode ? selectedRoundingMode.value : 'ceil';
    
    const basicRake = (pot * rakeRate) / 100;
    
    // 最小チップ額の単位で丸める
    let roundedRake = this.roundToMinChipWithSettings(basicRake, minChip, roundingMode);
    
    return Math.min(roundedRake, maxRake);
  }

  // 最小チップ額の単位で丸める（プレビュー用）
  roundToMinChipWithSettings(rake, minChip, roundingMode) {
    // 最小チップ額未満の場合は最小チップ額に
    if (rake < minChip) {
      return minChip;
    }
    
    // 最小チップ額での単位に変換
    const chipUnits = rake / minChip;
    let roundedUnits;
    
    // 設定された丸め方法で処理
    switch (roundingMode) {
      case 'ceil':
        roundedUnits = Math.ceil(chipUnits);
        break;
      case 'floor':
        roundedUnits = Math.floor(chipUnits);
        break;
      case 'round':
        roundedUnits = Math.round(chipUnits);
        break;
      default:
        roundedUnits = Math.ceil(chipUnits);
    }
    
    return roundedUnits * minChip;
  }

  // 設定画面の表示
  showSettings() {
    this.updateSettingsUI();
    this.showScreen('settings-screen');
  }

  // ルール画面の表示
  showRules() {
    this.updateRulesUI();
    this.showScreen('rules-screen');
  }

  // ルールUIの更新
  updateRulesUI() {
    // 丸め方法の日本語表記を取得
    const roundingModeText = this.getRoundingModeText(this.settings.roundingMode);
    
    // 基本ルールテキストの更新
    this.rulesElements.basicRuleText.textContent = 
      `ポットの${this.settings.rakeRate}%がレーキとして徴収されます（小数点以下は${roundingModeText}）`;
    
    // 計算式の更新
    const rate = this.settings.rakeRate;
    const roundingFunction = this.getRoundingFunction(this.settings.roundingMode);
    this.rulesElements.calculationFormula.textContent = 
      `レーキ = Math.${roundingFunction}(ポット × ${rate}%)`;
    
    // 最大レーキの注意書きの更新
    this.rulesElements.maxRakeNote.textContent = 
      `ただし、${this.settings.maxRake}点が上限`;
    
    // 計算例の更新
    this.updateCalculationExamples();
  }

  // 丸め方法の日本語表記を取得
  getRoundingModeText(mode) {
    switch (mode) {
      case 'ceil': return '切り上げ';
      case 'floor': return '切り捨て';
      case 'round': return '四捨五入';
      default: return '切り上げ';
    }
  }

  // 丸め方法の関数名を取得
  getRoundingFunction(mode) {
    switch (mode) {
      case 'ceil': return 'ceil';
      case 'floor': return 'floor';
      case 'round': return 'round';
      default: return 'ceil';
    }
  }

  // 計算例の更新
  updateCalculationExamples() {
    const examples = [];
    const rate = this.settings.rakeRate;
    const roundingMode = this.settings.roundingMode;
    
    // 具体的な計算例を表示（小数点以下で違いが出る例を選ぶ）
    const testPots = [99, 100, 101, 149, 150, 151, 152];
    testPots.forEach(pot => {
      const rake = this.calculateRake(pot);
      const basicRake = (pot * rate) / 100;
      
      // 計算過程を説明
      let processText = '';
      switch (roundingMode) {
        case 'ceil':
          processText = `（${pot} × ${rate}% = ${basicRake}点 → 切り上げで${Math.ceil(basicRake)}点）`;
          break;
        case 'floor':
          processText = `（${pot} × ${rate}% = ${basicRake}点 → 切り捨てで${Math.floor(basicRake)}点）`;
          break;
        case 'round':
          processText = `（${pot} × ${rate}% = ${basicRake}点 → 四捨五入で${Math.round(basicRake)}点）`;
          break;
      }
      
      examples.push(`<li>ポット${pot}点 → レーキ${rake}点${processText}</li>`);
    });
    
    examples.push('<li>...このパターンが続きます</li>');
    
    // 上限に達するポットサイズを計算
    const maxPot = Math.ceil((this.settings.maxRake * 100) / this.settings.rakeRate);
    examples.push(`<li>ポットが${maxPot}点以上 → レーキ${this.settings.maxRake}点（上限）</li>`);
    
    this.rulesElements.calculationExamples.innerHTML = examples.join('');
  }

  // レーキ計算機画面の表示
  showCalculator() {
    this.calculatorElements.potInput.value = '';
    this.calculatorElements.resultSection.style.display = 'none';
    this.calculatorElements.calculateBtn.disabled = true;
    this.showScreen('calculator-screen');
    this.calculatorElements.potInput.focus();
  }

  // レーキ計算機の入力値検証
  validateCalculatorInput() {
    const value = parseInt(this.calculatorElements.potInput.value);
    this.calculatorElements.calculateBtn.disabled = isNaN(value) || value <= 0;
  }

  // レーキ計算機でのレーキ計算
  calculateRakeForCalculator() {
    const pot = parseInt(this.calculatorElements.potInput.value);
    if (isNaN(pot) || pot <= 0) return;

    // 設定された値でレーキを計算
    const basicRake = (pot * this.settings.rakeRate) / 100;
    const finalRake = this.calculateRake(pot);

    // 結果表示の更新
    this.calculatorElements.potDisplay.textContent = pot;
    this.calculatorElements.rateDisplay.textContent = this.settings.rakeRate;
    this.calculatorElements.finalRakeDisplay.textContent = finalRake;

    // 計算過程の説明を生成
    this.generateCalculationExplanation(pot, basicRake, finalRake);

    // 結果セクションを表示
    this.calculatorElements.resultSection.style.display = 'block';
  }

  // 計算過程の説明を生成
  generateCalculationExplanation(pot, basicRake, finalRake) {
    const roundingModeText = this.getRoundingModeText(this.settings.roundingMode);
    
    let explanation = `<div class="explanation-step">
      <strong>ステップ1:</strong> 基本レーキの計算<br>
      ${pot}点 × ${this.settings.rakeRate}% = ${basicRake.toFixed(2)}点
    </div>`;

    if (basicRake !== finalRake) {
      explanation += `<div class="explanation-step">
        <strong>ステップ2:</strong> 小数点以下の${roundingModeText}<br>
        ${basicRake.toFixed(2)}点 → ${roundingModeText}で ${finalRake}点
      </div>`;
    }

    if (finalRake === this.settings.maxRake && basicRake > this.settings.maxRake) {
      explanation += `<div class="explanation-step">
        <strong>ステップ3:</strong> 最大レーキの適用<br>
        計算結果が上限値${this.settings.maxRake}点を超えるため、${this.settings.maxRake}点に制限
      </div>`;
    }

    explanation += `<div class="explanation-result">
      <strong>結果:</strong> ポット${pot}点に対するレーキは <span class="highlight-result">${finalRake}点</span> です。
    </div>`;

    this.calculatorElements.explanation.innerHTML = explanation;
  }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
  new RakeCalculatorApp();
});

// サービスワーカー登録（PWA対応）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully');
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

