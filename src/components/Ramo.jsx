import React from "react";
export default function Ramo({name, abrev, tipo, estado , handleClick, aprob, handleHover, handleOut}){
  return <div onMouseEnter={handleHover} onClick={handleClick} className= {`flex flex-col w-32 h-32 mb-2 mx-2 rounded-lg cursor-pointer hover:opacity-90 ${tipo} ${estado}`}>
    {aprob ? <img src="https://logodix.com/logo/1317798.png" className="fixed w-32" alt="aprob"/> : ""}
    <div className="bg-black text-white" onMouseLeave={handleOut}> 
      <p>{abrev}</p>
    </div>
    <div className="flex items-center justify-center px-2.5">
      <br /><br /><br /><br />
      <p>{name}</p>
    </div>
  </div>
}