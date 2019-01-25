class Ui {
    constructor() {
        this.canvas = document.querySelector("#canvas");
        this.menu = document.querySelector(".main-menu");
        this.aboutMenu = document.querySelector(".about-menu");
        this.drawingField = document.querySelector("#main");

        // Buttons
        this.menuBtn = document.querySelector("#draw");
        this.aboutBtn = document.querySelector("#about");
        this.save = document.querySelector("#saveDrawing");
        this.exit = document.querySelector("#exit");
        this.closeAbout = document.querySelector("#close-about");
        this.clear = document.querySelector("#clearCanvas");

        // Inputs
        this.capWidth = document.querySelector("#capWidth");
        this.holdingSlider = false;
        this.capTypes = document.querySelectorAll(".cap-type");
        this.lineTypes = document.querySelectorAll(".line-type");
        this.checkboxes = document.querySelectorAll(`input[type="checkbox"]`);

        this.strLineChecked = false;

    }

    // Display canvas
    displayCanvas(action) {
        if(action === "display") {
            this.drawingField.style.display = "flex";
            this.menu.style.display = "none";
        } else if (action === "hide") {
            this.menu.style.display = "block";
            this.drawingField.style.display = "none";

            // If user clicked EXIT, clear the canvas
            theCanvas.clearCanvas();
        }
    }

    // About menu
    openAndCloseMenu(action) {
        if(action === "open") {
            this.aboutMenu.style.display = "block";
        } else if (action === "close") {
            this.aboutMenu.style.display = "none";
        }
    }

    // Filter the clicked checkboxes and pass their name as a line cap and line join property
    filterBoxes(id, name) {
        let boxes = null;
        if(name === "cap-type") {
            // Convert checkboxes node list to an array
            boxes = [...this.capTypes];

            // Filter the checkboxes
            boxes.filter(box => {
                if(box.id !== id) {
                    // Uncheck all the boxes that DON'T match the ID of the clicked box.
                    box.checked = false;
                } else if(box.id === id) {
                    // If user clicks on the same box that is already checked,
                    // it CAN'T be un-checked
                    box.checked = true;

                    // Use the clicked box name as a property for the cap type
                    theCanvas.ctx.lineCap = box.name;
                }
            })
        } else if (name === "line-type") {
            // Convert checkboxes node list to an array
            boxes = [...this.lineTypes];

            // Filter the checkboxes
            boxes.filter(box => {
                if(box.id !== id) {
                    // Uncheck all the boxes that DON'T match the ID of the clicked box.
                    box.checked = false;
                } else if(box.id === id) {
                    // If user clicks on the same box that is already checked,
                    // it can not be un-checked
                    box.checked = true;

                    // Use the clicked box name as a property for the line type
                    theCanvas.ctx.lineJoin = box.name;
                }
            })
        } else {
            boxes = [...this.checkboxes];

            boxes.filter(box => {
                if(box.id === "strLine") {
                    this.strLineChecked = !this.strLineChecked;
                }
            });
        }
    }

    // Save the drawing
    saveDrawing() {
        this.save.href = this.canvas.toDataURL();
        this.save.download = "mypainting.png"; 
    }
}

// Drawing field
class Canvas {
    constructor() {
        this.lastX = 0;
        this.lastY = 0;
        this.direction = true;
        this.isDrawing = false;
        this.ctx = ui.canvas.getContext("2d");

        // Canvas property
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "miter";
        this.ctx.lineWidth = 20;

        // Drawing a straight line
        this.needFirstPoint = true;
    }

    // Draw on the canvas
    draw(e) {
        // If user is not drawing anymore, end the function
        if(!this.isDrawing) return;

        if(!ui.strLineChecked) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
    
            // Re-save the position
            this.lastX = e.offsetX;
            this.lastY = e.offsetY;
        }
    }

    drawStraightLine(x, y) {
        if(ui.strLineChecked) {
            if(this.needFirstPoint) {
                // this.ctx.lineWidth = 5;
                console.log(ui.strLineChecked);
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                this.needFirstPoint = false;
            } else {
                this.ctx.lineTo(x, y)
                this.ctx.stroke();
                this.needFirstPoint = true;
            }
        }
    }

    // Change cap width
    changeWidth(e) {
        if(ui.holdingSlider) {
            let { value } = e.target;
            this.ctx.lineWidth = value;
        }
    }

    // Clear the canvas
    clearCanvas() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

}

const ui = new Ui();
const theCanvas = new Canvas();

// About menu event listeners
ui.aboutBtn.addEventListener("click", ui.openAndCloseMenu.bind(ui, "open"));;
ui.closeAbout.addEventListener("click", ui.openAndCloseMenu.bind(ui, "close"));
document.body.addEventListener("keyup", e => {
    e = e || event;
    if (e.keyCode === 27) {
        ui.openAndCloseMenu("close");
    }
})

// Draw menu listeners
ui.menuBtn.addEventListener("click", ui.displayCanvas.bind(ui, "display"));
ui.exit.addEventListener("click", ui.displayCanvas.bind(ui, "hide"));


// Canvas (drawing) event listeners
ui.canvas.addEventListener("mousedown", e => {
    theCanvas.isDrawing = true;
    theCanvas.lastX = e.offsetX;
    theCanvas.lastY = e.offsetY;
})
ui.canvas.addEventListener("mousemove", theCanvas.draw.bind(theCanvas));
ui.canvas.addEventListener("mouseup", () => theCanvas.isDrawing = false);
ui.canvas.addEventListener("mouseout", () => theCanvas.isDrawing = false);
ui.clear.addEventListener("click", theCanvas.clearCanvas.bind(theCanvas));

ui.save.addEventListener("click", ui.saveDrawing.bind(ui));

// Input field
ui.capWidth.addEventListener("mousemove", theCanvas.changeWidth.bind(theCanvas));
ui.capWidth.addEventListener("mousedown", () => ui.holdingSlider = true)
ui.capWidth.addEventListener("mouseup", () => ui.holdingSlider = false)

// Add a click event to each checkbox and pass the clicked box id and class name to the
// filterBoxes function in the UI class.
ui.checkboxes.forEach(box => box.addEventListener("click", () => {
    const id = box.id;
    const name = box.className;
    ui.filterBoxes(id, name);
}))

let clicks = [];
ui.canvas.addEventListener("click", e => {
    let x = e.offsetX;
    let y = e.offsetY;
    theCanvas.drawStraightLine(x, y);
    console.log(x, y);
})

console.log(theCanvas.testX, theCanvas.testY);