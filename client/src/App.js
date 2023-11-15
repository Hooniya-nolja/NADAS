import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import * as XLSX from "xlsx";
import axios from 'axios';
import styled from "styled-components";

function App() {
  const [items, setItems] = useState([]);

  const readExcel=(file)=>{

    const promise = new Promise((resolve,reject)=>{
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb=XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws);

        resolve(data);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d)=>{
      // setItems(d);
      sendExcelData(d);
    });

  };

  const sendExcelData = async(excelData) => {
    try {
      console.log('Before original excel data : \n', excelData);
      const response = await axios.post('/keyword-excel', {
        excelData
      });
      console.log('POST keyword-excel response : \n', response.data);
      setItems(response.data);

    } catch (err) {
      console.log('ERROR sendExcelData : \n', err.response);
    }
  }

  const excelDownload = async (columns) => {
    const ws = XLSX.utils.json_to_sheet(columns);
    const wb = XLSX.utils.book_new();
 
    console.log('Excel download ==> excelData : ', items);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `NADAS_${Date.now()}.xlsx`);
  };

  return (
    <Container>
      <InnerContainer>
        <ProgramTitle>
          {/* <LogoImg src="icon_NADAS.png" alt="ERROR"/> */}
          NADAS
          <SubTitle>
            NAVER ADVERTISEMENT ASSISTANT
          </SubTitle>
        </ProgramTitle>
        <InputContainer>
          <FileNameLabel id="fileName">첨부파일</FileNameLabel>
          <LabelExcel for="excelFile">파일찾기</LabelExcel>
          <InputExcelOriginal type="file" id="excelFile"
            onChange={(e)=>{
              let input = document.getElementById('excelFile')
              let fileName = input.files[0].name;
              let placeholderInput = document.getElementById('fileName');
              placeholderInput.textContent = fileName;
              const file = e.target.files[0];
              readExcel(file);
            }}
          />
          {
            items[0] && 
            <DownloadButton className='excel-btn' onClick={()=> excelDownload(items)}>
            엑셀 다운로드
            </DownloadButton>
          }
          {
            items[0] && 
            <ReloadButton className='reload-btn' onClick={()=> window.location.reload()}>
              새로고침
            </ReloadButton>
          }
        </InputContainer>

        <table class="table">
          <thead>
            <tr>
              <th scope="col">Keyword</th>
              <th scope="col">Category</th>
              <th scope="col">BlockRank</th>
              {/* <th scope="col">AD_1st</th>
              <th scope="col">AD_2nd</th>
              <th scope="col">AD_3rd</th> */}
            </tr>
          </thead>
          <tbody>
            {
              items.map((d) => (
                <tr key={d.Keyword}>
                  <th>{d.Keyword}</th>
                  <td>{d.Category}</td>
                  <td>{d.BlockRank}</td>
                  {/* <td>{d.AD_1st}</td>
                  <td>{d.AD_2nd}</td>
                  <td>{d.AD_3rd}</td> */}
                </tr>
              ))
            }
          </tbody>
        </table>
        {
          !items[0] && 
          <CautionText>
           형식에 맞는 엑셀 파일을 업로드 해주세요.
          </CautionText>
        }
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px 20px 0 20px;
  background-color: #EEEEEE;
  width: 100vw;
  height: 100vh;
`;

const InnerContainer = styled.div`
  padding: 20px 20px 80px 30px;
  background-color: #FFFFFF;
  box-shadow: 0px 0px 2px 1px #999999;
  border-radius: 6px;
`;

const InputContainer = styled.div`
  margin-bottom: 40px;
`;

const ProgramTitle = styled.div`
  padding: 0px 0px 30px 0 ;
  font-size: 40px;
  font-weight: 800;
`;

const SubTitle = styled.div`
  padding-left: 2px;
  font-size: 14px;
  font-weight: 400;
`;

const LogoImg = styled.img`
  width: 64px;
  border-radius: 6px;
  margin-right: 20px;
`;

const FileNameLabel = styled.label`
  display: inline-block;
  height: 40px;
  padding: 6px 10px;
  vertical-align: middle;
  border: 1px solid #dddddd;
  width: 20%;
  color: #999999;
  border-radius: 6px;
`;

const LabelExcel = styled.label`
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  font-size: 14px;
  vertical-align: middle;
  background-color: #03C85A;
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
  margin-right: 30px;
  border-radius: 6px;
`;

const InputExcelOriginal = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

const DownloadButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  font-size: 12px;
  vertical-align: middle;
  background-color: #999999;
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
  border-radius: 6px;
  border: 0;
`;

const ReloadButton = styled.button`
  display: inline-block;
  padding: 10px 20px;
  color: #fff;
  font-size: 12px;
  vertical-align: middle;
  background-color: #999999;
  cursor: pointer;
  height: 40px;
  margin-left: 10px;
  border-radius: 6px;
  border: 0;
`;

const CautionText = styled.div`
  padding-top: 50px;
  text-align: center;
  color: #999999;
  font-size: 20px;
`;

export default App;
