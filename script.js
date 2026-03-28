const add = document.querySelector("#add");
const courseCode = document.querySelector("#course-code");
const unitLoad = document.querySelector("#unit-load");
const grade = document.querySelector("#grade");
const tbody = document.querySelector("#tbody");
const tfoot = document.querySelector("#tfoot");
const table = document.querySelector("#table");
const calcGp = document.querySelector("#calc-gp");
const clear = document.querySelector("#clear");
const errorMessage = document.querySelector("#error-message");
const modeToggle = document.querySelector("#mode-toggle");
const body = document.querySelector("body");
const wrapper = document.querySelector(".wrapper");

// Array to store course info
let gpArry = JSON.parse(localStorage.getItem("courses")) || [];

// Toggle dark and light mode
modeToggle.addEventListener("change", () => {
    if (modeToggle.checked) {
        body.classList.add("light-mode");
    } else {
        body.classList.remove("light-mode");
    }
});

// Function to add a course to the table
add.addEventListener("click", () => {
    if (courseCode.value === "" || unitLoad.value <= 0 || grade.selectedIndex === 0) {
        errorMessage.classList.remove("display-none");
    } else {
        errorMessage.classList.add("display-none");
        const tr = document.createElement("tr");
        
        const tdCourseCode = document.createElement("td");
        tdCourseCode.innerHTML = courseCode.value.toUpperCase();
        tr.appendChild(tdCourseCode);
        
        const tdUnitLoad = document.createElement("td");
        tdUnitLoad.innerHTML = unitLoad.value;
        tr.appendChild(tdUnitLoad);
        
        const tdGrade = document.createElement("td");
        tdGrade.innerHTML = grade.options[grade.selectedIndex].text;
        tr.appendChild(tdGrade);
        
        const tdDelete = document.createElement("td");
        tdDelete.innerHTML = "<button class='btn-danger'>Delete</button>";
        tdDelete.onclick = function () {
            this.parentNode.remove();
            gpArry = gpArry.filter((item) => item.courseCode !== courseCode.value);
            localStorage.setItem("courses", JSON.stringify(gpArry));
        };
        tr.appendChild(tdDelete);
        
        tbody.appendChild(tr);
        table.classList.remove("display-none");
        calcGp.classList.remove("display-none");
        clear.classList.remove("display-none");
        
        const course = {
            courseCode: courseCode.value.toUpperCase(),
            unitLoad: parseInt(unitLoad.value),
            grade: parseInt(grade.value)
        };
        gpArry.push(course);
        localStorage.setItem("courses", JSON.stringify(gpArry));
        
        courseCode.value = "";
        unitLoad.value = "";
        grade.selectedIndex = 0;
    }
});

// Function to calculate CGPA and class
calcGp.addEventListener("click", () => {
    let totalGradePoints = 0;
    let totalUnitLoad = 0;
    
    gpArry.forEach((course) => {
        totalGradePoints += course.grade * course.unitLoad;
        totalUnitLoad += course.unitLoad;
    });
    
    const cgpa = totalGradePoints / totalUnitLoad;
    let classResult = "";
    
    if (cgpa >= 4.50) {
        classResult = "First Class";
    } else if (cgpa >= 3.50) {
        classResult = "Second Class Upper";
    } else if (cgpa >= 2.50) {
        classResult = "Second Class Lower";
    } else if (cgpa >= 1.50) {
        classResult = "Third Class";
    } else if (cgpa >= 1.00) {
        classResult = "Pass";
    } else {
        classResult = "Fail";
    }
    
    tfoot.innerHTML = `<tr><td colspan="4">Your CGPA is ${cgpa.toFixed(2)} (${classResult})</td></tr>`;
});

// Clear the table and reset localStorage
clear.addEventListener("click", () => {
    tbody.innerHTML = "";
    tfoot.innerHTML = "";
    table.classList.add("display-none");
    calcGp.classList.add("display-none");
    clear.classList.add("display-none");
    gpArry = [];
    localStorage.removeItem("courses");
});

// Load courses from localStorage on page load
window.onload = () => {
    if (gpArry.length > 0) {
        gpArry.forEach((course) => {
            const tr = document.createElement("tr");

            const tdCourseCode = document.createElement("td");
            tdCourseCode.innerHTML = course.courseCode;
            tr.appendChild(tdCourseCode);

            const tdUnitLoad = document.createElement("td");
            tdUnitLoad.innerHTML = course.unitLoad;
            tr.appendChild(tdUnitLoad);

            const tdGrade = document.createElement("td");
            tdGrade.innerHTML = ["F", "E", "D", "C", "B", "A"][course.grade];
            tr.appendChild(tdGrade);

            const tdDelete = document.createElement("td");
            tdDelete.innerHTML = "<button class='btn-danger'>Delete</button>";
            tdDelete.onclick = function () {
                this.parentNode.remove();
                gpArry = gpArry.filter((item) => item.courseCode !== course.courseCode);
                localStorage.setItem("courses", JSON.stringify(gpArry));
            };
            tr.appendChild(tdDelete);

            tbody.appendChild(tr);
        });
        table.classList.remove("display-none");
        calcGp.classList.remove("display-none");
        clear.classList.remove("display-none");
    }
};
