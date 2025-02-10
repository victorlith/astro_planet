import {buscarExoplanetaPorNome, pesquisarExoplanetaPorNome, filtrarExoplaneta} from "../services/api.js";
import {calcularDensidade} from "../utils/calculos.js";

let rowsPerPage = 10;
let currentPage = 1;
let offset_rows = 0;  
let filtroAtual = '';

/*const savedPage = parseInt(sessionStorage.getItem('offset_rows'), 10);
const saveRowPerPage = parseInt(sessionStorage.getItem('rowsPerPage'), 10);
const saveCurrentPage = parseInt(sessionStorage.getItem('currentPage'), 10);*/
const alfabeto = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const divBarFilter = document.getElementById('filter-bar');

/*if(savedPage) {
    offset_rows = parseInt(savedPage, 10);
    currentPage = saveCurrentPage;
    rowsPerPage = saveRowPerPage;
}*/

alfabeto.forEach(item => {
    const divElement = document.createElement('div');
    divElement.className = 'btn-filter-bar';

    divElement.onclick = () => {
        filtroAtual = item;
        rowsPerPage = 10;
        currentPage = 1;
        offset_rows = 0;
        carregarDadosNaTabela(offset_rows, item);
    };

    divElement.innerHTML = `<button>${item}</button>`;
    divBarFilter.appendChild(divElement);
});



document.addEventListener('DOMContentLoaded', () =>{
    document.getElementById('btn-atualizar').addEventListener('click', atualizarPagina);
    document.getElementById('reset').addEventListener('click', resetarPagina);
    document.getElementById('prev').addEventListener('click', voltarPagina);
    document.getElementById('next').addEventListener('click', avancarPagina);
    document.getElementById('btn-pesquisar').addEventListener('click', pesquisarExoplaneta);
    
});

async function carregarDadosNaTabela(page, filtro='') {
    const tabela = document.getElementById('tabela');
    //const data = await listarExoplanetas_v2(offset_rows);
    const data = await filtrarExoplaneta(offset_rows, filtro);
 
    document.getElementById('current-page').textContent =  page + ' - ' + rowsPerPage;
    
    const tableData = document.getElementById("tab-exoplanet");
    tableData.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        row.onclick = () => {
            carregarDadosExoplaneta(item.pl_name);
            /*localStorage.setItem('offset_rows', offset_rows);
            localStorage.setItem('rowsPerPage', rowsPerPage);
            localStorage.setItem('currentPage', currentPage);*/
        }; 
        row.className = 'row-table';
        row.innerHTML = `<td>${item.pl_name}</td>
        <td>${item.pl_bmasse.toFixed(2)}</td>
        <td>${item.sy_dist_ly.toFixed(2)}</td>`;
        tableData.appendChild(row); 
    });

    tableData.style.opacity = 1;
    tabela.style.opacity = 1;

    if (page >= 1) {
        document.getElementById('prev').classList.remove('disabled-btn');
        document.getElementById('reset').classList.remove('disabled-btn');
    }

    if(page <= 1) {
        document.getElementById('prev').classList.add('disabled-btn');
        document.getElementById('reset').classList.add('disabled-btn');
    }
}


function randomImg(massa) {
    let img_src = '';

    switch(true){
        case (massa >= 0 && massa <= 100):
            img_src =  './assets/images/exoplanets/exoplaneta_1.png';
            break;
        case (massa > 100 && massa <= 500):
            img_src =  './assets/images/exoplanets/exoplaneta_2.png';
            break;
        case (massa > 500 && massa <= 1000):
            img_src =  './assets/images/exoplanets/exoplaneta_3.png';
            break;
        case (massa > 1000):
            img_src =  './assets/images/exoplanets/exoplaneta_6.png';
            break;
        default:
            img_src =  './assets/images/exoplanets/exoplaneta_4.png';
            break;
    }
    
    return img_src;  
}

async function voltarPagina() {
    offset_rows -= 10;
    rowsPerPage -= 10;
    currentPage = offset_rows;
    carregarDadosNaTabela(currentPage, filtroAtual);   
}

async function avancarPagina() {
    offset_rows += 10;
    rowsPerPage += 10;
    currentPage = offset_rows;
    carregarDadosNaTabela(currentPage, filtroAtual);
}

async function resetarPagina() {
    /*localStorage.removeItem('offset_rows');
    localStorage.removeItem('currentPage');
    localStorage.removeItem('rowsPerPage');*/
    rowsPerPage = 10;
    currentPage = 1;
    offset_rows = 0;
    carregarDadosNaTabela(currentPage, filtroAtual);
}

async function atualizarPagina() {
    filtroAtual ='';
    await carregarDadosNaTabela(currentPage);
    document.getElementById('next').classList.remove('disabled-btn')

    const linhas = '---';
    document.getElementById('planet-name').textContent = 'Exoplanete';
    document.getElementById('pl-massa').textContent = linhas;
    document.getElementById('pl-raio').textContent = linhas;
    document.getElementById('pl-periodo-orbital').textContent = linhas;
    document.getElementById('pl-ano-descoberta').textContent = linhas;
    document.getElementById('star-name').textContent = 'Estrela';
    document.getElementById('star-ascensao').textContent = linhas;
    document.getElementById('star-declinacao').textContent = linhas;
    document.getElementById('star-paralax').textContent = linhas;
    document.getElementById('star-distancia').textContent = linhas;
    document.getElementById('tipo-espectral').textContent = linhas;
    document.getElementById('star-massa').textContent = linhas;
    document.getElementById('star-raio').textContent = linhas;
    document.getElementById('star-temperatura').textContent = linhas;
    document.getElementById('star-luminosidade').textContent = linhas;
    document.getElementById('star-zona-habitavel').textContent = linhas;
    document.getElementById('pl-densidade').textContent = linhas;
    document.getElementById('star-img').classList.remove('red', 'orange', 'yellow', 'light-yellow', 'white', 'cyan', 'blue');
    //document.getElementById('img-exoplanet').src = './assets/icons/icons8-geografia-100.png';
}

