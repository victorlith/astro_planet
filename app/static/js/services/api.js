export async function buscarExoplanetaPorNome(nome) {
    const response = await fetch(`/exoplanet/${nome}`).then(response => response.json());
    console.log(response)
    return response;
}


export async function pesquisarExoplanetaPorNome(nome) {
    const response = await fetch(`/search/${nome}`).then(response => response.json());
    console.log(response)
    return response;
}


export function filtrarExoplaneta(offset, filtro) {
    return fetch(`/filtrarExoplaneta?offset=${offset}&filter=${filtro}`)
        .then(response => {
            console.log('Fetch response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data);
            return data;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return [];
        });
}
