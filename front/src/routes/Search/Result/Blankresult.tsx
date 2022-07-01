import React from "react";
import { Link } from "react-router-dom";
import Searchbar from "../../_shared/Searchbar";

const Blankresult = () => {
  return (
    <div className="bg-base-200">
      <div className="p-2 break-words text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mx-6 pb-4 leading-normal text-teal-500">검색 결과가 없습니다.</h1>
        <p className="p-2 text-width-700">Pill my rhythm의 AI가 문장 분석을 실패했습니다.</p>
        <p className="leading-7 p-2 mb-4">
          <br />
          ❔ 혹시 '건강 상태'가 아닌 '증상'을 입력하신 건 아닌가요 ❔
          <br />
          콧물이 나요⭕ 비염이 심해요❌
          <br /> <br />
          ❕ AI가 정확한 문장을 분석할 수 있도록 맞춤법을 지켜주세요 ❕
          <br />
          콧물이 나요⭕ 콧물이나요❌
          <br /> <br /> <br />
          그럼, 다시 한번 시도해보시겠어요?
        </p>
        <div className="m-4">
          <Searchbar />
        </div>
      </div>
      <div className="h-20" />
    </div>
  );
};
export default Blankresult;