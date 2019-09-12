/*jshint esversion: 6 */

// Function to Capitalize all words in a string
let capitalize = str => {
	return str.replace(/\w\S*/g, (wrd) => {
							return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();
						});
};

// Function to format date to YYYY-MM-DD
let formatDate = dateStr => {
	let date = dateStr.split("/").map( num => (num.length === 1 ? '0'+ num : num ) );
	return (date[2] + '-' +  date[1] + '-' + date[0]);  
};

// Change the fields position and format.
const tableData = data.map( obj => {
					const newStruct = {
										date: formatDate(obj.datetime),
										country: obj.country.toUpperCase(),
										state: obj.state.toUpperCase(),
										city: capitalize(obj.city),
										shape: capitalize(obj.shape),
										durationMinutes: obj.durationMinutes,
										comments: obj.comments
									};
					return newStruct;
				});

// Global variables				
let filteredData = tableData;
const dataKeys = ['date','country','state','city','shape'];
let currFilters = [];

// Listener to reset filters
d3.select("#reset-filter").on('click', () => {
	d3.select("tbody").remove();
	filteredData = tableData;
});

// Generic change event for all SELECT elements (drop-down)
d3.selectAll('select').on('change', () => {

	d3.event.preventDefault();

	// Get all selected filters and store in an array of objects.
	currFilters = dataKeys.reduce( (acc, key) => {

		// Get the value for current filter (or drop-down)
		let  value = d3.select('#'+ key).node().value;
		// Return the current filter (key and value) only if it already has a value.
		if (value != "") acc.push( { [key]: value } );
		return acc;
	}, []);

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
			return ( keyValueData === keyValueFilter );
		});
	
    });	
	
	// // Grab the id of the drop-down that just has changed.
	// var valueSelected = d3.select(d3.event.target).attr("id");	
	// 	// Grab the value changed
	// 	let valueSelected = d3.select("#" + id).node().value;


	updDropDown(d3.event.target.value);

	updateTable();

});


let updateTable = () => { 

	// Remove the tbody  
	d3.select("tbody").remove();	

	// update the table only if there is at least one filter selected. 
	if (currFilters.length) { 

		// Grab the table  
		let table = d3.select("#ufo-table");

		// Sort Data by state.
		filteredData.sort( (a,b) => (a.state < b.state ? -1 : 1) );

		// Create the tbody with the new data selection/filter
		table.append("tbody")
			.selectAll("tr")
				.data( filteredData )
				.enter()
				.append("tr")
			.selectAll("td")
				.data( obj => d3.values(obj) )
				.enter()
				.append("td")
				.text( d => $('<div>').html(d).text() )
				.classed('align-middle', true);
	}
};


/* update drop-downs based on the current filters */ 
let updDropDown = ( valueSelected ) => {

	// 'key' here means the dropdown id and also the name of field/column on the objects array 
	dataKeys.forEach( (key, index) => {

		// Grab the current Key value
		let currKeyValue = d3.select("#" + key).node().value;

		// Update all dropdowns except the last one that just has changed.
		// if ((key != id) && (currKeyValue === "")) {
		// if (( valueSelected === "" )  || 
		//    ( valueSelected != "" && currKeyValue === "")) {
			
		// if (key != id) {

			// Grab data for current drop-down 
			let currKeyData = filteredData.reduce(  (acc , obj) =>  { 
				acc.push(obj[key]); 
				return acc; 
			},[" "]);

			// Remove duplicated values
			currKeyData = [...new Set(currKeyData)];

			// Sort the values
			currKeyData.sort();

			// console.log(" filteredData", filteredData);
			// console.log(key, currKeyData);

			// Select current drop-down 
			let dropdown = d3.select("#" + key);

			// Clear current drop-down content 
			dropdown.text("");

			// // Update data drop-down according to the current key/id 
			dropdown
			.selectAll("option")
			.data(currKeyData)
			.enter()
			.append("option")  
				.text( d => d);		
		// }

		// Return the selected value to dropdown if it already had one.
		// if (currFilters[index]){
		// 	d3.select("#" + key).property("value", currFilters[index][key]);
		// }

		if (currKeyValue){
			d3.select("#" + key).property("value", currKeyValue);
		}

	});
};

// Initialize drop-down.
updDropDown ( "" );

