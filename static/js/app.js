
/*jshint esversion: 6 */
// from data.js
const tableData = data;
let filteredData = tableData;
// YOUR CODE HERE!

// var filteredData = tableData.filter( =>   {
//     return movie.rating !== "R"; // Will remain just ratings different from "R"
// })


// Grab the filter value typed by the user 
d3.select("form")
    .on("submit", () => {
        d3.event.preventDefault();
        let input = d3.select("input");
    });

let city = d3.select("#city");
city.on("change", ( idx ) => {
    console.log(d3.event.target.value);
});

let state = d3.select("#state");
state.on("change", ( idx ) => {
    runFilter( );
});



d3.select("#filter-btn").on('click', () => {

	console.log(filteredData)
	// d3.select("tbody").remove();
});



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
 



/* generic change event for all select elements */ 
d3.selectAll('select').on('change', () => {


	var currIDchanged = d3.select(d3.event.target).attr("id");
	var currValue = d3.select('#'+currIDchanged).node().value;


	let date	= d3.select("#datetime").node().value;
	let country = d3.select("#country").node().value;
	let state 	= d3.select("#state").node().value;
	let city 	= d3.select("#city").node().value;
	let shape 	= d3.select("#shape").node().value;	

	console.log("Changed", d3.event.target.value);
	console.log("Changed", d3.event.target.tagName);
	console.log("Changed", d3.event.target);
	console.log("combo-box", currIDchanged);
	var datetime= "lala";
	console.log("datetime", datetime);

	console.log("Refers", d3.select('#'+currIDchanged).node().value);

	/* Filter data based on the last combo-box changed */ 
    filteredData = filteredData.filter( obj => {
		return ((currValue != "") && ( currValue.toUpperCase() === obj[currIDchanged].toUpperCase()) );	
	});

	updateCities( currIDchanged, currValue );

	/* Remove any previous selection */ 
	d3.select("tbody").remove();	
	
	/* Grab the table */ 
	let table = d3.select("#ufo-table");

	/* Create the tbody */
	table.append("tbody")
		.selectAll("tr")
			.data( filteredData )
			.enter()
			.append("tr")
		.selectAll("td")
			.data(  obj => d3.values(obj) )
			.enter()
			.append("td")
			.text( d => d );
});



/* update cities list */ 
let updateCities = ( id, value ) => {
	/* Clear combo-box city */
	d3.select("#city").text("");

	/* Filter cities according to last other filter changed */
	let cities = filteredData.reduce( (acc, obj) => {
		if (obj[id].toUpperCase() === value ) {
			acc.push(obj.city);
		}
		return acc;
	},[" "]);

	cities = [...new Set(cities)];
	cities.sort();
	d3.select("#city")
		.selectAll("option")  
		.data(cities)  
		.enter()   
		.append("option")  
			.text( d => d);
};



/* Without <optional second parameter>  
var array = [1,2,3,4,5];
array.reduce( function (accumulator, nextValue) { 
    console.log( "accumulator " + accumulator + " nextValue " + nextValue); 
    return accumulator + nextValue;
});
returns: 
// With <optional second parameter> 
array.reduce( function (accumulator, nextValue) { 
    console.log( "accumulator " + accumulator + " nextValue " + nextValue); 
    return accumulator + nextValue;
}, 10);        
*/