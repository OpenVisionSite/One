function animateBlink(div) {
    let minOpacity = 0.0; 
    let maxOpacity = 0.2; 
    let speed = Math.random() * (0.004 - 0.001) + 0.001; 
    let increasing = Math.random() < 0.2; 

    div.style.opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;

    function update() {
        let currentOpacity = parseFloat(div.style.opacity);
        if (increasing) {
            currentOpacity += speed;
            if (currentOpacity >= maxOpacity) {
                currentOpacity = maxOpacity;
                increasing = false;
            }
        } else {
            currentOpacity -= speed;
            if (currentOpacity <= minOpacity) {
                currentOpacity = minOpacity;
                increasing = true;
            }
        }
        div.style.opacity = currentOpacity;
        requestAnimationFrame(update); 
    }

    update(); 
}
document.querySelectorAll('.grid-item').forEach(animateBlink);

document.querySelector('.title-nav').addEventListener('wheel', function(e) {
    this.scrollTop += e.deltaY;
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
  
document.addEventListener('DOMContentLoaded', function () {
    var dropdownButton = document.querySelector('.lng-nav');
    dropdownButton.addEventListener('click', function() {
        
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "flex") {
            dropdownContent.style.display = "none";
        } else {
            dropdownContent.style.display = "flex";
        }
    });
    document.addEventListener('click', function(e) {
        var target = e.target;
        if (!target.matches('.lng-nav')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.display === "flex") {
                    openDropdown.style.display = "none";
                }
            }
        }
    }, true);
});