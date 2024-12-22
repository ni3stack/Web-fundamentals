const countriesAPI = 'https://restcountries.com/v2/all'
const catsAPI = 'https://api.thecatapi.com/v1/breeds'

const fetchData = async (dataType) => {
  let response;
  if(dataType === 'COUNTRY') {
    response =  await fetch(countriesAPI);
  }
  if (dataType === 'CAT') {
    response =  await fetch(catsAPI);
  }
  const data = await response.json();
  console.table(data);
}

fetchData('COUNTRY');