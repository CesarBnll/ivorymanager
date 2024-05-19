const apartments = JSON.parse(document.getElementById('apt').dataset.apt);
let keysets = document.getElementById('kst').dataset.kst;
if (keysets) {
    keysets = JSON.parse(keysets);
}

const resultBox = document.querySelector('[result-box]');
const searchInput = document.getElementById('search');
const dropdown = document.querySelector('[dropdown]');
const dropdown_menu = document.querySelector('[dropdown-menu]');
const dropdown_toggle = document.getElementById('dropdown-toggle');

if (apartments.name) {
    searchInput.value = apartments.name;
}

searchInput.onkeyup = () => {
    let result = []
    let input = searchInput.value;
    if (input.length) {
        for (let i =0; i < apartments.length; i++) {
            const isVisible = apartments[i].name.toLowerCase().includes(input.toLowerCase());
            if (isVisible) result.push(apartments[i].name);
        }
    }
    display(result, resultBox, "apt");
};

if (dropdown) {
    dropdown_toggle.onclick = () => {
        let result = [];
        for (let i = 0; i < keysets.length; i++) {
            result.push(keysets[i].name);
        }
        display(result, dropdown_menu, "drop");
    }
}

function display(result, box, action) {
    let content;
    if (action == "apt") {
        content = result.map((list) => {
            return "<li onclick=select(this)>" + list + "</li>";
        });
    } else {
        content = result.map((list) => {
            return "<li class='dropdown-item' onclick=selectDrop(this)>" + list + "</li>";
        });
    }
    box.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function select(list) {
    searchInput.value = list.innerHTML;
    resultBox.innerHTML = "";
}

function selectDrop(list) {
    dropdown_toggle.value = list.innerHTML;
}