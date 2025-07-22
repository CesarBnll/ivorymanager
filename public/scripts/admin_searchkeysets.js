const apartments = JSON.parse(document.getElementById('apt').dataset.apt);
        
const resultBox_add = document.querySelector('[result-box-add]');
const searchInput_add = document.getElementById('search_add');
const resultBox_del = document.querySelector('[result-box-del]');
const searchInput_del = document.getElementById('search_del');
        
if (apartments.name) {
    searchInput_del.value = apartments.name;
}
                    
        searchInput_add.onkeyup = () => {
            let result = []
            let input = searchInput_add.value;
            if (input.length) {
                for (let i =0; i < apartments.length; i++) {
                    const isVisible = apartments[i].name.toLowerCase().includes(input.toLowerCase());
                    if (isVisible) result.push(apartments[i].name);
                }
            }
            display(result, resultBox_add, "add");
        };
        
        searchInput_del.onkeyup = () => {
            let result = [];
            let input = searchInput_del.value;
            if (input.length) {
                for (let i = 0; i < apartments.length; i++) {
                    const isVisible = apartments[i].name.toLowerCase().includes(input.toLowerCase());
                    if (isVisible) result.push(apartments[i].name);
                }
            }
            display(result, resultBox_del, "del");
        };
        
        function display(result, box, action) {
            let content;
            if (action == "add") {
                content = result.map((list) => {
                    return "<li onclick=selectAdd(this)>" + list + "</li>";
                });
            } else if (action == "del") {
                content = result.map((list) => {
                    return "<li onclick=selectDel(this)>" + list + "</li>";
                });
            }
            box.innerHTML = "<ul>" + content.join('') + "</ul>";
        }
        
        function selectAdd(list) {
            searchInput_add.value = list.innerHTML;
            resultBox_add.innerHTML = "";
        }
        
        function selectDel(list) {
            searchInput_del.value = list.innerHTML;
            resultBox_del.innerHTML = "";
        }