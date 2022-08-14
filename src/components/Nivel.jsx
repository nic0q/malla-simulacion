import Ramo from "./Ramo.jsx"
import Ramos from "../ramos.json"
import { useState } from "react";

export default function Nivel({nivel}){
  const [ramos, setRamos] = useState(false)
  function convertToRoman(num) {
    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    let str = '';
    for (let i of Object.keys(roman)) {
      const q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
    return str;
  }
  const handleClick = (e) => {
    setRamos(true)
    console.log(ramos,e)
  }
  return <div className="flex flex-col items-center text-center align-middle">
    <p className="mr-5 text-white ">{convertToRoman(nivel)}</p>
    {Ramos.map(ramo => ramo.nivel === nivel ? 
      <Ramo handleClick = {handleClick} key = {ramo.abrev} color = {ramos ? "blue" : "yellow"} abrev = {ramo.abrev} name={ramo.nombre}></Ramo>
    : "")}
  </div>
}