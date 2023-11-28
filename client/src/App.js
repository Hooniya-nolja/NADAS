import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import * as XLSX from "xlsx";
import axios from 'axios';
import styled from "styled-components";
import * as S from './styles/styles.js';
import Tab from './Tab.js';
import KeywordAnalyze from "./KeywordAnalyze.js";

function App() {
  
  return (
    <S.Container>
      <S.InnerContainer>
        <S.ProgramTitle>
          {/* <LogoImg src="icon_NADAS.png" alt="ERROR"/> */}
          <div>NADAS</div>
          <S.SubTitle>
            NAVER ADVERTISEMENT ASSISTANT
          </S.SubTitle>
        </S.ProgramTitle>

        <Tab />

      </S.InnerContainer>
    </S.Container>
  );
}


export default App;
