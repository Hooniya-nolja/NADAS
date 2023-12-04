import React, { useState } from "react";
// import './App.css';
import * as XLSX from "xlsx";
import axios from 'axios';
import * as S from '../styles/styles.js';

function KeywordAnalyze() {
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
    // <S.Container>
    //   <S.InnerContainer>
    <>
        <S.InputContainer>
          <S.FileNameLabel id="fileName">첨부파일</S.FileNameLabel>
          <S.LabelExcel for="excelFile">파일찾기</S.LabelExcel>
          <S.InputExcelOriginal type="file" id="excelFile"
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
            <S.DownloadButton className='excel-btn' onClick={()=> excelDownload(items)}>
            엑셀 다운로드
            </S.DownloadButton>
          }
          {
            items[0] && 
            <S.ReloadButton className='reload-btn' onClick={()=> window.location.reload()}>
              새로고침
            </S.ReloadButton>
          }
        </S.InputContainer>

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
          <S.CautionText>
           형식에 맞는 엑셀 파일을 업로드 해주세요.
          </S.CautionText>
        }
    </>
    //   </S.InnerContainer>
    // </S.Container>
  );
}



export default KeywordAnalyze;
