export default function Ramo({name, abrev, tipo, estado , handleClick, aprob}){   
  return <div onClick={handleClick} className= {`flex flex-col w-32 h-32 mb-2 mx-2 rounded-lg ${tipo} ${estado}`}>
    {aprob ? <img className="fixed w-32" alt="aprob" src="https://logodix.com/logo/1317798.png"></img> : ""}
    <div className="bg-black text-white"> 
      <p>{abrev}</p>
    </div>
    <div className="flex items-center justify-center px-2.5">
      <br /><br /><br /><br />
      <p>{name}</p>
    </div>
  </div>
}