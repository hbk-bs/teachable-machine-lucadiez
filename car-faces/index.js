let imageModelURL = "https://teachablemachine.withgoogle.com/models/NDX5G56pT/";

let classifier;
let img = null;
let canvas;
let angryScore = null;

function preload() {
	classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
	canvas = createCanvas(400, 400);
	canvas.parent("sketch");
	background(255);

	const fileInput = select("#file");
	if (fileInput) fileInput.changed(handleFileInput);
}

function draw() {
	background(255);
	if (img) {
		image(img, 0, 0, width, height);
	}
}

function handleFileInput(event) {
	const file = event.target.files[0];
	if (file && file.type.startsWith("image/")) {
		const reader = new FileReader();
		reader.onload = function (e) {
			if (img) img.remove(); // Altes Bild entfernen
			img = createImg(e.target.result, "uploaded image");
			img.hide(); // img bleibt im Speicher, aber wird nicht doppelt angezeigt
			classifyImage(img);
		};
		reader.readAsDataURL(file);
	}
}

function classifyImage(image) {
	classifier.classify(image, gotResult);
}

function gotResult(results) {
	console.log("Klassifizierung:", results);

	if (!results || results.length === 0) return;

	let happy = 0;
	let angry = 0;

	results.forEach(r => {
		const l = r.label.toLowerCase();
		if (l.includes("happy")) happy = r.confidence;
		if (l.includes("angry")) angry = r.confidence;
	});

	if (happy + angry > 0) {
		angryScore = angry / (happy + angry);
	} else {
		angryScore = results[0].label.toLowerCase().includes("angry") ? 1 : 0;
	}

	// Zeiger verschieben
	const pointer = document.getElementById("scale-pointer");
	if (pointer && angryScore !== null) {
		const percent = angryScore * 100;
		pointer.style.left = `calc(${percent}% - 1px)`;
	}
}
