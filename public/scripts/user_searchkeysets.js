let apartments = document.getElementById('apt').dataset.apt;
apartments = apartments.split(',');

const resultApt = document.querySelector('[result-box-apt]')
const searchApt = document.getElementById('search_apt');

searchApt.onkeyup = () => {
    let result = []
    let input = searchApt.value;
    if (input.length) {
        for (let i =0; i < apartments.length; i++) {
            const isVisible = apartments[i].toLowerCase().includes(input.toLowerCase());
            if (isVisible) result.push(apartments[i]);
        }
    }
    display(result, resultApt, 'apt');
}

function display(result, box, type) {
    let content = result.map((list) => {
        return "<li onclick=selectApt(this)>" + list + "</li>";
    });
    box.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectApt(list) {
    searchApt.value = list.innerHTML;
    resultApt.innerHTML = "";
}