import axios from 'axios'

let docs = document.querySelectorAll(".docs__categories__element");
console.log(docs);
for (let doc of docs) {
    doc.inactive = true;
    
    doc.querySelector('h2').addEventListener('click', function() {
        doc.querySelector('ul').style.height = (doc.inactive ? doc.querySelector('ul').scrollHeight + 'px' : 0);
        doc.querySelector('span').innerText = (doc.inactive ? '-' : '+');
        doc.inactive = !doc.inactive;
    }.bind(doc));
}
let search = document.getElementById("search");
let search_bar = document.querySelector(".docs__search__bar");

search.onfocus = () => {
    search_bar.style.boxShadow = "0 1px 6px rgb(32 33 36 / 28%)";
}
search.onblur = () => {
    search_bar.style.boxShadow = "none";
}