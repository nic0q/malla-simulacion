import ramos_civil from "../ramos_civil.json"
import { useState } from "react";
import BotonNivel from "./BotonNivel.jsx";
import Ramo from "./Ramo.jsx"
import BotonAnio from "./BotonAnio";

// I: Arreglo de ramos_civil aprobados (hook), Nombre del ramo actual
// O: Arreglo de ramos_civil disponibles para el ramo actual
// Funcion que obtiene los ramos_civil disponibles (Que pueden ser tomados) para el ramo actual
const get_disponibles = (aprobados, nombre) => {
  const disp = []
  ramos_civil.filter(ramo => ramo.prereq.includes(nombre)).filter(ramo => is_subset(aprobados,ramo.prereq)).map(ramo => disp.push(ramo.nombre))
  return disp
}
const get_ramos_afectados = (nombre) => {
  let name = [nombre]
  let acum = []
  let prereq = []
  let i = 0
  while(i < 5){
    prereq = name.map(el => ramos_civil.filter(ramo => ramo.prereq.includes(el))).flat().map(ramo => ramo.nombre)
    name = prereq
    acum = acum.concat(prereq)
    i++
  }
  return acum
}
// I: arreglo1, arreglo2
// O: true si arreglo2 es un subconjunto de arreglo1
// Funion que determina si arreglo 1 es subconjunto de arreglo2 (Se encuentran todos sus elementos)
const is_subset = (array1, array2) => array2.every((element) => array1.includes(element))

// Función que actualiza los ramos disponnibles en la malla en caso de seleccione o deseleccione un recuadro
const update_disponibles = (aprov, ramo, disp) => {
  if(is_subset(disp,get_disponibles([...aprov, ramo.nombre], ramo.nombre))){ // Si los ramos que se quiere agregar ya se encuentran mostrandose en la malla se eliminan de la lista de disponibles
    return disp.filter((ramo_disp) => (ramo_disp === ramo.nombre || !get_ramos_afectados(ramo.nombre).includes(ramo_disp)) );
  }
  return disp.concat(get_disponibles([...aprov, ramo.nombre], ramo.nombre)) // Si no, se agregan
}
// Actualiza los ramos aprobados en la malla, en caso se deseleccione un recuadro o se añada uno
const update_aprobados = (aprov, ramo) => {
  if(aprov.includes(ramo.nombre)){  // Si se quiere deseleccionar un ramo aprobado y ya esta en la malla se elimina de la lista de aprobados
    return aprov.filter((el) => (el !== ramo.nombre && !get_ramos_afectados(ramo.nombre).includes(el)));
  }
  return aprov.concat(ramo.nombre)  // Si no, se agrega
}
export default function Malla(){
  const [disponibles, set_disponibles] = useState([])
  const [aprobados, set_aprobados] = useState([])
  const ramo_click = (ramo) => {
    if(is_subset(aprobados,ramo.prereq))
      set_aprobados((aprov)=>{
        set_disponibles((disp)=>update_disponibles(aprov, ramo, disp))
        return update_aprobados(aprov, ramo)})
  }
  const nivel_click = (nivel) => {
    ramos_civil.filter(ramo => ramo.nivel === nivel).map(ramo => ramo_click(ramo))
  }
  const anio_click = (nivel) => {
    const anioa = [nivel,(Number(nivel)+1).toString()]
    nivel_click(anioa[0])
    nivel_click(anioa[1])
  }
  const Nivel = ({nivel}) =>{
    return <div>
      <BotonNivel handleClick={()=>nivel_click (nivel)} nivel = {nivel}></BotonNivel>
      {ramos_civil.map(ramo => {
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
