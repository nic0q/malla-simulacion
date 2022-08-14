import Ramos from "../ramos.json"
import { useState } from "react";
import BotonNivel from "./BotonNivel.jsx";
import Ramo from "./Ramo.jsx"
import BotonAnio from "./BotonAnio";

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
const isSubset = (array1, array2) => array2.every((element) => array1.includes(element))

export default function Malla(){
  const [disponibles, set_disponibles] = useState([])
  const [aprobados, set_aprobados] = useState([])
  const ramo_click = (ramo) => {
    if(isSubset(aprobados,ramo.prereq))
      set_aprobados((aprov)=>{
        set_disponibles((disp)=>disp.concat(get_disponibles([...aprov, ramo.nombre], ramo.nombre)))
        return [...aprov, ramo.nombre]})
  }
  const nivel_click = (nivel) => {
    Ramos.filter(ramo => ramo.nivel === nivel).map(ramo => ramo_click(ramo))
  }
  const anio_click = (nivel) => {
    const anioa =[ nivel,(Number(nivel)+1).toString()]
    nivel_click(anioa[0])
    nivel_click(anioa[1])
  }
  const Nivel = ({nivel}) =>{
    return <div>
      <BotonNivel handleClick={()=>nivel_click (nivel)} nivel = {nivel}></BotonNivel>
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
  return <div className="flex col text-center align-middle justify-center">
    {Array(11).fill().map((_, nivel) => { nivel = nivel + 1
      return <div key = {nivel.toString()}>
        {(nivel+1)%2 === 0 ?
        <div>
          <br></br>
          <BotonAnio handleClick={()=>anio_click(nivel.toString())} año = {(((nivel-1)/2)+1)}></BotonAnio>
        </div>
        :<br></br>}
        <br></br>
        <Nivel nivel={nivel.toString()}></Nivel>
      </div>
      })
      }
  </div>
}
