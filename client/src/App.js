import logo from './logo.svg';
import './App.css';

function App() {

  const readExcel=(file)=>{

    const promise = new Promise((resolve,reject)=>{

      const fileReader = new FileReader();
      fileReader.readAsArra
      
    })

  }

  return (
    <div>
      <input 
        type="file" 
        onChange={(e)=>{
          const file = e.target.files[0];
          readExcel(file);
        }}
      />
    </div>
  );
}

export default App;
