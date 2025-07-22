let apartments = document.getElementById('apt').dataset.apt;
apartments = apartments.split(',');
let users = document.getElementById('usr').dataset.usr;
users = users.split(',');

const resultApt = document.querySelector('[result-box-apt]')
const searchApt = document.getElementById('search_apt');
const resultUsr = document.querySelector('[result-box-usr]')
const searchUsr = document.getElementById('search_usr');

if (searchApt && searchUsr) {
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
    searchUsr.onkeyup = () => {
        let result = []
        let input = searchUsr.value;
        if (input.length) {
            for (let i =0; i < users.length; i++) {
                const isVisible = users[i].toLowerCase().includes(input.toLowerCase());
                if (isVisible) result.push(users[i]);
            }
        }
        display(result, resultUsr, 'usr');
    };
}

function display(result, box, type) {
    let content;
    if (type == 'apt') {
        content = result.map((list) => {
            return "<li onclick=selectApt(this)>" + list + "</li>";
        });
    } else {
        content = result.map((list) => {
            return "<li onclick=selectUsr(this)>" + list + "</li>";
        });
    }
    box.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function selectApt(list) {
    searchApt.value = list.innerHTML;
    resultApt.innerHTML = "";
}

function selectUsr(list) {
    searchUsr.value = list.innerHTML;
    resultUsr.innerHTML = "";
}