var modals = document.getElementsByClassName("modal");
var activeModal = 0;

// When the user clicks the button, open the modal 
function displayModal(row) {
    activeModal = row;
    modals[row].style.display = "block";
}

// When the user clicks on <span> (x), close the modal
function closeModal(row) {
    modals[row].style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modals[activeModal]) {
      modals[activeModal].style.display = "none";
    }
}
