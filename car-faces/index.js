let classifier;
let img;
const modelURL = "https://teachablemachine.withgoogle.com/models/NDX5G56pT/";

function preload() {
  classifier = ml5.imageClassifier(modelURL + "model.json");
}

function setup() {
  const canvas = createCanvas(400, 400);
  canvas.parent("sketch");
  background(255);

  const fileInput = select("#file");
  fileInput.changed(handleFileInput);
}

function draw() {
  background(255);
  if (img) {
    image(img, 0, 0, width, height);
  }
}

function handleFileInput(e) {
  const file = e.target.files[0];
  if (!file || !file.type.startsWith("image/")) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    if (img) img.remove();
    img = createImg(event.target.result, "uploaded image");
    img.hide();
    classifyImage(img);
  };
  reader.readAsDataURL(file);
}

function classifyImage(image) {
  classifier.classify(image, gotResult);
}

function gotResult(results) {
  if (!results || results.length === 0) return;

  let happy = 0;
  let angry = 0;

  results.forEach(r => {
    const label = r.label.toLowerCase();
    if (label.includes("happy")) happy = r.confidence;
    if (label.includes("angry")) angry = r.confidence;
  });

  let score = 0;

  if (happy + angry > 0) {
    score = angry / (happy + angry);
  } else {
    score = results[0].label.toLowerCase().includes("angry") ? 1 : 0;
  }

  const pointer = document.getElementById("scale-pointer");
  if (pointer) {
    pointer.style.left = `calc(${score * 100}% - 1px)`;
  }
}
