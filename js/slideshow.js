// slideshow.js (existing slideshow functionality)
let slideIndex = 0;
showSlides();

function showSlides() {
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 2000); // Change image every 2 seconds
}

// Additional script for modal slideshow
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Get the image source and description from data attributes
        let imgSrc = this.getAttribute('data-img-src');
        let imgText = this.getAttribute('data-text');

        // Set modal content
        let modal = document.getElementById('viewModal');
        let modalImg = modal.querySelector('.popupImg');
        let modalText = modal.querySelector('p');

        modalImg.src = imgSrc;
        modalText.textContent = imgText;

        // Show modal
        modal.classList.remove('hidden');

        // Initialize slideshow for modal
        slideIndex = 0; // Reset slide index for modal slideshow
        showSlidesInModal();
    });
});

function showSlidesInModal() {
    let slides = document.querySelectorAll('#viewModal .mySlides');
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlidesInModal, 2000); // Change image every 2 seconds in modal
}

// Navigation controls for modal slideshow
document.querySelector('#viewModal .prev').addEventListener('click', function() {
    plusSlides(-1);
});

document.querySelector('#viewModal .next').addEventListener('click', function() {
    plusSlides(1);
});

function plusSlides(n) {
    showSlidesInModal(slideIndex += n);
}

