import * as tf from '@tensorflow/tfjs';
/* import "./app_batch_prediction_code"
import "./target_classes" */
import TARGET_CLASSES from './target_classes';
//import {model_processArray} from './app_batch_prediction_code'
import "../css/child.css"
import "../css/w3.css"
import "../css/woza.css"

console.log("Target_class",TARGET_CLASSES)

//#############################################################

// ### 1. LOAD THE MODEL IMMEDIATELY WHEN THE PAGE LOADS

//#############################################################


// Define 2 helper functions

function simulateClick(tabID) {
	
	document.getElementById(tabID).click();
}

document.querySelector('#diagnoseBtn').addEventListener('click',()=>{
	console.log("diagnose btn clicked")
	setTimeout(simulateClick.bind(null, 'image-selector'), 200)})


function predictOnLoad() {
	
	// Simulate a click on the predict button
	setTimeout(simulateClick.bind(null,'predict-button'), 500);
}






// LOAD THE MODEL

let model;
(async function () {
	console.log("model loading runs")
	model = await tf.loadLayersModel('../model_kaggle_3/model.json');
	console.log("model done loading,",tf.model)
	/* $("#selected-image").attr("src", "../assets/default_image.jpeg"); */
	document.querySelector("#selected-image").setAttribute("src", "../assets/default_image.jpeg");
	
	// Hide the model loading spinner
	// This line of html gets hidden:
	// <div class="progress-bar">Ai is Loading...</div>
	document.querySelector('.progress-bar').style="visibility:hidden;";
	/* $('.progress-bar').hide(); */
	
	
	// Simulate a click on the predict button.
	// Make a prediction on the default front page image.
	predictOnLoad();
	
	
	
})();



	

//######################################################################

// ### 2. MAKE A PREDICTION ON THE FRONT PAGE IMAGE WHEN THE PAGE LOADS

//######################################################################



// The model images have size 96x96

// This code is triggered when the predict button is clicked i.e.
// we simulate a click on the predict button.
document.querySelector("#predict-button").addEventListener("click",async function () {
	
	let image = undefined;
	
	image = document.querySelector('#selected-image')
	
	// Pre-process the image
	let tensor = tf.browser.fromPixels(image)
	.resizeNearestNeighbor([224,224]) // change the image size here
	.toFloat()
	.div(tf.scalar(255.0))
	.expandDims();
	
	
	// Pass the tensor to the model and call predict on it.
	// Predict returns a tensor.
	// data() loads the values of the output tensor and returns
	// a promise of a typed array when the computation is complete.
	// Notice the await and async keywords are used together.
	
	// TARGET_CLASSES is defined in the target_clssses.js file.
	// There's no need to load this file because it was imported in index.html
	let predictions = await model.predict(tensor).data();
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] 
			};
				
			
		}).sort(function (a, b) {
			return b.probability - a.probability;
				
		}).slice(0, 3);
	

		// Append the file name to the prediction list
		var file_name = 'default_image.jpeg';
		document.querySelector("#prediction-list").innerHTML=(`<li class="w3-text-blue fname-font" style="list-style-type:none;">${file_name}</li>`);
		
		//$("#prediction-list").empty();
		top5.forEach(function (p) {
		
			// ist-style-type:none removes the numbers.
			// https://www.w3schools.com/html/html_lists.asp
			var a = document.createElement("li")
			a.style="list-style-type:none;";
			a.innerHTML=`${p.className}: ${p.probability.toFixed(3)}`;
		
			//document.querySelector("#prediction-list").innerHTML=(`<li style="list-style-type:none;">${p.className}: ${p.probability.toFixed(3)}</li>`);
			document.querySelector("#prediction-list").appendChild(a)
			
		});
	
	
});



//######################################################################

// ### 3. READ THE IMAGES THAT THE USER SELECTS

// Then direct the code execution to app_batch_prediction_code.js

//######################################################################




// This listens for a change. It fires when the user submits images.

