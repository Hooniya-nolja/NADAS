import React, { useState } from "react";
import styled from "styled-components";
import KeywordAnalyze from "./KeywordAnalyze";
import AutoBid from "./AutoBid";

function Tab() {
  const [currentTab, clickTab] = useState(0);

  const menuArr = [
    { name: '키워드 분석', content: <KeywordAnalyze /> },
    { name: '자동 입찰', content: <AutoBid /> },
    { name: '데이터 분석 (개발 중)', content: <Desc><p>개발 예정</p></Desc> },
  ];

  const selectMenuHandler = (index) => {
    // parameter로 현재 선택한 인덱스 값을 전달해야 하며, 이벤트 객체(event)는 쓰지 않는다
    // 해당 함수가 실행되면 현재 선택된 Tab Menu 가 갱신.
    clickTab(index);
  };

  return (
    <>
      <div>
        <TabMenu>
          {/* // 아래 하드코딩된 내용 대신에, map을 이용한 반복으로 코드를 수정
         // li 엘리먼트의 class명의 경우 선택된 tab 은 'submenu focused', 나머지 2개의 tab은 'submenu'  */}
          {/* <li className="submenu">{menuArr[0].name}</li>
          <li className="submenu">{menuArr[1].name}</li>
          <li className="submenu">{menuArr[2].name}</li> */}
          {menuArr.map((el,index) => (
              <li className={index === currentTab ? "submenu focused" : "submenu" }
              onClick={() => selectMenuHandler(index)}>{el.name}</li>
            ))}
        </TabMenu>
        {menuArr[currentTab].content}
      </div>
    </>
  )
}

const TabMenu = styled.ul`
  background-color: rgb(255,255,255);
  color: rgb(232, 234, 237);
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  list-style: none;
  margin-bottom: 7rem;
  margin-top: 10px;
  padding-left: 0px;

  .submenu {
  // 기본 Tabmenu 에 대한 CSS를 구현
    display: flex;
    /* justify-content: space-between;
    width: 380px;
    heigth: 30px; */
    width: calc(100% /3);
    padding: 10px;
    font-size: 15px;
    transition: 0.5s;
    border-radius: 10px 10px 0px 0px;
    background-color: #dcdcdc;
    border: 2px solid;
  }

  .focused {
   //선택된 Tabmenu 에만 적용되는 CSS를 구현
    background-color: rgb(255,255,255);
    color: rgb(21,20,20);
  }

  & div.desc {
    text-align: center;
  }
`;

const Desc = styled.div`
  text-align: center;
`;

export default Tab;
