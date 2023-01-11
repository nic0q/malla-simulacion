import ramos_civil from "../ramos_civil.json"
import React from "react";
import { useState } from "react";
import BotonNivel from "./BotonNivel.jsx";
import Ramo from "./Ramo.jsx"
// import BotonAnio from "./BotonAnio";
// import AvanceCarrera from "./AvanceCarrera";

const COLORFULL_TYPES = {
  'MBI': 'bg-blue-500',
  'ING': 'bg-blue-600',
  'INF-BDD': 'bg-green-300',
  'INF': 'bg-green-400',
  'ELE': 'bg-red-400',
  'TOP': 'bg-purple-500',
  'OPC': 'bg-yellow-400',
}

const NORMAL_COLORS = {
  'DISP': "bg-yellow-300",
  'APRO': "bg-[#68fd68]",
  'PEND': "bg-gray-300",
  'PRE': "bg-pink-300"
}
const PRIDE_COLORS = {
  1:'bg-[#5D308F]',
  2:'bg-[#1281D0]',
  3:'bg-[#59B665]',
  4:'bg-[#EBE51F] text-black',
  5:'bg-[#F08F1E]',
  6:'bg-[#D61E1E]'
}

const LOA = 0
const VERBOSE = 1
const PRIDE = 2
/* No estoy seguro si es una mejor practica hacer un diccionario o hacer constantes como en C
// const SKIN_TYPES = {
//   VERBOSE: 0,
//   LOA: 1,
//   PRIDE: 2,
// }
// const COLORES_ESTADO = {
//   'DISP': "bg-yellow-500",
//   'APRO': "bg-green-400",
// }
*/
// Funcion que obtiene los ramos_civil disponibles (Que pueden ser tomados) para el ramo actual
const get_disponibles = (aprobados, nombre) => {
  const disp = []
  ramos_civil.filter(ramo => ramo.prereq.includes(nombre)).filter(ramo => is_subset(aprobados,ramo.prereq)).map(ramo => disp.push(ramo.nombre))
  return disp
}
// Función que obtiene todos los ramos afectados a raíz de uno (concepo de transitividad)
const get_ramos_afectados = (ramo_inicio) => {
  let name = [ramo_inicio], acum = []
  while(name.length){ // Mientras haya ramos afectados
    name = name.map(el => ramos_civil.filter(ramo => ramo.prereq.includes(el))).flat().map(ramo => ramo.nombre)
    acum = acum.concat(name)
  }
  return acum
}
// Funcion que determina si arreglo 1 es subconjunto de arreglo2 (Se encuentran todos sus elementos)
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
  const [prereqs, set_prereqs] = useState([])
  const [aprobados, set_aprobados] = useState([])
  const [colorfull, set_colorfull] = useState(0)
  // Funcion que actualiza la malla al hacer click en un ramo, ya se aprobando un ramo y abriendo ramos a raiz de la aprobacion
  const ramo_click = (ramo) => {
    if(is_subset(aprobados,ramo.prereq))
      set_aprobados((aprov)=>{
        set_disponibles((disp)=>update_disponibles(aprov, ramo, disp))
        return update_aprobados(aprov, ramo)})
  }
  // Función que actualiza el nivel entero de la malla, utilizando la función de ramo_click
  const nivel_click = (nivel) => {
    const a = ramos_civil.filter(ramo => ramo.nivel === nivel)
    console.log(a)
    ramos_civil.filter(ramo => ramo.nivel === nivel).map(ramo => ramo_click(ramo))
  }
  // const anio_click = (nivel) => {
  //   const anioa = [nivel,(Number(nivel)+1).toString()]
  //   nivel_click(anioa[0])
  //   nivel_click(anioa[1])
  // }
  const get_estado_ramo = (ramo, aprobados, disponibles, prereqs) =>{
    if(prereqs.includes(ramo.nombre)) return NORMAL_COLORS["PRE"]
    if(aprobados.includes(ramo.nombre)) return NORMAL_COLORS["APRO"]
    if(disponibles.includes(ramo.nombre) || !ramo.prereq.length) return NORMAL_COLORS["DISP"]
    
  }
  const Nivel = ({nivel}) =>{
    return <div>
      <BotonNivel handleClick={()=>nivel_click (nivel)} nivel = {nivel}/>
      {ramos_civil.map(ramo => {
      return ramo.nivel === nivel ?
        <Ramo
          handleClick = {()=>ramo_click(ramo)}
          handleHover = {()=>set_prereqs(ramo.prereq)}
          handleOut = {()=>set_prereqs([])}
          key = {ramo.abrev}
          // aprobados.includes(ramo.nombre) ? "bg-green-300": disponibles.includes(ramo.nombre) || !ramo.prereq.length ? "text-white" : "opacity-60"
          tipo = {colorfull === VERBOSE ?
            (COLORFULL_TYPES[ramo.tipo]) :
              colorfull === LOA ? (get_estado_ramo(ramo, aprobados, disponibles, prereqs) || NORMAL_COLORS["PEND"]) :
                colorfull === PRIDE ? (nivel % 2 === 0 ? PRIDE_COLORS[nivel/2] : PRIDE_COLORS[(((nivel-1)/2)+1)])
                : ""}
          estado = {
            colorfull === VERBOSE || colorfull === PRIDE ?
              aprobados.includes(ramo.nombre) ? `shadow-xl shadow-indigo-500 text-white`: disponibles.includes(ramo.nombre) || !ramo.prereq.length ? "text-white" : "opacity-60"
            : ""}
          abrev = {ramo.abrev}
          aprob = {aprobados.includes(ramo.nombre) && colorfull !== LOA ? true : false}
          name={ramo.nombre}/> : ""})
      }
    </div>
  }
  return <div className="flex bg-gray-800">

  <div className="flex justify-center w-[90%] h-screen overflow-auto">
    <div className="flex flex-row text-center align-middle w-full h-full">
      {Array(11).fill().map((_,nivel) => { nivel = nivel + 1
        return <div key = {nivel.toString()}>
          <Nivel nivel={nivel.toString()}/>
        </div>
        })
      }
    </div>
  </div>
  <div className="flex-col w-[10%] h-screen text-white ml-2">   
    {/* <div>
    <button onClick={()=>set_colorfull((state)=>{if(state === 2) return 0; else return state + 1})}>
    Cambiar aspecto
    <div className="border-2 w-32 h-8 mb-1 border-white p-1 hover:bg-white hover:text-black">
      {{0:"LOA 📘",1:"Verbose 🗣️",2: "Pride 🌈"}[colorfull]}
    </div>
    </button ></div>  */}
    <div>
    <button onClick={()=>{set_disponibles([]); set_aprobados([])}}>
    <div className="border-2 w-32 h-8 border-white p-1 hover:bg-white hover:text-black">
      Limpiar Malla
    </div>
    </button></div>
  </div>
  </div>
}
