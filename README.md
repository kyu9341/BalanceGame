# BalanceGame
- 컴퓨터 통신 실습 프로젝트 
- 밸런스 게임 기반 웹 커뮤니티 사이트 제작 (닥전닥후)

## 팀 구성
- 팀장 : 권영언
- 팀원 : 김민기, 권영인, 손현빈

## 개발 환경 및 기술스택
- VScode, WebStorm
- node.js (express), ORM : sequelize
- mariaDB
- AWS(호스팅 예정)

### 설계 목표
- 최근에 유행하는 밸런스 게임을 기반으로 한 유저 커뮤니티 개설
- 다양한 주제로 유저들이 자유롭게 컨텐츠를 작성
- 하나의 주제에 대하여 투표 및 토론 가능
- 회원가입 및 로그인을 통해 자신의 활동 내역을 볼 수 있음
- 비회원으로도 로그인 없이 편리하게 사이트 이용 가능
- 추천 수에 따른 인기 게시글 선정을 통한 활동 장려
    - 게시글 및 댓글 작성, 좋아요 받은 수에 따른 경험치 획득으로 레벨업 가능


## 기능 블록도

![balancegame](https://github.com/kyu9341/BalanceGame/blob/master/images/balancegame.png)

# UI 및 동작

## 메인 화면
![main](https://github.com/kyu9341/BalanceGame/blob/master/images/main.png)

## 회원가입, 로그인
<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/signup.png" alt="vs_write" width="500px" height="600px"/>

<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/login.png" alt="vs_write" width="500px" height="400px"/>



## 게시글 작성
<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/write.png" alt="write" width="700px" height="600px"/>

## vs 게시글 작성
<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/vs_write.png" alt="vs_write" width="700px" height="700px"/>

## 게시글 확인
<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/free_detail.png" alt="free_detail" width="800px" height="700px"/>

- 일반 게시판 게시글 확인
<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/vs_detail.png" alt="vs_detail" width="800px" height="700px"/>


- vs 게시판 게시글 (투표 후)

<img src="https://github.com/kyu9341/BalanceGame/blob/master/images/vs_detail_comment.png" alt="vs_detail_comment" width="800px" height="550px"/>


- vs 게시판 댓글

## 게시판 

<div style="width: 800px; height: 600px;">
    <img src="https://github.com/kyu9341/BalanceGame/blob/master/images/free_board.png" style="width: 800px
    ; height: 600px;">
</div>

<div style="width: 800px; height: 600px;">
    <img src="https://github.com/kyu9341/BalanceGame/blob/master/images/best_vs_board.png" style="width: 800px
    ; height: 600px;">
</div>


## 마이페이지 

<div style="width: 800px; height: 600px;">
    <img src="https://github.com/kyu9341/BalanceGame/blob/master/images/mypage.png" style="width: 800px
    ; height: 600px;">
</div>

- 레벨 기능을 통해 활동 장려

## 내가 쓴 글 

<div style="width: 800px; height: 600px;">
    <img src="https://github.com/kyu9341/BalanceGame/blob/master/images/my_posts.png" style="width: 800px
    ; height: 600px;">
</div>











