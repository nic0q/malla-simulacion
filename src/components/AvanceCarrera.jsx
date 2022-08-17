export default function AvanceCarrera({n_aprobadas, n_total}){
  return <div className=" text-white mt-16">
    <h1>Avance de {(Number(n_aprobadas)*100/Number(n_total)).toFixed(2)}%</h1>
    <h3>{n_aprobadas} / {n_total}</h3>
  </div>
}