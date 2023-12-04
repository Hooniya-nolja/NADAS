import React, { useState } from "react";
import axios from 'axios';
import styled from "styled-components";
import * as S from '../styles/styles.js';

function AutoBid() {
  const [keyword, setKeyword] = useState("");
  const [isOn, setIsOn] = useState(false);

  const keywordHandler = (e) => {
    e.preventDefault();
    setKeyword(e.target.value);
  }

  const submitHandler = (e) => {
    e.preventDefault();

    let body = {
      keyword: keyword,
      isOn: isOn
    }

    axios
      .post('/auto-bid', body)
      .then((res) => console.log(res));
  }

  return (
    <BoxContainer>
      <BidList>
        <form onSubmit={submitHandler}>
          <label style={{marginRight : "20px"}}>키워드</label>
          <input
            type="text" value={keyword} onChange={keywordHandler}
            style={{marginRight : "50px"}} required
          />
          {/* <button type="submit">입찰 시작</button> */}
          <button
            type="submit" onClick={() => setIsOn(!isOn)}
            // style={{}}
          >
            { isOn ? 'ON' : 'OFF' }
          </button>
        </form>
      </BidList>
    </BoxContainer>
  )
}

const BoxContainer = styled.div`

`;

const BidList = styled.ul`

`;

const KeywordInput = styled.input`

`;

export default AutoBid;