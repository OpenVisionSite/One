document.addEventListener('DOMContentLoaded', function () {
    const hamburgerButton = document.querySelector('.button-hamburger');
    const mobileMenu = document.querySelector('.menu-mobile');
    const mainMobile = document.querySelector('.main-mobile');
    const buttonLngMobile = document.querySelector('.button-lng-mobile');

    mobileMenu.style.display = 'flex';
    mobileMenu.classList.remove('active');
    mainMobile.classList.remove('active');
    buttonLngMobile.classList.remove('active');

    hamburgerButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');

        setTimeout(function() {
            mainMobile.classList.toggle('active');
            buttonLngMobile.classList.toggle('active');
        }, 500);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var dropdownButton = document.querySelector('.button-lng');
    var dropdownButtonMobile = document.querySelector('.button-lng-mobile');
    var dropdowns = document.querySelector(".dropdown-content");
    var dropdownsMobile = document.querySelector(".dropdown-content-mobile");

    dropdownButton.addEventListener('click', function() {
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "flex") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "flex";
        }
    });
    dropdownButtonMobile.addEventListener('click', function() {
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "flex") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "flex";
        }
    });
    
    dropdownsMobile.addEventListener('click', function() {
        if (dropdownsMobile.style.display === "flex") {
            dropdownsMobile.style.display = "none";
        } else {
            dropdownsMobile.style.display = "flex";
        }
    });
    dropdowns.addEventListener('click', function() {
        if (dropdowns.style.display === "flex") {
            dropdowns.style.display = "none";
        } else {
            dropdowns.style.display = "flex";
        }
    });


    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.matches('.button-lng')) {
            var dropdowns = document.querySelector(".dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.display === "flex") {
                    openDropdown.style.display = "none";
                }
            }
        }
    }, true);
    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.matches('.button-lng-mobile')) {
            var dropdownsMobile = document.querySelector(".dropdown-content-mobile");
            for (var i = 0; i < dropdownsMobile.length; i++) {
                var openDropdown = dropdownsMobile[i];
                if (openDropdown.style.display === "flex") {
                    openDropdown.style.display = "none";
                }
            }
        }
    }, true);
});




const myAudio = document.querySelector(".audio");
const button = document.querySelector('.sound-container');

button.addEventListener('click', function() {
    if (myAudio.muted) {
        myAudio.muted = false;
    } else {
        myAudio.muted = true;
    }
});
document.addEventListener("DOMContentLoaded", function() {
    var myAudio = document.querySelector(".audio");
    
    myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play().catch(error => console.error("Ошибка воспроизведения:", error));
    });
    var audioElement = document.querySelector('.audio');

    audioElement.onloadeddata = function() {
        audioElement.play().catch(error => console.error("Ошибка воспроизведения:", error));
    };

    audioElement.onerror = function() {
        console.error("Ошибка при загрузке аудиофайла");
    };
});
document.addEventListener('DOMContentLoaded', function() {
    var audioElement = document.querySelector('.audio');
    audioElement.volume = 0.3;
});
