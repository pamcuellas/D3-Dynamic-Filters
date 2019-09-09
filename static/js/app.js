/*jshint esversion: 6 */

// from data.js
const tableData = data;
const keysArray = ['datetime','country','state','city','shape'];

const filters = [
	{filter: "datetime"},
	{filter: "country"},
	{filter: "state"},
	{filter: "city"},
	{filter: "shape"}
];

let currFilters = [];


let filteredData = tableData;


d3.select("#reset-filter").on('click', () => {
	d3.select("tbody").remove();
	filteredData = tableData;

});



// Generic change event for all select elements (or combo-boxes)
d3.selectAll('select').on('change', () => {


	// Get all selected filters and store in an array of objects.
	currFilters = keysArray.reduce( (acc, key) => {
		// Get the value for current filter
		const value = d3.select('#'+ key).node().value;
		// Just return if it already has a value.
		if (value != "") acc.push( { [key]: value});
		return acc;
	}, []);

	console.log("Current Filters: ", currFilters);

	// Mount an updated datasource based on the current filters.
	filteredData = tableData.filter( (dataObj) => {
		
		// Check all filters selected
		return currFilters.every( (filterObj) => {
			
			// Grab the name and value of current filter.
			const keyNameFilter = Object.keys(filterObj)[0];
			const keyValueFilter = Object.values(filterObj)[0];

			// Grab the value of current Data correspondent to current filter.
			const keyValueData = dataObj[keyNameFilter];

			// returns if the current data field match the correspondent filter
			return ( keyValueData.toUpperCase() === keyValueFilter.toUpperCase() );
		});
	
	});	

	console.log(filteredData);


	// // Grab info of the changed combo-box.
	// var currIDchanged = d3.select(d3.event.target).attr("id");
	// var currValue = d3.select('#'+currIDchanged).node().value;

	// // Check if any other combo-box has already a value... 
	// const isSelectedFilter = keysArray.some( (combo) => { 
	// 	return ( (d3.select('#'+combo).node().value != "") && (currIDchanged != combo) ); 
	// });
	// // ... if not we will use the complete data source (tableData).
	// if (!isSelectedFilter) {
	// 	filteredData = tableData;
	// }

	// // Just update stuff if changed for a value different from empty ("")
	// if (currValue != "") {

	// 	/* Filter/Update data based on the last combo-box changed */ 
	// 	filteredData = filteredData.filter( obj => (currValue.toUpperCase() === obj[currIDchanged].toUpperCase()) );	
	
	// 	// Update all combo-boxes different from the current one. 
	// 	updComboBoxes( currIDchanged, currValue );
	
	// 	// Grab the table  
	// 	let table = d3.select("#ufo-table");

	// 	// Remove any previous table selection  
	// 	d3.select("tbody").remove();	
	
	// 	// Create the tbody with the new data selection/filter
	// 	table.append("tbody")
	// 		.selectAll("tr")
	// 			.data( filteredData )
	// 			.enter()
	// 			.append("tr")
	// 		.selectAll("td")
	// 			.data(  obj => d3.values(obj) )
	// 			.enter()
	// 			.append("td")
	// 			.text( d => d );
	// }

});


/* update all combo-boxes but the changed one */ 
let updComboBoxes = ( id, value ) => {

	keysArray.forEach( key => {

		// Grab the current Key value
		let currKeyValue = d3.select("#" + key).node().value;

		// Update combo-box only if it is different from changed combo-box (id) and if the current key does not already have a value.
		if ( (key != id) && (currKeyValue === "") ) {

			console.log("Updating ", key, id);

			/* Clear the current key (or combo-box) */
			// d3.select("#" + key).text("");

			/* Filter key according to the parameter id */
			let currKey = filteredData.reduce( (acc, obj) => {
				if (obj[id].toUpperCase() === value.toUpperCase() ) {
					acc.push(obj[key]);
				}
				return acc;
			},[" "]);
		
			console.log(currKey);



			// Select the combo-box 
			let comboID = d3.select("#" + key);

			// Clear the combo-box 
			comboID.text("");




			// Update combo box according to the current key/id 
			currKey = [...new Set(currKey)];
			currKey.sort();
			comboID
				.selectAll("option")  
				.data(currKey)  
				.enter()
				.append("option")  
					.text( d => d) 
				.classed("capitalize",true);

		}
	});
};






/*****************************  Populate Date ******************************/ 
let datetime = tableData.map( obj => obj.datetime);
datetime = [...new Set(datetime)];
datetime.sort();
d3.select("#datetime")
	.selectAll("option")  
	.data(datetime)  
	.enter()   
	.append("option")  
		.text( d => d);





/*****************************  Populate countries ******************************/ 
let countries = tableData.map( obj => obj.country.toUpperCase());
countries = [...new Set(countries)];
countries.sort();
d3.select("#country")
	.selectAll("option")  
	.data(countries)  
	.enter()   
	.append("option")  
		.text( d => d);

/*****************************  Populate states ******************************/ 
let states = tableData.map( obj => obj.state.toUpperCase());
states = [...new Set(states)];
states.sort();
d3.select("#state")
	.selectAll("option")  
	.data(states)  
	.enter()   
	.append("option")  
		.text( d => d);

/*****************************  Populate cities ******************************/ 
let cities = tableData.map( obj => obj.city);
cities = [...new Set(cities)];
cities.sort();
d3.select("#city")
	.selectAll("option")  
	.data(cities)  
	.enter()   
	.append("option")  
		.text( d => d);
 

/*****************************  Populate Duration Minutes ******************************/ 
let shapes = tableData.map( obj => obj.shape);
shapes = [...new Set(shapes)];
shapes.sort();
// console.log(shapes);
d3.select("#shape")
	.selectAll("option")  
	.data(shapes)  
	.enter()   
	.append("option")  
		.text( d => d);
 

