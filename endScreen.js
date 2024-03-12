


document.addEventListener("DOMContentLoaded", function () {
    // ゲーム終了時にポイントと間違えた数を表示
    const finalPointsElement = document.getElementById("finalPoints");
    const totalMistakesElement = document.getElementById("totalMistakes");
  
    // セッションストレージからポイントと間違えた数を取得
    const points = sessionStorage.getItem("points");
    const totalMistakes = sessionStorage.getItem("totalMistakes");
  
    if (points !== null) {
      finalPointsElement.textContent = points;
    } else {
      finalPointsElement.textContent = "エラー"; // ポイントが取得できない場合の処理
    }
  
    if (totalMistakes !== null) {
      totalMistakesElement.textContent = totalMistakes;
    } else {
      totalMistakesElement.textContent = "エラー"; // 間違えた数が取得できない場合の処理
    }
  });
   