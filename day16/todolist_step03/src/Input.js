import { useRef, useState } from "react";

const Input = ({onClickEvent}) => {

    const [inputTitle, setInputTitle] = useState("");

    // 훅은 콜백함수에 포함될 수 없다.
    const inputFocus = useRef(null);

    return (
        <div className="input-title">
          <div className="container" style={{padding: "10px"}}>
            <div className="input-group mb-3">
                <input autoFocus ref={inputFocus} value={inputTitle} onChange={(e)=> setInputTitle(e.target.value)} type="text" className="form-control"/>
                <div className="input-group-append">
                    <button className="btn btn-success" onClick={(e) =>{
                        if(inputTitle === "" || inputTitle === null) {
                            alert("내용이 없습니다!");
                            inputFocus.current.focus();
                            return;
                        }
                        onClickEvent(inputTitle);
                        setInputTitle("");
                        // useRef() 훅 사용 focus를 잡아준다.
                        inputFocus.current.focus();
                    }}>Save</button>
                </div>
            </div>
          </div>
        </div>
    );
}

// 대표 컴포넌트를 하나만 모듈 등록
export default Input;

//const InputSub = () => {
//    return (<>
    
//    </>);
//}

// 여러 컴포넌트를 모듈로 등록할 때 
//export {Input, InputSub};

// 불러올 때 import {Input, InputSub} from "./Input"