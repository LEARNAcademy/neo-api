import React, { Component } from 'react'
import neoData from './sample-neo.js'
import Header from './Header'
import './App.css';


// API address probably will never change, so we don't put it in state
const API = "https://api.nasa.gov/neo/rest/v1/feed"

// API KEYS should be held somewhere secure, but for now this will work
const API_KEY = "EzDRfkQivFWxU6WFy6KHZ0vMFd1WmmvURashUVuP"

// fetchfeed function will be responsible for making the initial call to the API
function fetchFeed() {
	// get a new date
	const today = new Date()

	return fetch(API +`?start_date=${formatDate(today)}&api_key=${API_KEY}`)

	// the code below is the single line short hand for writing this:
	.then((res) => {
		console.log(res);
		return res.json()
	})
	// .then((res) => res.json())
	.then((res) => res.near_earth_objects)
}

// For cleaner code, we put the code responsible for formating the date into its own function
function formatDate(day) {
	return `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`
}

// To keep the code cleaner, we move all this formatting logic to a separate function outside the component
function formatAsteroid(asteroid) {
	return {
		id: asteroid.neo_reference_id,
		name: asteroid.name,
		date: asteroid.close_approach_data[0].close_approach_date,
		diameterMin: asteroid.estimated_diameter.feet.estimated_diameter_min.toFixed(0),
		diameterMax: asteroid.estimated_diameter.feet.estimated_diameter_max.toFixed(0),
		closestApproach: asteroid.close_approach_data[0].miss_distance.miles,
		velocity: parseFloat(asteroid.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0),
		distance: asteroid.close_approach_data[0].miss_distance.miles
	}
}

class App extends Component {
	constructor(props){
		super(props)

		this.state = {
			error: undefined,
			status: "loading",
			asteroids: []
		}
	}

	// We do everything related with the fetch statement in the componentWillMount function, so that state is populated with the result of the API call before we render the component to the page
	componentWillMount(){
		// run the fetchFeed function fetch call, and keep the result (res)
		fetchFeed()
		.then((res) => {
			// create an empty container array for the asteroids
			let asteroids = []

			// The Object.keys() method returns an array of a given object's own enumerable properties https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys

			// If you want to see this new concept in action, try this:
			// console.log(Object.keys(res));

			Object.keys(res).forEach((day) => {
				asteroids = res[day].map((asteroid) => {
					// run the formatAsteroid function on each item in the array of days and then return all the formatted asteroids
					return formatAsteroid(asteroid)
				})
			})

			// watch when this runs to see how the timeout below is affecting the UX
			console.log("finished formatting data")

			// state is updated when promises are resolved, setTimeout adds a second to the load time
			// setTimeout(() => {
			// 	this.setState({
			// 		asteroids,
			// 		status: "loaded"
			// 	})
			// }, 1000)

			this.setState({
				asteroids,
				status: "loaded"
			})

		})
		// we put the catch here inside the component, instead of in the fetchFeed function, so that we can record any errors caught into state
		.catch((err) => {
			// console.log(err);
			this.setState({
				error: err,
			})
		})
	}

	render() {
		// Get all the items we need from state
		const { asteroids, error, status } = this.state

		// display any errors
		let err;

		if(error != undefined){
			err = error
		}

		let content;

		// TODO: show a component with table view of all dangerous asteroids

		switch (status) {
			case 'loaded':
				content =  (
					<section>
						<h3>
							Number of objects dangerously close to earth today: {asteroids.length}
						</h3>
						<div>
							TABLE VIEW HERE
						</div>
					</section>
				)
				break;
			case 'loading':
				content = <p>Loading...</p>
				break;
			default:
				content = <p>Loading...</p>
		}

		return (
			<div className="App">
				< Header />
				<main>
					{err}
					{content}
				</main>
			</div>
		);
	}
}

export default App;
