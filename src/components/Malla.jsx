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
// I: Arreglo de ramos aprobados (hook), Nombre del ramo actual
// O: Arreglo de ramos disponibles para el ramo actual
// Funcion que obtiene los ramos disponibles (Que pueden ser tomados) para el ramo actual
const get_disponibles = (aprobados, nombre) => {
  const disp = []
  Ramos.filter(ramo => ramo.prereq.includes(nombre)).filter(ramo => isSubset(aprobados,ramo.prereq)).map(ramo => disp.push(ramo.nombre))
  return disp
}
// I: arreglo1, arreglo2
// O: true si arreglo2 es un subconjunto de arreglo1
// Funion que determina si arreglo 1 es subconjunto de arreglo2 (Se encuentran todos sus elementos)
const isSubset = (array1, array2) => {
  return array2.every((element) => array1.includes(element))}

export default function Malla(){
  const [ramos, set_ramos] = useState(false)
  const [disponibles, set_disponibles] = useState([])
  const [aprobados, set_aprobados] = useState([])

  const ramo_click = (ramo) => {
    set_ramos(!ramos)
    if(isSubset(aprobados,ramo.prereq))
      set_aprobados((aprov)=>{
        set_disponibles((disp)=>disp.concat(get_disponibles([...aprov, ramo.nombre], ramo.nombre)))
        return [...aprov, ramo.nombre]})
  }
  const Nivel = ({nivel}) =>{
    const nivel_click = (nivel) => {
      set_ramos(!ramos)
      console.log(Ramos.filter(ramo => ramo.nivel === nivel).map(ramo => ramo_click(ramo)))
      
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
