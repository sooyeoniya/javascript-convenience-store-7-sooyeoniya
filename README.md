# javascript-convenience-store-precourse

**프리코스 최종 코딩 테스트 연습을 위한 브랜치입니다.**

**구현 기간:** `24.11.18` ~ `24.11.25`

## ✅ 기능 목록

### 입력

  - [x] 구매할 상품과 수량 입력
  - [x] 프로모션 적용 가능 상품에 대한 수량 추가 여부 입력
  - [x] 프로모션 재고 부족에 대한 일부 수량 정가 결제 여부 입력
  - [x] 멤버십 할인 적용 여부 입력
  - [x] 추가 구매 여부 입력

### 기능

  **파일 입출력**
  - [x] `public/products.md`을 통해 상품 목록 저장
  - [x] `public/promotions.md`을 통해 행사 목록 저장
    - [x] 현재 날짜와 비교하여 프로모션 기간인 경우에만 저장

  **재고 관리**
  - [x] 사용자가 상품 구매 시 결제된 수량 만큼 해당 상품 재고 차감을 통해 최신 재고 상태 유지
  - [x] 각 상품 재고 수량을 고려해 결제 가능 여부 확인

  **프로모션 할인**
  - [x] 오늘 날짜 확인하여 프로모션 기간 내 포함된 경우에만 할인 적용
  - [x] 프로모션 혜택 상품은 프로모션 재고를 우선 차감, 프로모션 재고 부족한 경우 일반 재고 차감
  - [x] 프로모션 적용 가능 상품에 대한 수량 추가 여부에 따른 분기 처리
    - Y: 프로모션 혜택 증정 수량 추가 / N: 해당 수량에 대해 프로모션 혜택 적용 안함
  - [x] 프로모션 재고 부족한 경우에 대한 일부 수량 정가 결제 여부에 따른 분기 처리
    - Y: 일부 수량 정가 결제 / N: 일부 수량 결제 취소

  **멤버십 할인**
  - [x] 멤버십 할인 여부에 따라 멤버십 할인 적용
    - Y: 프로모션 미적용 금액에 대한 `30%` 할인 / N: 멤버십 할인 적용 X
  - [x] 멤버십 할인 최대 한도 `8,000`원

  **추가 구매**
  - [x] 영수증 출력 후 추가 구매할지 사용자 입력 받아 결정
    - Y: 결제 시스템 다시 반복 / N: 결제 시스템 종료

### 출력

  - [x] 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고 안내 출력
    - [x] 만약 재고가 `0`개일 경우 `재고 없음` 출력
    - [x] `public/products.md`에서 각 상품 중 프로모션 재고만 나와 있는 경우, `재고 없음`으로 일반 재고 출력
  - [x] 구매 상품 내역, 증정 상품 내역, 금액 정보 출력
    - 구매 상품 내역: 구매한 상품명, 수량, 가격
    - 증정 상품 내역: 프로모션에 따라 무료로 제공된 증정 상품 이름 및 수량
    - 금액 정보
      - 총구매액: 구매한 상품의 총 수량과 총 금액
      - 행사할인: 프로모션에 의해 할인된 금액
      - 멤버십할인: 멤버십에 의해 추가로 할인된 금액
      - 내실돈: 최종 결제 금액

### 예외 처리

  - [x] 사용자가 잘못된 값을 입력할 경우 `Error` 발생 후 해당 에러 메시지를 출력한 다음 해당 지점부터 다시 입력

  **구매할 상품과 수량 입력**
  - [x] `[콜라-10],[사이다-3]` 압력 형식 올바른지 확인
    - `[콜라-10],[사이다-3]` 입력 값 파싱
    - 입력 값에 대해 `,`로 분리 후 정규 표현식을 통해 검사
    - 수량이 정수인지 포함
  - [x] 존재하는 상품명인지
  - [x] 해당 상품에 대한 재고 수량을 초과하는지
    - 프로모션 혜택 적용 상품: 프로모션 재고 + 일반 재고
    - 프로모션 혜택 미적용 상품: 일반 재고

  **안내 메시지 입력**
  - [x] `Y`, `N`, `y`, `n` 중 하나인지 확인

### 테스트 코드

  - [x] 통합 테스트
    - 기능 및 예외 테스트

  - [ ] 단위 테스트
    - [x] `Stock` 클래스 테스트
    - [x] `Promotion` 클래스 테스트
    - [ ] `ProductsManagementService` 클래스 테스트
    - [x] `ReceiptService` 클래스 테스트
    - [ ] `Controller` 클래스 테스트

### 기타

  - [x] JSDoc 주석 처리
  - [x] 상수화
  - [x] 리팩토링
    - 함수 길이 `10` 제한
    - indent depth `2` 제한
    - 공통 로직 분리

## 🏛️ 프로젝트 구조
```
__tests__
├── ApplicationTest.js
├── ProductsManagementServiceTest.js
├── ReceiptServiceTest.js
├── PromotionTest.js
└── StockTest.js

public
├── products.md
└── promotions.md

src
├── App.js
├── index.js
├── constants
│   └── constants.js
├── controller
│   └── Controller.js
├── domain
│   ├── Promotion.js
│   └── Stock.js
├── service
│   ├── ProductsManagementService.js
│   └── ReceiptService.js
├── utils
│   ├── getFileData.js
│   ├── getUserConfirm.js
│   ├── mockNowDate.js
│   └── parser.js
├── validations
│   ├── validateProductsDetails.js
│   └── validateUserConfirm.js
└── view
    ├── InputView.js
    └── OutputView.js
```
