const apartments = JSON.parse(document.getElementById('apt').dataset.apt);

const resultBox = document.querySelector('[result-box]');
const searchInput = document.getElementById('search');

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
    display(result, resultBox);
};

function display(result, box, action) {
    let content = result.map((list) => {
        return "<li onclick=select(this)>" + list + "</li>";
    });
    box.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function select(list) {
    searchInput.value = list.innerHTML;
    resultBox.innerHTML = "";
}
