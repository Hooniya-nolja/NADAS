import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px 20px 0 20px;
  background-color: #EEEEEE;
  width: 100vw;
  height: 100vh;
`;

export const InnerContainer = styled.div`
  padding: 20px 20px 80px 30px;
  background-color: #FFFFFF;
  box-shadow: 0px 0px 2px 1px #999999;
  border-radius: 6px;
`;

export const InputContainer = styled.div`
  margin-bottom: 40px;
`;

export const ProgramTitle = styled.div`
  padding: 0px 0px 30px 0 ;
  font-size: 40px;
  font-weight: 800;
`;

export const SubTitle = styled.div`
  padding-left: 2px;
  font-size: 14px;
  font-weight: 400;
`;

export const LogoImg = styled.img`
  width: 64px;
  border-radius: 6px;
  margin-right: 20px;
`;

export const FileNameLabel = styled.label`
  display: inline-block;
  height: 40px;
  padding: 6px 10px;
  vertical-align: middle;
  border: 1px solid #dddddd;
  width: 20%;
  color: #999999;
  border-radius: 6px;
`;

export const LabelExcel = styled.label`
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

export const InputExcelOriginal = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
`;

export const DownloadButton = styled.button`
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

export const ReloadButton = styled.button`
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

export const CautionText = styled.div`
  padding-top: 50px;
  text-align: center;
  color: #999999;
  font-size: 20px;
`;

// export default styles;