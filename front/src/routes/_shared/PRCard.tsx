import React, { useEffect, useState } from "react";
import { PillData } from "../Search/Result/PRList";
import PRModal from "./PRModal";
import { get, post, del } from "../../Api";
import { BookMark, FilledBookMark } from "./BookMark";
import { userState } from "../../atoms";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";

const PRCard = ({ pr }: PillData) => {
  const user = useRecoilValue(userState);
  // console.log("user", user);
  const isLogin = !(user.length === 0);
  const supplement_id = pr.pk_supplement_id;
  const navigate = useNavigate();
  const LoginCheck = () => {
    alert("회원 전용 서비스 입니다! 로그인 후 이용해주세요!");
    navigate("/login");
  };

  // console.log("#pr.pk_supplement_id", pr.pk_supplement_id);

  const [bookMark, setBookMark] = useState<Boolean>();
  const [bookMarkList, setBookMarkList] = useState([]);

  const DBcheckBookMark = (bookMarkList: Array<any>) => {
    if (bookMarkList.some((Supplement) => Supplement.Supplement.pk_supplement_id === pr.pk_supplement_id)) {
      setBookMark(true);
    } else {
      setBookMark(false);
    }
  };

  const loadBookMarkList = async () => {
    if (isLogin)
      try {
        const res = await get("bookmark");
        setBookMarkList(res.data);
        DBcheckBookMark(res.data);
      } catch (error) {
        console.log(error);
      }
  };

  const HandleBookMarkChange: any = async () => {
    try {
      const data = {
        accessToken: user.accessToken,
        supplement_id: pr.pk_supplement_id,
      };
      if (!bookMark) {
        await post(`bookmark/create/${supplement_id}`, data);
      } else {
        await del("bookmark", `${pr.pk_supplement_id}`);
      }
      loadBookMarkList();
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message) {
        alert(error.response.data.message);
      }
    }
  };

  useEffect(
    () => {
      loadBookMarkList();
      // DBcheckBookMark(bookMarkList);
    },
    [bookMark],
    // [bookMark, bookMarkList],
  );

  return (
    <div className="card card-compact w-80 bg-base-100 shadow-xl m-4">
      <figure>
        <img className="w-48 m-6 rounded-lg backdrop-contrast-125 bg-white/30" src={pr.img_link} alt="pills" />
      </figure>
      <div className="card-body">
        <div className="flex flex-row flex-wrap items-center break-words">
          <h2 className="card-title px-2">{pr.name}</h2>
        </div>
        <hr />
        <p className="p-2 h-max m-1 break-words">{pr.function}</p>
        <div className="card-actions justify-end items-center">
          {!isLogin ? (
            <label htmlFor="">
              <BookMark onClick={LoginCheck} />
            </label>
          ) : !bookMark ? (
            <label htmlFor="">
              <BookMark onClick={HandleBookMarkChange} />
            </label>
          ) : (
            <label htmlFor="">
              <FilledBookMark onClick={HandleBookMarkChange} />
            </label>
          )}
          <label htmlFor={`modal-${pr.name}`} className="btn modal-button btn-primary">
            더 알아보기
          </label>
          <PRModal pr={pr} key={pr.pk_supplement_id} />
        </div>
      </div>
    </div>
  );
};
export default PRCard;
