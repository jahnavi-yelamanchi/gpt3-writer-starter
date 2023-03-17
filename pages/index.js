import Head from 'next/head';
import {useState} from 'react';

const Home = () => {
  const [userInput,setUserInput] = useState('');

  //openai server less backend function calls
  const [apiOutput, setApiOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const callGeneratingEndpoint = async () => {
    setIsGenerating(true);

    console.log("calling openai")
    const response = await fetch('/api/generate',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({userInput}),
    });

    const data = await response.json();
    const {output} = data;
    console.log("openai replied",output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false)
  }

  const onUserChangedText=(event)=>{
    console.log(event.target.value);
    setUserInput(event.target.value);
  }
  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>ref maker</h1>
          </div>
          <div className="header-subtitle">
            <h2>get references from long paragraphs</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
            placeholder="add weird paras here" 
            className="prompt-box" 
            value={userInput}
            onChange={onUserChangedText}
          />
          <div className="prompt-buttons">
            <a 
              // className="generate-button" 
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGeneratingEndpoint}
            >
              <div className="generate">
                {isGenerating ? <span class="loader"></span> : <p>Generate</p>}
                {/* <p>Generate</p> */}
              </div>
            </a>
          </div>
          {apiOutput&&(
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Output</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
