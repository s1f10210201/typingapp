const RANDOM_SENTENCE_URL_API = "https://api.quotable.io/random";
const typeDisplayElement = document.getElementById("typeDisplay");
const typeInputElement = document.getElementById("typeInput");
const timer = document.getElementById("timer");
const point = document.getElementById("points");
const mistake = document.getElementById("mistakeCount");

const typeSound = new Audio("./audio/audio_typing-sound.mp3");
const wrongSound = new Audio("./audio/audio_wrong.mp3");
const correctSound = new Audio("./audio/audio_correct.mp3");

let mistakeCount = 0;
const maxMistakeCount = 10; // ミス回数の上限
let sentenceCount = 0;
const maxSentenceCount = 5; // 終了条件：5回で終了

let totalMistakeCount = 0; // 合計ミス回数


/* inputテキスト入力。合っているかどうかの判定 */
typeInputElement.addEventListener("input", () => {
  /* タイプ音をつける */
  typeSound.volume = 0.5;
  typeSound.play();
  typeSound.currentTime = 0;

  /* 文字と文字を比較する */
  /* ディスプレイに表示されてるSpanタグを取得 */
  const sentence = typeDisplayElement.querySelectorAll("span");
  /* 自分で打ち込んだテキストを取得 */
  const arrayValue = typeInputElement.value.split("");
  let correct = true;
  sentence.forEach((characterSpan, index) => {
    if (arrayValue[index] == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (characterSpan.innerText == arrayValue[index]) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
    } else {
      characterSpan.classList.add("incorrect");
      characterSpan.classList.remove("correct");
      correct = false;
      wrongSound.volume = 0.1;
      wrongSound.play();
      wrongSound.currentTime = 0;
      typeInputElement.value = arrayValue.slice(0, index).join('');
      mistakeCount++;
      document.getElementById("mistakeCountValue").textContent = mistakeCount;
      
      if (mistakeCount >= maxMistakeCount) {
        points = 0;
        document.getElementById("pointsValue").itextContent = points;
        // 次の問題に進む
        RenderNextSentence();
      }

    }
    
  });

  /* 次の文章へ */
  if (correct) {
    correctSound.volume = 0.5;
    correctSound.play();
    correctSound.currentTime = 0;
    UpdatePoints();
    RenderNextSentence();
    totalMistakeCount += mistakeCount;
    sessionStorage.setItem("totalMistakes", totalMistakeCount);
    
  }
});

/* ちゃんとthenかawaitで待たないと欲しいデータが入らない。 */
/* 非同期でランダムな文章を取得する */
function GetRandomSentence() {
  return fetch(RANDOM_SENTENCE_URL_API)
    .then((response) => response.json())
    .then(
      (data) =>
        /* ここでならちゃんと文章情報を取り扱うことができる。 */
        //console.log(data.content);
        data.content
    );
}

/* 次のランダムな文章を取得する */
async function RenderNextSentence() {
  sessionStorage.setItem("totalMistakes", mistakeCount);// セッションストレージに間違えた数を保存
  if (sentenceCount >= maxSentenceCount) {
    // ゲームを終了し、終了画面にリダイレクト
    window.location.href = "end.html";
    return;
  }

  const sentence = await GetRandomSentence();
  console.log(sentence);

  /* ディスプレイに表示 */
  typeDisplayElement.innerText = ""; //最初はsentenceが入ってた。
  /* 文章を1文字ずつ分解して、spanタグを生成する(クラス付与のため) */
  sentence.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    // characterSpan.classList.add("correct");
    characterSpan.innerText = character;
    typeDisplayElement.appendChild(characterSpan);
    /* 確認 */
    console.log(characterSpan);
  });
  /* テキストボックスの中身を消す。 */
  typeInputElement.value = null;

  /* タイマーのリセット */
  StartTimer();

  mistakeCount = 0; // 新しい文章の間違いのカウントをリセット
  document.getElementById("mistakeCountValue").textContent = mistakeCount; // 表示もリセット

  sentenceCount++;
}

let startTime;
let originTime = 50;
/* カウントアップを開始する。 */
function StartTimer() {
  timer.innerText = originTime;
  startTime = new Date(); /* 現在の時刻を表示 */
  console.log(startTime);
  setInterval(() => {
    timer.innerText = originTime - getTimerTime(); /* １秒ずれて呼び出される */
    if (timer.innerText <= 0) TimeUp();
  }, 1000);
  mistakeCount = 0; // タイマーがリセットされたらミス回数もリセット
  document.getElementById("mistakeCountValue").textContent = mistakeCount;
  
}

function getTimerTime() {
  return Math.floor(
    (new Date() - startTime) / 1000
  ); /* 現在の時刻 - １秒前の時刻 = 1s*/
}

function TimeUp() {
  console.log("next sentence");
  totalMistakeCount += mistakeCount; // 合計の間違えた回数に加算
  sessionStorage.setItem("totalMistakes", totalMistakeCount); // 合計の間違えた回数を保存
  RenderNextSentence();
}
let points = 0;

function UpdatePoints() {
    points++;
    document.getElementById("pointsValue").textContent = points;

    // セッションストレージにポイントを保存
    sessionStorage.setItem("points", points);
    sessionStorage.setItem("totalMistakes", totalMistakeCount);

  }


RenderNextSentence();