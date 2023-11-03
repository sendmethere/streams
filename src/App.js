import React, { useState } from 'react';
import Logo from './logo.png';
import PocketImg from './pocket.png';
import PenImg from './pen.png';
import ScoreImg from './score.png'


const Streams = () => {

  const [mode, setMode] = useState('pocket'); // 'pocket' or 'sheet'

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'pocket' ? 'sheet' : 'pocket'));
  };

  // Pocket에서 꺼내는 작업
  // 초기 pocket 상태 설정
  const initialPocket = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15,
    16, 16, 17, 17, 18, 18, 19, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, '⭐️'
  ];

  // pocket과 pickList 상태 설정
  const [pocket, setPocket] = useState(initialPocket);
  const [pickList, setPickList] = useState([]);

  // pocket을 초기 상태로 리셋하는 함수
  const initializeGame = () => {
    setPocket(initialPocket);
    initializePickList();
  };

  // pickList를 초기 상태(빈 배열)로 리셋하는 함수
  const initializePickList = () => {
    setPickList([]);
  };

  // 랜덤한 원소를 pocket에서 추출하고 pickList에 추가하는 함수
  const pick = () => {

    if (pickList.length >= 20) {
      // Optionally, you can alert the user or handle this case differently
      console.log("The pickList already has 20 elements.");
      return; // Exit the function if the condition is met
    }

    // pocket에서 랜덤한 인덱스 계산
    const randomIndex = Math.floor(Math.random() * pocket.length);
    // 선택된 원소 추출
    const pickedItem = pocket[randomIndex];
    // 추출된 원소를 pocket에서 제거하고 새로운 배열 생성
    const newPocket = pocket.filter((_, index) => index !== randomIndex);
    // pocket 상태 업데이트
    setPocket(newPocket);
    // pickList에 추출된 원소 추가
    setPickList([...pickList, pickedItem]);
  };

  
// 점수 계산 알고리즘 //

  const inputStyle = {
    MozAppearance: 'textfield', /* Firefox */
    WebkitAppearance: 'none', /* Chrome, Safari, Edge, and Opera */
  };

 // numbersArray state initialized with 20 undefined elements
  const [numbersArray, setNumbersArray] = useState(Array(20).fill(null));

  const resetNumbersArray = () => {
    setNumbersArray(Array(20).fill(null));
  };

  const updateNumber = (index, value) => {
    const updatedNumbers = [...numbersArray];
    updatedNumbers[index] = value === '' ? null : Number(value);
    setNumbersArray(updatedNumbers);
  };

  const scoreSheet = [0, 0, 1, 3, 5, 7, 9, 11, 15, 20, 25, 30, 35, 40, 50, 60, 70, 85, 100, 150, 300];

  const streamScore = () => {
    let tempScore = 0;
    const scoreList = [];

    // Use filter to ignore null or empty values
    const filteredNumbers = numbersArray.filter(n => n !== null);

    for (let i = 0; i < filteredNumbers.length; i++) {
      if (i === 0 || filteredNumbers[i] >= filteredNumbers[i - 1]) {
        tempScore += 1;
      } else {
        scoreList.push(tempScore);
        tempScore = 1;
      }
    }

    if (tempScore !== 0) {
      scoreList.push(tempScore);
    }

    return scoreList;
  };

  const calculateTotalScore = () => {
    const scoreList = streamScore();
    // Map each score to the corresponding value in the scoreSheet
    const totalScore = scoreList.reduce((acc, score) => {
      // Use the score as an index to get the value from the scoreSheet
      const scoreValue = scoreSheet[score] || 0;
      return acc + scoreValue;
    }, 0);
    return totalScore;
  };
  
  return (
    <div className='max-w-[1000px] w-full m-auto'>
      <div className='p-4 flex justify-center mt-[2rem] mb-[1rem]'><img src={Logo} alt="Logo" /></div>
      <div className='w-full rounded-xl bg-white p-8 mb-4'>
        <div className='rounded-xl p-2 border border-gray-300 m-auto w-[60px] cursor-pointer flex justify-center' onClick={toggleMode}>
          {mode === 'pocket' ? (
            <img src={PocketImg} alt="pocket" />
          ) : (
            <img src={PenImg} alt="pen" />
          )}
        </div>
        {/* Render content based on the current mode */}
        {mode === 'pocket' ? (
          <div>
            <div className='flex justify-center m-2'>
              <button className='p-2 mx-2 w-[60px] rounded-xl font-bold bg-gray-200' onClick={initializeGame}>초기화</button>
              <button className='p-2 mx-2 w-[100px] rounded-xl font-bold bg-blue-500 text-white' onClick={pick}>꺼내기</button>
            </div>
            <div className="px-[100px] grid grid-cols-4 gap-4">
            {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="p-2 border border-gray-300 flex items-center justify-center text-center text-[2.5rem] rounded-xl h-[80px]">
                {pickList[index] || ''}
              </div>
            ))}
            </div>
          </div>
        ) : (
          <div>
            <div className='flex justify-center m-2'>
              <button className='p-2 mx-2 w-[60px] rounded-xl font-bold bg-gray-200' onClick={resetNumbersArray}>초기화</button>
            </div>
            <div className="px-[100px] grid lg:grid-cols-10 md:grid-cols-5 sm:grid-cols-4 grid-cols-3">
              {numbersArray.map((number, index) => {
                const isSpecialIndex = (index + 1) % 5 === 0;
                // Set the background color based on the index
                const backgroundColor = isSpecialIndex ? 'bg-gray-100' : '';
                // Combine the determined background color with the other classes
                const inputClasses = `p-3 border border-gray-300 rounded-xl m-2 w-[70px] text-[1.5rem] text-center number-input ${backgroundColor}`;

                return (
                <input
                className={inputClasses}
                  key={index}
                  type="number"
                  value={number || ''}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  style={inputStyle}
                />
              )})}
            </div>
            <div className='text-center'>
              <p className='text-[2rem] font-black'>{calculateTotalScore()}점</p>
              <p className='mt-6'>점수 가이드</p>
              <img src={ScoreImg} className='max-w-[600px] w-full m-auto'/>
            </div>
          </div>
        )}
      </div>
      <p className='text-center m-2 text-[#ffffffaa]'>STREAMS by 행복한엄쌤</p>
    </div>

  );
};

export default Streams;
