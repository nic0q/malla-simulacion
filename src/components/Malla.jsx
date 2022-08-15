import ramos_civil from "../ramos_civil.json"
import { useState } from "react";
import BotonNivel from "./BotonNivel.jsx";
import Ramo from "./Ramo.jsx"
import BotonAnio from "./BotonAnio";
import AvanceCarrera from "./AvanceCarrera";

const COLORFULL_TYPES = {
  'MBI': 'blue-500',
  'ING': 'blue-600',
  'INF-BDD': 'green-300',
  'INF': 'green-400',
  'ELE': 'red-400',
  'TOP': 'purple-500',
  'OPC': 'yellow-400',
}
const NORMAL_COLORS = {
  'DISP': "yellow-500",
  'APRO': "green-500",
}
const PRIDE_COLORS = {
  1:'[#5D308F]',
  2:'[#1281D0]',
  3:'[#59B665]',
  4:'[#EBE51F]',
  5:'[#F08F1E]',
  6:'[#D61E1E]'
}
// const COLORES_ESTADO = {
//   'DISP': "bg-yellow-500",
//   'APRO': "bg-green-400",
// }
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
    ramos_civil.filter(ramo => ramo.nivel === nivel).map(ramo => ramo_click(ramo))
  }
  const anio_click = (nivel) => {
    const anioa = [nivel,(Number(nivel)+1).toString()]
    nivel_click(anioa[0])
    nivel_click(anioa[1])
  }
  const get_estado_ramo = (ramo, nombre, aprobados, disponibles) =>{
    if(aprobados.includes(nombre)) return NORMAL_COLORS["APRO"]
    if(disponibles.includes(nombre) || !ramo.prereq.length) return NORMAL_COLORS["DISP"]
  }
  
  const Nivel = ({nivel}) =>{
    return <div>
      <BotonNivel handleClick={()=>nivel_click (nivel)} nivel = {nivel}/>
      {ramos_civil.map(ramo => {
      return ramo.nivel === nivel ?
        <Ramo
          handleClick = {()=>ramo_click(ramo)}
          key = {ramo.abrev}
          // aprobados.includes(ramo.nombre) ? "bg-green-300": disponibles.includes(ramo.nombre) || !ramo.prereq.length ? "text-white" : "opacity-60"
          tipo = {colorfull=== 0 ?(COLORFULL_TYPES[ramo.tipo]) : colorfull === 1 ?  get_estado_ramo(ramo, ramo.nombre, aprobados, disponibles) || "[#EBEBEB]" : nivel%2 ===0 ?  PRIDE_COLORS[nivel/2] : PRIDE_COLORS[(((nivel-1)/2)+1)]}
          // tipo = {nivel%2 ===0 ?  PRIDE_COLORS[nivel/2] : PRIDE_COLORS[(((nivel-1)/2)+1)]}
          estado = {aprobados.includes(ramo.nombre) ? `shadow-2xl shadow-indigo-400 text-white`: disponibles.includes(ramo.nombre) || !ramo.prereq.length ? "text-white opacity-80" : "opacity-30"}
          abrev = {ramo.abrev}
          name={ramo.nombre}/>
      : ""})}
    </div>
  }
  return <div>
    <div className="text-white flex justify-end" onClick={()=>set_colorfull((state)=>{if(state === 2) return 0; else return state+1})}>
      <button className=" border-2 border-white p-2">
        Cambiar Aspecto {{0:"Verbose 🗣️",1:"Skin Normal 📘",2: "🌈"}[colorfull]}
      </button>
    </div>
  <div className="flex col text-center align-middle justify-center">
    {Array(11).fill().map((_, nivel) => { nivel = nivel + 1
      return <div key = {nivel.toString()}>
        {(nivel+1)%2 === 0 ?
        <div>
          <br></br>
          <BotonAnio handleClick={()=>anio_click(nivel.toString())} año = {(((nivel-1)/2)+1)}/>
        </div>
        :<br></br>}
        <br></br>
        <Nivel nivel={nivel.toString()}/>
      </div>
      })
    }
    </div>
    <AvanceCarrera n_aprobadas={aprobados.length} n_total={ramos_civil.length}/>  
    </div>
}