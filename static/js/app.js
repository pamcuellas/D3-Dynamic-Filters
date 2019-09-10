/*jshint esversion: 6 */


let capitalize_Words = str => {
	return str.replace(/\w\S*/g, (word) => {
							return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
						});
};

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
										city: capitalize_Words(obj.city),
										shape: capitalize_Words(obj.shape),
										durationMinutes: obj.durationMinutes,
										comments: obj.comments
									};
					return newStruct;
				});

let filteredData = tableData;
const keysArray = ['date','country','state','city','shape'];
let currFilters = [];

d3.select("#reset-filter").on('click', () => {
	d3.select("tbody").remove();
	filteredData = tableData;
});

// Generic change event for all select elements (or combo-boxes)
d3.selectAll('select').on('change', () => {

	// Grab info of the changed combo-box.
	var currIDchanged = d3.select(d3.event.target).attr("id");	

	// Get all selected filters and store in an array of objects.
	currFilters = keysArray.reduce( (acc, key) => {
		// Get the value for current filter
		let  value = d3.select('#'+ key).node().value;

		// Just return if it already has a value (Remark: I am using the select element name at ).
		// if (!keysArray.includes( value )) acc.push( { [key]: value});
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
			return ( keyValueData === keyValueFilter );
		});
	
	});	

	console.log(filteredData);

	updComboBoxes(currIDchanged);

	updateTable();

});

let updateTable = () => { 

	// Grab the table  
	let table = d3.select("#ufo-table");

	// Remove any previous table selection  
	d3.select("tbody").remove();	

	// Create the tbody with the new data selection/filter
	table.append("tbody")
		.selectAll("tr")
			.data( filteredData )
			.enter()
			.append("tr")
		.selectAll("td")
			.data(  obj => d3.values(obj) )
			.enter()
			.append("td")
			.text( d => $('<div>').html(d).text() )
			.classed('align-middle', true);
			 
};



/* update all combo-boxes based on the current filters */ 
let updComboBoxes = ( id ) => {

	keysArray.forEach( (key, index) => {

		// Get the selected value of current combo.
		const currOptSelected = d3.select("#" + key).node().value; 

		// Update all combo-boxes but not the changed one.
		if (key != id)  {

			/* Grab data for current combo-box */
			let currKeyData = filteredData.reduce(  (acc , obj) =>  { 
				acc.push(obj[key]); 
				return acc; 
			},[" "]);

			// Remove duplicated values
			currKeyData = [...new Set(currKeyData)];
			// Sort the values
			currKeyData.sort();


			// Select current combo-box 
			let comboID = d3.select("#" + key);

			// Clear current combo-box content 
			comboID.text("");

			// Update data combo-box according to the current key/id 
			comboID
				.selectAll("option")
				.data(currKeyData)
				.enter()
				.append("option")  
					.text( d => d);
		}

		// Return the selected value if it already has one.
		if ( currOptSelected ) {
			d3.select("#" + key).property("value", currOptSelected);
		}
	});
};

// Initialize combo-boxes.
updComboBoxes ( " " );


$("select").on("click" , function() {
  
	$(this).parent(".select-box").toggleClass("open");
	
  });
  
  $(document).mouseup(function (e)
  {
	  var container = $(".select-box");
  
	  if (container.has(e.target).length === 0)
	  {
		  container.removeClass("open");
	  }
  });
  
  
  $("select").on("change" , function() {
	
	var selection = $(this).find("option:selected").text(),
		labelFor = $(this).attr("id"),
		label = $("[for='" + labelFor + "']");
	  
	label.find(".label-desc").html(selection);
	  
  });