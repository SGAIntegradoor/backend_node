const getTokenBolivar = require("./tokenBolivar");
const preSettleBolivar = require("./preSettleBolivar");
const recoverySettle = require("./recoverySettle");
const settleBolivar = require("./settleBolivar");
const quotationBolivar = require("./quotationBolivar");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // Función de espera

const processQuotationBolivar = async (info, opcionAuto) => {
  const uso = 31;
  const codigoSubProd = 251;
  const codUrs = 900600470;
  const info2Aliado = 73999;
  const info5CodPro = 73999;
  const claveAsesor = 73999;

  let placa = info.Placa;
  let ceroKm = info.ceroKm;
  let tipoIdentificacion = info.TipoIdentificacion;
  let numeroIdentificacion = info.NumeroIdentificacion;
  let nombre = info.Nombre;
  let apellido = info.Apellido;
  let genero = info.Genero;
  let fechaNacimiento = info.FechaNacimiento;
  let estadoCivil = info.EstadoCivil;
  let direccion = info.Direccion;
  let email = info.Email;
  let zonaCirculacion = info.ZonaCirculacion;
  let codigoMarca = info.CodigoMarca;
  let codigoLinea = info.CodigoLinea;
  let codigoClase = info.CodigoClase;
  let codigoFasecolda = info.CodigoFasecolda;
  let modelo = info.Modelo;
  let valorAsegurado = info.ValorAsegurado;
  let limiteRC = info.LimiteRC;
  let cobertura = info.Cobertura;
  let valorAccesorios = info.ValorAccesorios;
  let ciudadBolivar = info.CiudadBolivar;
  let tipoServicio = info.tipoServicio;
  let codigoVerificacion = info.CodigoVerificacion;
  let apellido2 = info.Apellido2;
  let anioSiniestro = info.AniosSiniestro;
  let aniosAsegurados = info.AniosAsegurados;
  let nivelEducativo = info.NivelEducativo;
  let estrato = info.Estrato;
  let intermediario = info.intermediario;
  let cotizacion = info.cotizacion;
  let razonSocial = info.razonSocial;

  const numeroTelefono = 3152603149;
  email = "tecnologia@grupoasistencia.com";

  const token = await getTokenBolivar();
  const { access_token } = token;

  if (tipoIdentificacion == 1) {
    tipoIdentificacion = "CC";
  } else if (tipoIdentificacion == 2) {
    tipoIdentificacion = "NT";
    const nameParts = razonSocial.split(" ", 2);
    nombre = nameParts[0];
    apellido = nameParts[1];
    genero = "M";
    uso = 40;
  } else if (tipoIdentificacion == 4) {
    tipoIdentificacion = "TI";
  } else if (tipoIdentificacion == 3) {
    tipoIdentificacion = "CE";
  }

  if (genero == 1) {
    genero = "M";
  } else if (genero == 2) {
    genero = "F";
  }

  const data = {
    placa: placa,
    ceroKm: ceroKm,
    tipoIdentificacion: tipoIdentificacion,
    numeroIdentificacion: +numeroIdentificacion,
    nombre: nombre,
    apellido: apellido,
    genero: genero,
    fechaNacimiento: fechaNacimiento,
    estadoCivil: estadoCivil,
    direccion: direccion,
    email: email,
    zonaCirculacion: zonaCirculacion,
    codigoMarca: codigoMarca,
    codigoLinea: codigoLinea,
    codigoClase: codigoClase,
    codigoFasecolda: codigoFasecolda,
    modelo: +modelo,
    valorAsegurado: valorAsegurado,
    limiteRC: limiteRC,
    cobertura: cobertura,
    valorAccesorios: +valorAccesorios,
    ciudadBolivar: +ciudadBolivar,
    tipoServicio: tipoServicio,
    codigoVerificacion: codigoVerificacion,
    apellido2: apellido2,
    aniosSiniestro: anioSiniestro,
    aniosAsegurados: aniosAsegurados,
    nivelEducativo: nivelEducativo,
    estrato: estrato,
    intermediario: intermediario,
    cotizacion: cotizacion,
    razonSocial: razonSocial,
    uso: uso,
    codigoSubProd: codigoSubProd,
    codUrs: codUrs,
    info2Aliado: info2Aliado,
    info5CodPro: info5CodPro,
    claveAsesor: claveAsesor,
    numeroTelefono: numeroTelefono,
  };
  // Variable que almacena las liquidaciones
  // let liquidacion = 0;

  // Respuesta de la solicitud de recuperacion de preliquidacion donde solo se toma el CUT
  const preSettleResponse = await preSettleBolivar(data, access_token);

  // Esperar 25 segundos
  await delay(20000);
  const CUT = preSettleResponse?.data?.CUT;

  // Ejecutar recoverySettle con la respuesta anterior
  const plans = await recoverySettle(access_token, CUT);

  console.log("Recovery Data Processed: ", plans);

  // Variable que almacena la respuesta de la promesa del metodo settleBolivar 
  const settle = await settleBolivar(CUT, access_token);
  const liquidacion = settle?.data.find((liqu) => {
    return liqu.requestData.autos[0].opcionAutos === opcionAuto;
  });
  
  let numLiqCot = liquidacion.responseData.numLiquidacion ?? 0;

  // console.log("Resultado de find:", );
  
  const quotation = await quotationBolivar(CUT, numLiqCot, access_token);
  
  return quotation;


  // return { CUT, liquidaciones, plans, settle, access_token };
};

module.exports = processQuotationBolivar;
