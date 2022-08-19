export default function BotonAnio({año, handleClick}){
  return <div onClick={()=>handleClick(año)}>
    <p className={`fixed bg-gray-200 hover:bg-gray-400 ${año === "5/2" ? "w-36" : "w-72 "}`}>Año {año}</p>  
    </div>
}