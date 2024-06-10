export const convertTimestampToDate = (unixTimestamp: number) => {

    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const seconds = "0" + date.getSeconds();

    // Will display time in 10:30:23 format
    const formattedTime = `${hours}:${minutes.substring(-2)}:${seconds.substring(-2)}`;
    console.warn(formattedTime);
    return date;
}


export const getShortDate = (withTime: boolean = false, character= "/") => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // El mes es 0-indexado, por lo que agregamos 1 y formateamos
    const day = String(today.getDate()).padStart(2, '0');
    let hours = today.getHours().toString();
    let minutes = today.getMinutes().toString();
    
    // Asegurarse de que los valores estén en formato de dos dígitos
    hours = Number(hours) < 10 ? '0' + hours : hours;
    minutes = Number(minutes) < 10 ? '0' + minutes : minutes;

    const time = `${hours}:${minutes}`
    // Crear la cadena en el formato "yyyy-MM-dd"
    const formattedDate = `${year}${character}${month}${character}${day}`;

    return withTime ? formattedDate.concat(" " + time) : formattedDate;
}