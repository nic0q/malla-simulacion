export default function BotonAnio({año, handleClick}){
  return <div onClick={()=>handleClick(año)}>
    <p className="w-72 fixed bg-gray-200 hover:bg-gray-400">Año {año}</p>  
    </div>
}