let optionsCont = document.querySelector(".options-cont");
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");

let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
// for selection need eraser , pencil class , based on tru/false on flad display pencilToolCont , eraserToolCont
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");
let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;

optionsCont.addEventListener("click", (e) => {
    // true -> tools show, false -> hide tools
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools();
    else closeTools();
})


function openTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-bars");
    toolsCont.style.display = "flex";
}
function closeTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display = "none";

    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    // true -> show pencil tool, false -> hide pencil tool
    pencilFlag = !pencilFlag;

    if (pencilFlag) pencilToolCont.style.display = "block";
    else pencilToolCont.style.display = "none";
})

eraser.addEventListener("click", (e) => {
    // true -> show eraser tool, false -> hide eraser tool
    eraserFlag = !eraserFlag;

    if (eraserFlag) eraserToolCont.style.display = "flex";
    else eraserToolCont.style.display = "none";
})
// upload
upload.addEventListener('click', (e) => {
    // show img uploaded on sticky note instaed of text area 
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click(); // on click upload , file explorer is opened 

    input.addEventListener("change", (e) => {
        let file = input.files[0]; // input.files is an array 
        let url = URL.createObjectURL(file); // make url from file loc
        let stickyTemplateHTML = `<div class="header-cont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-cont">
        <img src="${url}"/>
    </div>
        `;
        createSticky(stickyTemplateHTML);




    })
})

// sticky note 
function createSticky(stickyTemplateHtml) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-cont");
   

    stickyCont.innerHTML = stickyTemplateHtml;
    document.body.appendChild(stickyCont);
    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function () {
        dragAndDrop(stickyCont, event);
    }
    stickyCont.ondragstart = function () {
        dragAndDrop(stickyCont, event);
    }


}
sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `<div class="header-cont">
        <div class="minimize"></div>
     <div class="remove"></div>
    </div>
    <div class="note-cont">
       <textarea spellcheck="false"></textarea>
    </div>
        `;
    createSticky(stickyTemplateHTML);


})

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note-cont");
        let display = getComputedStyle(noteCont).getPropertyValue("display"); // to check if diaplayed or hidden now , based on tat toggle 
        console.log(display);
        if (display === "none") {
            noteCont.style.display = "block";
        } else {
            noteCont.style.display = "none";
        }
    })

}
// drap and drop ( elm on which to perform , event )
function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}