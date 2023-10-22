const selectFile = document.querySelector(".select-file");

const imagePlaceholder = document.querySelector(".image-placeholder");
const imageLayer = document.querySelector(".image-layer");

const imageGrid = document.querySelector(".image-grid");
var gridBoxes = document.querySelectorAll(".image-grid .grid-item");

const chooseImageBtn = document.querySelector(".choose-img-btn");
const wmField = document.querySelector("#wm-text");
const wmImage = document.querySelector("#add-image-wm");
const changePosBtn = document.querySelector(".change-pos-btn");
const saveBtn = document.querySelector(".save-img-btn");
const wmSize = document.querySelector("#img-scaling");
const wmOpacity = document.querySelector("#wm-opacity");

var waterMark = document.createElement("p");
var outputImage = document.createElement("img");

var imageName;
var imageType;

var maxValue = 0;
var currPos = 0;


const loadImage = () => {
    console.log(imagePlaceholder.offsetWidth + " " + imagePlaceholder.offsetHeight);
    imagePlaceholder.style.display = "none";
    imageLayer.style.display = "flex";
    var image = selectFile.files[0];
    if (image == null) {
        return;
    }

    imageName = image["name"];
    imageName = removeExtension(imageName);
    
    imageType = image["type"];
    console.log(imageName + " | " + imageType);

    outputImage.src = URL.createObjectURL(image);
    
    let imageSizing = calculateAspectRatioFit(58, 65, 58, 65);
    outputImage.style.maxWidth = imageSizing["width"] + "vw";
    outputImage.style.maxHeight = imageSizing["height"] + "vh";

    imageLayer.insertBefore(outputImage, imageLayer.firstChild)

    outputImage.addEventListener("load", imgLoaded);
}

const imgLoaded = () => {
    wmField.removeAttribute("disabled");
    changePosBtn.removeAttribute("disabled");
    saveBtn.removeAttribute("disabled");

    wmField.value = "";
    wmSize.value = 10;
    wmOpacity.value = 50;

    waterMark.setAttribute("class", "watermark");
    waterMark.innerHTML = "";
    gridBoxes[currPos].appendChild(waterMark);

    maxValue = Math.round((outputImage.offsetWidth * 10)/waterMark.offsetWidth);
    wmSize.setAttribute("max", maxValue);
}

function disableOptions() {
    wmField.setAttribute("disabled", "");
    wmField.value = "";
    changePosBtn.setAttribute("disabled", "");
    wmSize.value = 10;
    wmOpacity.value = 50;
    saveBtn.setAttribute("disabled", "");
}

function updateWatermark() {
    wmType = "text";
    waterMark.innerHTML = wmField.value;

    wmSize.value = 10;
    updateSize();
    maxValue = Math.round((outputImage.offsetWidth * 10)/waterMark.offsetWidth);
    wmSize.setAttribute("max", maxValue);
}

const updateSize = () => {
    waterMark.style.fontSize = wmSize.value + "px";
}
const updateOpacity = () => {
    waterMark.style.opacity = wmOpacity.value + "%";
}
const changePos = () => {
    if (currPos != 8) {
        gridBoxes[currPos].removeChild(gridBoxes[currPos].firstChild);
        gridBoxes[currPos+1].appendChild(waterMark);
        currPos++;
    }
    else{
        gridBoxes[currPos].removeChild(gridBoxes[currPos].firstChild);
        gridBoxes[0].appendChild(waterMark);
        currPos = 0;
    }
    
}

function removeExtension(imageName){
    var lastDotPosition = imageName.lastIndexOf(".");
    console.log(lastDotPosition);
    if (lastDotPosition === -1){
        return imageName;
    }
    else{
        return imageName.substr(0, lastDotPosition);
    } 
}

const saveImage = () => {
    html2canvas(document.querySelector(".image-layer")).then(canvas => {
        const link = document.createElement("a");
        link.download = imageName + "-watermarked";
        link.href = canvas.toDataURL(imageType);
        link.click();
    });
    
}

wmSize.addEventListener("input", updateSize);
wmOpacity.addEventListener("input", updateOpacity);
changePosBtn.addEventListener("click", changePos);
selectFile.addEventListener("change", loadImage);
chooseImageBtn.addEventListener("click", () => selectFile.click());
saveBtn.addEventListener("click", saveImage);


// left-top         0, 0
// middle-top       50%-(img.width/2), 0
// middle           50%-(img.width/2), 50%-(img.height/2)
// middle-bottom    50%-(img.width/2), "bottom"-0
// left-bottom      0, "bottom"-0
// left-middle      0, 50%-(img.height/2)
// right-top        0, 0
// right middle     0, 50%-(img.height/2)
// right bottom     0, "bottom"-0


// halfHeight = (imageLayer.offsetHeight/2)-(waterMark.offsetHeight/2);
// halfWidth = (imageLayer.offsetWidth/2)-(waterMark.offsetWidth/2);

// leftTop = {left: 0, top: 0};
// leftMid = {left: 0, top: halfHeight};
// leftBtm = {left: 0, top: imageLayer.offsetHeight};

// midTop = {left: halfWidth, top: 0};
// middle = {left: halfWidth, top: halfHeight};
// midBtm = {left: halfWidth, top: imageLayer.offsetHeight};

// rightTop = {left: imageLayer.offsetWidth, top: 0};
// rightMid = {left: imageLayer.offsetWidth, top: halfHeight};
// rightBtm = {left: imageLayer.offsetWidth, top: imageLayer.offsetHeight};

// posOrder = [leftTop, midTop, rightTop, rightMid, rightBtm, midBtm, leftBtm, leftMid, middle]

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    // var bigRatio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
}