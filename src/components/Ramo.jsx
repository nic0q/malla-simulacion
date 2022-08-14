export default function Ramo({name, abrev, color , handleClick}){   
  return <div onClick={handleClick} className= {`flex flex-col w-32 h-32 mb-5 mr-5 gray-400 rounded-lg ${color === "disponible" ? "bg-yellow-500" : color === "aprobado" ? "bg-green-400" : "bg-gray-400"}`}>
    <div className="bg-black text-white"> 
      <p>{abrev}</p>
    </div>
    <div className="flex items-center justify-center">
      <br /><br /><br /><br />
      <p>{name}</p>
    </div>
  </div>
}