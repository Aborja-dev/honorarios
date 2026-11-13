const delay = (time: number = 2000) => {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(true)
        }, time)       
    })
}

export const consulta = async (formData: any) => {
    // Desestructuración directa de las propiedades que necesitas de formData
    const { ramo, ur, fechaInicio, fechaFin, curp } = formData;

    // Objeto limpio con las propiedades mapeadas
    const values = {
        ramo,
        ur,
        fechaInicio,
        fechaFin,
        curp
    };
    await delay
    return {
        nombre: 'Abraham Ankahara',
        apellidoPaterno: 'Borja',
        apellidoMaterno: 'Organista',
        ramo: '27',
        institucion: '000',
        CURP: 'BOOA950211HDFRRB03',
        denominacion: 'apoyo administrativo en salud A2',
        fechaIngreso: '16/11/2021',
        estatus: 'normalizacion',
        estatusRegistrado: false,
        tipoContratacion: 'formalizado',

    };
}