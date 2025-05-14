# 포켓 트립 (Pocket Trip)
**포켓 트립** 은 공동으로 경비를 관리하는 여행 비용 관리 웹 어플리케이션 입니다. 

<img width="1901" alt="스크린샷 2025-02-24 오후 3 50 50" src="https://github.com/user-attachments/assets/18cc1efe-b846-456c-b5e9-f951e62dd468" />



## 🛠️ 사용한 기술 스택

### 프론트엔드
<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> 
### 백엔드
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> 
### 배포
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"> <img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white"> <img src="https://img.shields.io/badge/filezilla-BF0000?style=for-the-badge&logo=filezilla&logoColor=white">

### 디자인
<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

---

## 📅 프로젝트 개요
- **기간**: 2025년 01월 16일 ~ 2025년 02월 20일
- **팀 프로젝트** (프론트엔드 2명 + 백엔드 2명)
- **개인 기여도**: **소켓 서버와 백엔드 서버 간 연결**, **프론트엔드와 백엔드 서버의 소켓 cols 문제 해결**, **JWT 백엔드 인증**, **소켓 연결 시 인증 문제 해결**, **AWS S3 스프링부트 연결**, **환율은행 API, Spring boot 스케줄러를 활용한 하루에 한번 5시마다 정보 가져오는 로직 개발**, **MongoDB를 이용한 데이터베이스 설계**

---

## 🔍 프로젝트를 시작하게 된 계기
프로젝트를 시작할 당시 가계부를 활용한 **비용 관리**에 대해 고민했습니다.<br/>
그러나 기존 앱들과 비교 분석한 결과, **은행과의 연동성** 측면에서 경쟁력이 다소 부족하다는 **한계**를 발견했습니다.<br/>
이에 대한 해결책으로, **여행과 결합**한 새로운 접근 방식을 시도했습니다.<br/>
그 결과, 여러 사용자가 **소켓을 통해 실시간으로 공유**할 수 있는 **외화 가계부 애플리케이션**을 제작하게 되었습니다.

---

## 🎯 주요 타겟층 및 기대효과
### 타겟층
**여럿이 함께 해외여행을 떠나는 여행객**<br/>
→ 공동 경비를 효율적으로 관리하고 싶은 사용자<br/>

**외화를 고려하여 체계적인 가계부 작성이 필요한 사람**<br/>
→ 환율을 반영한 지출 관리가 필요한 사용자

### 기대효과
**공동 경비를 투명하고 원활하게 관리**<br/>
→ 실시간으로 정산 및 분배가 가능<br/>

**여행 중 소비 내역을 한눈에 파악 가능**<br/>
→ 개별 및 전체 지출을 직관적으로 확인

---

## 📋 주요 기능
### 1. 여행 기간별 소비금액 관리(개인 담당)
- 초대 코드 발급을 통한 유저 초대 기능
- 소켓을 통한 실시간 소비내역 공유

### 2. 다음 여행까지 남은 기간 확인(개인 담당)
- D-day 로직 구현을 통한 현재 여행 기준 다음 여행기간을 추적

### 3. 환율을 고려한 계산기 기능
- 금융 Open API데이터를 기반으로한 환율정보 기반 계산기
  
### 4. 유저 데이터 기반 인기 여행지 그래프(개인 담당)
- Cart.js를 활용한 1위부터 3위까지의 인기 여행지
---

## 🙋 개인 기여도
### 🎨 프론트엔드 개발 및 UI/UX 설계
- **백엔드 서버 개발**
- **Springboot security를 활용한 JWT를 통한 유저 인증 관리**
- **프론트엔드와 백엔드 서버 내 소켯 컨트롤러 간 소켓 연결 구현**
- **백엔드 서버에서 Database 간 정보 저장 시 암호화 구현**
- **백엔드 서버 내 AES를 통한 대칭키 암호화 코드 관리**
- **백엔드 서버에서 여행 정보 관리 시 여행 코드 대소문자, 특수문자, 숫자 조합의 10자리 코드 생성**
- **금융 Open API 데이터를  spring boot scheduler를 활용하여, 시스템 시작 시와 오후 6시가 넘었을 때 프론트엔드에서 출력하기 쉽도록 가공해 Open api 데이터가 담긴 hashmap을 갱신하는 함수 개발**\\\\

  
---

## 💻 구체적인 구현 기능
### 1. Springboot security를 활용한 JWT를 통한 유저 인증 관리
- **로그인이 필요한 컨트롤러**만 JWT 인증을 받도록 설계
- **소켓 인증** 시 이미 로컬 인증이 완료된 Springboot security를 추가적으로 타지 않도록 하여, 중복 검사 방지
### 2. 프론트엔드와 백엔드 서버 내 소켯 컨트롤러 간 소켓 연결 구현
- **소켓 인증**을 받은 후 RestTemplate을 이용하여 백엔드 서버에 관련 정보를 가져와 프론트엔드로 발송하는 형태
- 


### 3. AES 암호화를 통한 초대코드 관리
- 유저 초대를 위한 **초대 코드**를 **AES 암호화**를 통해 활용
- URL에 담아 안전하게 데이터 식별
- 복호화를 통해 본래 기능인 초대 코드 기능 유지
### 4. 싱글톤 패턴을 활용한 소켓
- 한번만 작성하여 모든 컴포넌트에서 소켓을 활용
- 모든 소켓 관련 함수 클래스 함수로 한번에 관리
- 생명 주기 함수를 통해 원하는 시점에 구독 함수 실행
---

## 🧩 해결 과제
### 1. 개발 방법론 변경
- **문제**: 새로운 팀원이 기존 **아토믹 디자인 방법론**을 이해하는 데 추가적인 학습 비용이 발생
- **해결**: 페이지 기반 분류(Page-Based Structure) 선정
- **성과**: 빠른 시간내에 이해 및 적용을 통한 원활한 소통 증진

### 2. 소켓 연결간 CORS 문제 발생
- **문제**: 프론트엔드의 소켓 요청이 403에러로 인해 거부당하는 문제
- **해결**: 백엔드 팀원과의 코드 리뷰 진행을 통해 **JWT 인증 문제**를 확인
- **성과**: JWT 사용법 숙달 및 소켓 코드 정상 작동 확인
- 
---

## 💭 작업 후기 및 피드백
스프링과 리액트의 연동을 통해서 백엔드와 프론트엔드간의 여러 시행착오들(cors문제, 데이터 불일치 문제 등)을 많이 겪을 수 있는 작업이었다. 
SockJS를 통한 소켓 연결 작업을 통해서 소켓 연결 방법을 배우고 숙달할 수 있은 좋은 기회가 되었다. 

### 아쉬운 점
- **컨텐츠의 추가 필요**: 가계부를 제외한 여행관련 컨텐츠를 더욱 추가하지 못한것이 아쉽다. 
- **PWA 기능의 추가**: 해외에서의 사용을 고려해 PWA 기능을 추가적으로 구현하지 못한것이 아쉽다. 

### 앞으로의 계획
백엔드 팀원과의 주기적인 소통을 통해서 PWA 기능 구현 및 최적화를 수행을 진행하고 있습니다. 

---

## 📬 문의
- **개발자:** [황종현](https://github.com/HyunWeb)
- **이메일:** jonghyun1803@naver.com
