import React, { useState, useRef, useEffect } from 'react';
import finder from '../finder';
import styled from 'styled-components';

const InputWrapper = styled.input`
height: 40px;
line-height: 38px;
max-width: 100%;
width: 100%;
border: 0 none;
padding: 0 6px;
background: #fff;
color: #666;
border: 1px solid #e5e5e5;
`
const List = styled.div`
  position: absolute;
  width: 100%;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

`
const ListItem = styled.div`
  padding: 8px;
  width: 100%;
  &:hover {
    background-color: #ddd;
  }
`

const DropdownWrapper = styled.div`
  width: 100%;
  position: relative;
  display: inline-block;
`

function outsideClick(ref, setShowList) {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowList(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });
}
const InputAddress= (props) => {

  const wrapperRef = useRef(null);
  const type = props.type || 'district'
  const limit = props.limit || 50
  const [result, setResult] = useState([])
  const [showList, setShowList] = useState(false)

  outsideClick(wrapperRef, setShowList);

  const showResult = (e) => {
    setShowList(true)
    setResult(finder.resolveResultbyField(e.target.value, type))
    props.onChange({ name: props.type, vaule: e.target.value })
  }

  return (
    <DropdownWrapper ref={wrapperRef}>
      {props.name && <label htmlFor={type}>{props.name}</label>}
      <InputWrapper
        style={{ ...props.inputStyle }}
        placeholder={props.placeholder}
        onClick={showResult}
        onChange={showResult}
        value={props.value}
      />
      {showList &&
        <List style={{ ...props.listStyle }}>
          {result
            .filter((v, i) => i < limit)
            .map((row, i) => (
              <ListItem
                key={i}
                style={{ ...props.listItemStyle }}
                onClick={e => {
                  setShowList(false)
                  props.onSelected(row)
                }}
              >
                {`${row.district} » ${row.amphoe} » ${row.province} » ${row.zipcode || 'ไม่มีรหัสไปรษณีย์'}`}
              </ListItem>
            )
            )
          }</List>
      }
    </DropdownWrapper >
  );
}

// This export will be picked up in ./index.js
export default InputAddress;