const date = new Date();

const opciones = {
  timeZone: 'America/Argentina/Buenos_Aires',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
};

// Usando toLocaleString
console.log(date.toLocaleString('es-AR', opciones));

// O si prefieres un formato más personalizado:
 function obtenerFechaHoraArgentina() {
  const date = new Date();
  const formatoFechaHora = date.toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'short',  // Formato corto para la fecha
    timeStyle: 'medium'  // Formato medio para la hora
  });
  return formatoFechaHora;
}
module.exports={obtenerFechaHoraArgentina}