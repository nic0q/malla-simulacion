import Ramo from "./Ramo.jsx"
import Ramos from "../ramos.json"
import { useState } from "react";

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
  }
  let str = '';
  for (let i of Object.keys(roman)) {
    const q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
}
const get_disponibles = (nombre) => {
  return Ramos.filter(ramo => ramo.prereq.includes(nombre)).map(ramo => ramo.nombre)
}
const isSubset = (array1, array2) => array2.every((element) => array1.includes(element));
export default function Malla(){
  const [ramos, set_ramos] = useState(false)
  const [disponibles, set_disponibles] = useState([])
  const [aprobados, set_aprobados] = useState([])
  const ramo_click = (ramo) => {
    set_ramos(!ramos)
    set_aprobados([...aprobados, ramo.nombre])
    set_disponibles(disponibles.concat(get_disponibles(ramo.nombre)))
    // console.log(aprobados)
  }
  const Nivel = ({nivel}) =>{
    const nivel_click = (nivel) => {
      set_ramos(!ramos)
      // console.log(Ramos.filter(ramo => ramo.nivel === nivel))
      
    }
    return <div className="flex flex-col items-center text-center align-middle">
      <p onClick={()=>nivel_click(nivel)} className="mr-5 text-white">{convertToRoman(nivel)}</p>
      {Ramos.map(ramo => {
      return ramo.nivel === nivel ?
        <Ramo
          handleClick = {()=>ramo_click(ramo)}
          key = {ramo.abrev}
          color = {aprobados.includes(ramo.nombre) ? "aprobado": disponibles.includes(ramo.nombre) || !ramo.prereq.length ? "disponible" : "no_disponible"}
          abrev = {ramo.abrev}
          name={ramo.nombre}>
        </Ramo>
      : ""})}
    </div>
  }
  return <div className="flex row">
    {Array(11).fill().map((_, i) => { i = i + 1
      return <Nivel key = {i.toString()} nivel={i.toString()}></Nivel>})}
  </div>
}