document.querySelector("#image-selector").onchange=async function () {
	console.log("image-selector onchange runs");
	
	// the FileReader reads one image at a time
	var fileList = document.querySelector("#image-selector").files;
	
	//$("#prediction-list").empty();
	
	// Start predicting
	// This function is in the app_batch_prediction_code.js file.
	model_processArray(fileList);
	
};





//export {model};



async function model_makePrediction(fname) {
	
	//console.log('met_cancer');
	
	// clear the previous variable from memory.
	let image = undefined;
	
	/* image = $('#selected-image').get(0); */
	image = document.querySelector('#selected-image')
	
	// Pre-process the image
	let tensor = tf.browser.fromPixels(image)
	.resizeNearestNeighbor([224,224]) // change the image size here
	.toFloat()
	.div(tf.scalar(255.0))
	.expandDims();

	
	// Pass the tensor to the model and call predict on it.
	// Predict returns a tensor.
	// data() loads the values of the output tensor and returns
	// a promise of a typed array when the computation is complete.
	// Notice the await and async keywords are used together.
	let predictions = await model.predict(tensor).data();
	let top5 = Array.from(predictions)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: TARGET_CLASSES[i] // we are selecting the value from the obj
			};
				
			
		}).sort(function (a, b) {
			return b.probability - a.probability;
				
		}).slice(0, 3);
		
	// Append the file name to the prediction list
	document.querySelector("#prediction-list").innerHTML=(`<li class="w3-text-blue fname-font" style="list-style-type:none;">
	${fname}</li>`);
	/* $("#prediction-list").append=(`<li class="w3-text-blue fname-font" style="list-style-type:none;">
	${fname}</li>`); */
	
	//$("#prediction-list").empty();
	top5.forEach(function (p) {
	
		var a = document.createElement("li")
			a.style="list-style-type:none;";
			a.innerHTML=`${p.className}: ${p.probability.toFixed(3)}`;
		
			//document.querySelector("#prediction-list").innerHTML=(`<li style="list-style-type:none;">${p.className}: ${p.probability.toFixed(3)}</li>`);
			document.querySelector("#prediction-list").appendChild(a)
		
	});
	
	// Add a space after the prediction for each image
	document.querySelector("#prediction-list").innerHTML+=(`<br>`);
		
}




// =====================
// The following functions help to solve the problems relating to delays 
// in assigning the src attribute and the delay in model prediction.
// Without this the model will produce unstable predictions because
// it will not be predicting on the correct images.


// This tutorial explains how to use async, await and promises to manage delays.
// Tutorial: https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795
// =====================



function model_delay() {
	
	return new Promise(resolve => setTimeout(resolve, 200));
}


async function model_delayedLog(item, dataURL) {
	
	// We can await a function that returns a promise.
	// This delays the predictions from appearing.
	// Here it does not actually serve a purpose.
	// It's here to show how a delay like this can be implemented.
	await model_delay();
	
	// display the user submitted image on the page by changing the src attribute.
	// The problem is here. Too slow.
	document.querySelector("#selected-image").setAttribute("src", dataURL);
	//document.querySelector("#displayed-image").setAttribute("src", dataURL); //#########
	
	// log the item only after a delay.
	//console.log(item);
}

// This step by step tutorial explains how to use FileReader.
// Tutorial: http://tutorials.jenkov.com/html5/file-api.html

async function model_processArray(fileList) {
	
	for(var item of fileList) {
		
		
		let reader = new FileReader();
		
		// clear the previous variable from memory.
		let file = undefined;
	
		
		reader.onload = async function () {
			
			let dataURL = reader.result;
			
			await model_delayedLog(item, dataURL);
			
			
			
			var fname = file.name;
			
			// clear the previous predictions
			document.querySelector("#prediction-list").innerHTML='';
			
			// 'await' is very important here.
			await model_makePrediction(fname);
		}
		
		file = item;
		
		// Print the name of the file to the console
        //console.log("i: " + " - " + file.name);
			
		reader.readAsDataURL(file);
	}
}