# javascript-convenience-store-precourse

**우아한테크코스 프리코스 4주차 과제입니다.**

**구매자의 할인 혜택과 재고 상황을 고려하여, 최종 결제 금액을 계산하고 안내하는 편의점 결제 시스템입니다.**

## 📖 4주차 학습 내용 정리

[@sooyeoniya - 4주차 학습 내용 정리](about:blank)

## ✅ 기능 목록

### ✔️ 입력

  **구매 상품 및 수량 입력**
  - [x] `[상품명-수량]` 형식으로 입력 받아 `상품명`, `수량` 추출
    - 상품이 여러 개인 경우 `콤마(,)`를 기준으로 분리
    - 입력 값에 대한 공백 제거

  **안내 메시지 입력(Y/N)**
  - [x] 소문자 `y` 또는 `n`인 경우도 허용
  - [x] 프로모션 적용 상품 혜택에 대한 수량 추가 여부 입력 (Y/N)
  - [x] 프로모션 재고 부족으로 일부 수량에 대한 정가 결제 여부 입력 (Y/N)
  - [x] 멤버십 할인 적용 여부 입력 (Y/N)
  - [x] 추가 구매 여부 입력 (Y/N)

### ✔️ 기능

  **상품 및 프로모션 정보 불러오기**
  - [x] `public/products.md` 파일 불러오기
    - `name`,`price`,`quantity`,`promotion`에 따라 파싱하여 저장
  - [x] `public/promotions.md` 파일 불러오기
    - `name`,`buy`,`get`,`start_date`,`end_date`에 따라 파싱하여 저장

  **재고 관리**
  - [x] 상품 구매 시 결제된 수량만큼 상품 재고에서 차감
    - 프로모션 기간인 경우 프로모션 재고 우선 차감

  **프로모션 할인**
  - [x] 오늘 날짜에 대하여 프로모션 적용 가능 상품인지 확인
  - [x] 프로모션 적용 가능 상품에 대해 고객이 해당 수량보다 적게 가져왔는지 확인
  - [x] 프로모션 재고가 부족한지 확인
  - [x] 각 상품에 대한 프로모션 증정 개수 카운트하여 저장

  **멤버십 할인**
  - [x] 프로모션으로 결제한 상품을 제외한 나머지 금액에서 30% 할인
  - [x] 멤버십 할인 최대 한도 8,000원 적용

  **결제 금액 계산**
  - [x] 총구매액: 구매한 상품의 총 수량과 총 금액
  - [x] 행사할인: 프로모션에 의해 할인된 금액
  - [x] 멤버십할인: 멤버십에 의해 추가로 할인된 금액
  - [x] 내실돈: 최종 결제 금액

### ✔️ 출력

  **환영 인사 및 재고 안내**
  - [x] 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고 안내 출력
    - 재고가 0개인 경우, `재고 없음` 출력

  **안내 메시지 출력(Y/N)**
  - [x] 프로모션 적용 상품 혜택에 대한 수량 추가 여부 안내 메시지 출력
  - [x] 프로모션 재고 부족으로 일부 수량에 대한 정가 결제 여부 안내 메시지 출력
  - [x] 멤버십 할인 적용 여부 안내 메시지 출력
  - [x] 영수증 출력 후 추가 구매 여부 안내 메시지 출력

  **영수증 출력**
  - [x] 구매 상품 내역, 증정 상품 내역, 금액 정보 출력
    - 구매 상품 내역: 구매한 상품명, 수량, 가격
    - 증정 상품 내역: 프로모션에 따라 무료로 제공된 증정 상품의 목록 및 수량
    - 금액 정보: 총구매액, 행사할인, 멤버십할인, 내실돈

### ✔️ 예외 처리

  **공통 처리**
  - [x] 잘못된 값 입력할 경우, `Error` 발생 및 `[ERROR]`를 포함한 에러 메시지 출력 후 해당 지점부터 재입력

  **입력 오류**
  - [x] 입력 형식이 `[상품명-수량]`이 아닌 경우 (정규 표현식 활용)
    - 앞뒤로 `[` 또는 `]` 가 존재하지 않거나, 대괄호 내부에 `-`이 존재하지 않는 경우
    - 입력 받은 `{수량}`이 숫자로 변환 불가능한 경우 (숫자가 아닌 경우)
    - 입력 받은 `{상품명}` 또는 `{수량}`이 빈 값인 경우 (예: `[-],[-]`)
    - 입력 받은 `{수량}`이 0 이하의 값이거나, 0으로 파싱되는 경우
  - [x] 입력 받은 `{상품명}`들 중 중복되는 상품명이 존재하는 경우
  - [x] 입력 받은 `{상품명}`이 재고에 존재하지 않는 상품인 경우
  - [x] 입력 받은 `{수량}`이 해당 상품에 대한 재고 수량을 초과한 경우
    - 오늘 날짜 기준으로 프로모션 적용 상품인지 아닌지 고려하여 재고 수량 검증
  - [x] 안내 메시지에 대한 `Y/N` 입력 시, 문자 `Y`, `y`, `N`, `n` 중 하나가 아닌 경우

### ✔️ 테스트 코드

  - [x] 통합 테스트
      - 기능 및 예외 테스트

  - [x] 단위 테스트

      - [x] **Stock 클래스 테스트**
        - getStockInfo()
        - getProductPrice()
        - getPromotionStockQuantity()
        - getPromotionName()
        - checkProductExistence()
        - updatePromotionStockInfo()
        - updateGeneralStockInfo()
      
      - [x] **Promotion 클래스 테스트**
        - getPromotionInfo()
        - getPromotionBuyValue()
        - getPromotionGetValue()
        - getPromotionBuyPlusGetValue()
      
      - [x] **ProductManagementService 클래스 테스트**
        - initProductsInfo()
        - getProductsInfo()
        - hasSufficientStock()
        - processProducts()

      - [x] **ReceiptService 클래스 테스트**
        - processReceipt()

## 🏛️ 프로젝트 구조
```
__tests__
├── ApplicationTest.js
├── ProductManagementServiceTest.js
├── PromotionTest.js
├── ReceiptServiceTest.js
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
│   └── ConvenienceStoreController.js
├── domain
│   ├── Promotion.js
│   └── Stock.js
├── service
│   ├── ProductManagementService.js
│   └── ReceiptService.js
├── utils
│   ├── extractProductsToPurchase.js
│   ├── getUserConfirmation.js
│   ├── parserUtils.js
│   └── readFileData.js
├── validations
│   ├── validateConfirmationResponse.js
│   └── validateProductsToPurchase.js
└── view
    ├── InputView.js
    └── OutputView.js
```
