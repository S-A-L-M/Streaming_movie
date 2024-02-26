window.onmousemove = (event) => {
    document.querySelectorAll('.move').forEach(element => {
        const data = element.getAttribute('stars')
        const x = (window.innerWidth - event.pageX * data) / 100
        const y = (window.innerHeight - event.pageY * data) / 100
        element.style.transform = `translateX(${x}px) translateY(${y}px)`
    })
}

const select = document.querySelector(".select");
const options_list = document.querySelector(".options-list");
const options = document.querySelectorAll(".option");

//show & hide options list
select.addEventListener("click", () => {
    options_list.classList.toggle("active");
    select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
});

//select option
options.forEach((option) => {
    option.addEventListener("click", () => {
        options.forEach((option) => { option.classList.remove('selected') });
        select.querySelector("span").innerHTML = option.innerHTML;
        option.classList.add("selected");
        options_list.classList.toggle("active");
        select.querySelector(".fa-angle-down").classList.toggle("fa-angle-up");
    });
});