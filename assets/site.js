// 모든 페이지 공통 스크립트
(function () {
  'use strict';

  // 푸터 저작권 연도 자동 갱신
  var year = String(new Date().getFullYear());
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = year;
  });
})();