async function carregarDadosExoplaneta(nome) {
    const data = await buscarExoplanetaPorNome(nome);
    const simboloSol = '&#9737;';
    const simboloTerra = '&#8853;';
    const unit = '<sup>3</sup>';

    if(data) {
        document.getElementById('planet-name').textContent = data.pl_name;
        document.getElementById('pl-massa').innerHTML = data.pl_bmasse.toFixed(2) + ' x M' + simboloTerra;
        document.getElementById('pl-raio').innerHTML = data.pl_rade.toFixed(2) + ' x R' + simboloTerra;
        document.getElementById('pl-densidade').innerHTML = data.pl_dens.toFixed(1) + ' kg/m' + unit + " | " + calcularDensidade(data.pl_dens) + '% Terra';
        document.getElementById('pl-periodo-orbital').textContent = data.pl_orbper.toFixed(2) + ' dias';
        document.getElementById('pl-ano-descoberta').textContent = data.disc_year + ` (${data.discoverymethod})`;
        document.getElementById('star-name').textContent = data.hostname;
        document.getElementById('star-ascensao').textContent = data.rastr;
        document.getElementById('star-declinacao').textContent = data.decstr;
        document.getElementById('star-distancia').textContent = `${data.sy_dist_ly.toFixed(2)} anos-luz | ${data.sy_dist.toFixed(2)} pc`;
        document.getElementById('tipo-espectral').textContent = data.st_spectype;
        document.getElementById('star-massa').innerHTML = data.st_mass.toFixed(2) + ' x M' + simboloSol;
        document.getElementById('star-raio').innerHTML = data.st_rad.toFixed(2) + ' x R' + simboloSol;
        document.getElementById('star-temperatura').textContent = parseInt(data.st_teff)  + ' K';
        document.getElementById('star-luminosidade').innerHTML = data.st_lum.toFixed(4) + ' ' + `L${simboloSol}`;
        if (data.pl_sy_zona_habitavel === 0){
            document.getElementById('star-zona-habitavel').textContent = 0 + " UA | " + 0 + " UA";
        }
        else {
            document.getElementById('star-zona-habitavel').textContent = data.pl_sy_zona_habitavel[0].toFixed(4) + " UA | " + data.pl_sy_zona_habitavel[1].toFixed(4) + " UA";

        }
        
        let tipo = data.st_spectype;
        corDaEstrela(tipo);

        /*const massaExoplaneta = parseInt(data.pl_bmasse);
        document.getElementById('img-exoplanet').src = randomImg(massaExoplaneta);*/
    }
    else {
        alert(`Nenhum planeta foi encontrado com esse nome: ${nome}`);
    }
}

function corDaEstrela(tipo) {

    document.getElementById('star-img').classList.remove('red', 'orange', 'yellow', 'light-yellow', 'white', 'cyan', 'blue');

    if (tipo) {
        
        let tipoEspectral = tipo.charAt(0);

        switch(tipoEspectral){
            case "M":
                document.getElementById('star-img').classList.add('red');
                break;
            case "K":
                document.getElementById('star-img').classList.add('orange');
                break;
            case "G":
                document.getElementById('star-img').classList.add('yellow');
                break;
            case "F":
                document.getElementById('star-img').classList.add('light-yellow');
                break;
            case "A":
                document.getElementById('star-img').classList.add('white');
                break;
            case "B":
                document.getElementById('star-img').classList.add('cyan');
                break;
            case "O":
                document.getElementById('star-img').classList.add('blue');
                break;
        }
    }    
}

async function pesquisarExoplaneta() {

    const nomeExoplaneta = document.getElementById('input-name-exoplanet').value;

    if (nomeExoplaneta) {
        const data = await pesquisarExoplanetaPorNome(nomeExoplaneta);
        
        if (data) {
            const tabelaExoplanetas = document.getElementById('tab-exoplanet');
            tabelaExoplanetas.innerHTML = '';

            data.forEach(item =>{
                const row = document.createElement('tr');
                row.onclick = () => {
                    carregarDadosExoplaneta(item.pl_name);
                    /*sessionStorage.setItem('offset_rows', offset_rows);
                    sessionStorage.setItem('rowsPerPage', rowsPerPage);
                    sessionStorage.setItem('currentPage', currentPage);*/
                }; 
                row.className = 'row-table';
        
                row.innerHTML = `<td>${item.pl_name}</td>
                <td>${item.pl_bmasse.toFixed(0)}</td>
                <td>${item.sy_dist_ly.toFixed(0)}</td>`;
                tabelaExoplanetas.appendChild(row);
            });
        }
        else {
            console.log(data.msg);
            alert(data.msg);
        }
        
        document.getElementById('prev').classList.add('disabled-btn');
        document.getElementById('reset').classList.add('disabled-btn');
        document.getElementById('next').classList.add('disabled-btn')
    }
    else {
        alert("Digite o nome do exoplaneta!")
    }
}

async function main() {
    await carregarDadosNaTabela(currentPage);
}

main();