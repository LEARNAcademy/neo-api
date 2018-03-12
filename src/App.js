import React, { Component } from 'react';
import logo from './logo.svg';
import neoData from './sample-neo.js'
import './App.css';


const API = "https://api.nasa.gov/neo/rest/v1/feed"
const API_KEY = "EzDRfkQivFWxU6WFy6KHZ0vMFd1WmmvURashUVuP"

function fetchFeed() {
	const today = new Date()

	return fetch(API +`?start_date=${formatDate(today)}&api_key=${API_KEY}`)
	.then((res) => res.json())
	.then((res) => res.near_earth_objects)
}

function formatDate(day) {
	return `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`
}

function formAsteroid(asteroid) {
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

	componentWillMount(){
		fetchFeed()
		.then((res) => {
			let asteroids = []

			Object.keys(res).forEach((day) => {
				asteroids = res[day].map((asteroid) => {
					return formAsteroid(asteroid)
				})
			})

			console.log("finished formatting data")

			// state is updated when promises are resolved
			setTimeout(() => {
				this.setState({
					asteroids,
					status: "loaded"
				})
			}, 1000)
		})
		.catch((err) => {
			this.setState({
				error: err,
			})
		})
	}

	render() {
		const { asteroids, status } = this.state

		let content;

		switch (status) {
			case 'loaded':
				content =  (
					<p className="App-intro">
						Number of objects dangerously close to earth: {asteroids.length}
					</p>
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
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<main>
					{content}
				</main>
			</div>
		);
	}
}

export default App;
