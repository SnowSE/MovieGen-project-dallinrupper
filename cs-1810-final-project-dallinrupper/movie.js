const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'fe07250b03msh81b8cdc278ac240p1694d9jsnd3554ffecf3a',
		'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
	}
};

fetch('https://streaming-availability.p.rapidapi.com/v2/search/basic?country=us&services=netflix%2Cprime.buy%2Chulu.addon.hbo%2Cpeacock.free&output_language=en&show_type=movie&genre=18&show_original_language=en&keyword=zombie', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err)); 