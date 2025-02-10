export function calcularDensidade(densidade) {
    const densidadeDaTerra = 5515; //Densidade da Terra
    let densidadeEmPorcentagem = (densidade * 1000) / densidadeDaTerra;
    return (densidadeEmPorcentagem * 100).toFixed(0);
}