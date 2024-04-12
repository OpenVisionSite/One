function animateBlinkText(span) {
    let minOpacity = 0.2;
    let maxOpacity = 1;
    let speed = Math.random() * (0.005 - 0.002) + 0.002;
    let increasing = Math.random() < 0.5;

    span.style.opacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;

    function update() {
        let currentOpacity = parseFloat(span.style.opacity);
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
        span.style.opacity = currentOpacity;
        requestAnimationFrame(update);
    }

    update();
}

document.querySelectorAll('.title span').forEach(animateBlinkText);

function animateBlinkDiv(div) {
    let minOpacity = 0.0;
    let maxOpacity = 0.4;
    let speed = Math.random() * (0.004 - 0.001) + 0.001;
    let increasing = Math.random() < 0.5;

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

document.querySelectorAll('.grid-item').forEach(animateBlinkDiv);

document.querySelector('.sound-container').addEventListener('click', function() {
    document.querySelector('.sound').classList.toggle('no-animation');
});

