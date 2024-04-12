import * as THREE from '../node_modules/three/build/three.module.js';

class Visualization {
    constructor() {
        this.container = document.querySelector('.scroll-container');
        if (!this.container) {
            console.error('Container .scroll-container not found');
            return;
        }

        this.sectionColors = {
            'section-content': new THREE.Color('#696969'),
            'section-hold': new THREE.Color('#00CB08'),
            'section-dayTrading': new THREE.Color('#C91800'),
            'section-staking': new THREE.Color('#008EFF'),
            'section-arbitrage': new THREE.Color('#FFC700'),
            'section-futures': new THREE.Color('#8F00FF')
        };

        this.currentColor = new THREE.Color(0xffffff); 
        this.targetColor = new THREE.Color(0xffffff); 

        this.initScene();
        this.addGradientPlane();
        this.addNoiseLayer(); 
        this.animate();
        window.addEventListener('scroll', () => this.updateGradientColor(), false);
        window.addEventListener('load', () => this.onWindowResize(), false);
    }

    initScene() {
        this.scene = new THREE.Scene();
        const aspectRatio = window.innerWidth / window.innerHeight;
        const cameraWidth = 2;
        const cameraHeight = cameraWidth / aspectRatio;
        this.camera = new THREE.OrthographicCamera(-cameraWidth / 2, cameraWidth / 2, cameraHeight / 2, -cameraHeight / 2, 1, 1000);
        this.camera.position.z = 2;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    addGradientPlane() {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                centerPosition: { value: new THREE.Vector2(0.5, -0.2) },
                radius: { value: 1.0 },
                colorInner: { value: this.currentColor }, 
                colorOuter: { value: new THREE.Color(0x13002C) } 
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec2 centerPosition;
                uniform float radius;
                uniform vec3 colorInner;
                uniform vec3 colorOuter;
                varying vec2 vUv;

                void main() {
                    float dist = distance(vUv, centerPosition);
                    float alpha = smoothstep(0.0, radius, dist);
                    gl_FragColor = vec4(mix(colorInner, colorOuter, alpha), 1.0);
                }
            `
        });

        this.gradientMaterial = material; 

        const geometry = new THREE.PlaneGeometry(2, 2);
        const plane = new THREE.Mesh(geometry, this.gradientMaterial);
        this.scene.add(plane);

        this.gradientPlane = plane;

        this.updateGradientColor(); 
    }

    onWindowResize() {
        
        const aspectRatio = window.innerWidth / window.innerHeight;
        const cameraWidth = 2; 
        const cameraHeight = cameraWidth / aspectRatio;
        this.camera.left = -cameraWidth / 2;
        this.camera.right = cameraWidth / 2;
        this.camera.top = cameraHeight / 2;
        this.camera.bottom = -cameraHeight / 2;
        this.camera.updateProjectionMatrix();
    
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    
        
        this.updatePlaneGeometry(cameraWidth, cameraHeight); 
    }
    
    updatePlaneGeometry(width, height) {
        
        this.gradientPlane.geometry.dispose(); 
        this.gradientPlane.geometry = new THREE.PlaneGeometry(width, height); 
    
        
        this.noiseLayer.geometry.dispose();
        this.noiseLayer.geometry = new THREE.PlaneGeometry(width, height);
    }
    

    animate() {
        requestAnimationFrame(() => this.animate());
        this.lerpColor(); 
        this.renderer.render(this.scene, this.camera);
    }

    lerpColor() {
        if (!this.currentColor.equals(this.targetColor)) {
            this.currentColor.lerp(this.targetColor, 0.01); 
            this.gradientMaterial.uniforms.colorInner.value.copy(this.currentColor); 
        }
    }
    

    updateGradientColor() {
        const sections = document.querySelectorAll('.content > div');
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                this.targetColor.copy(this.sectionColors[section.className] || new THREE.Color(0x000000));
                break;
            }
        }
    }

    addNoiseLayer() {
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
    
        const fragmentShader = `
            varying vec2 vUv;
            float random(vec2 co) {
                return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }
    
            void main() {
                float noise = random(vUv * 100.0);
                gl_FragColor = vec4(vec3(noise), 0.14); 
            }
        `;
    
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true
        });
    
        const geometry = new THREE.PlaneGeometry(2, 2);
        const noiseLayer = new THREE.Mesh(geometry, material);
        this.scene.add(noiseLayer);

        this.noiseLayer = noiseLayer;
    }
    
}

document.addEventListener('DOMContentLoaded', (event) => {
    const visualization = new Visualization();
    let currentSlide = 0;
    let isScrollingAllowed = true;
    const sections = document.querySelectorAll('.section-content, .section-hold, .section-dayTrading, .section-staking, .section-arbitrage, .section-futures');
    const totalSlides = sections.length;
    const animationDuration = 2400; 

    function disableScrolling() {
        isScrollingAllowed = false;
        setTimeout(() => {
            isScrollingAllowed = true;
        }, animationDuration);
    }

    function smoothScrollTo(element, duration) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    function updateVisibilityOfSidebarAndSvg(currentSlideIndex) {
        const sideBar = document.querySelector('.side-bar');
        const svgCont = document.querySelector('.svg-cont');
        const navigation = document.querySelector('.navigation');
    
        
        const updateStyles = (visible) => {
            const visibility = visible ? 'visible' : 'hidden';
            const opacity = visible ? '1' : '0';
            const opacityNavigation = visible ? '0' : '1';
            if (sideBar) {
                sideBar.style.visibility = visibility;
                sideBar.style.opacity = opacity;
            }
            if (svgCont) {
                svgCont.style.visibility = visibility;
                svgCont.style.opacity = opacity;
            }
            if (navigation) { 
                navigation.style.opacity = opacityNavigation;
            }
        };
    
        
        if (sideBar && svgCont) {
            if (currentSlideIndex > 0) {
                
                setTimeout(() => {
                    updateStyles(true);
                }, 1000); 
            } else {
                
                updateStyles(false);
            }
        }
    }
    
    
    function updateVisibilityOfCntOptions(currentSlideIndex) {
        const cntOptionsElements = document.querySelectorAll('.cnt-options');
    
        cntOptionsElements.forEach((element, index) => {
            
            element.style.display = 'flex';
            element.style.opacity = 0;
        });
    
        
        const currentSection = sections[currentSlideIndex];
        const cntOptionsInCurrentSection = currentSection.querySelectorAll('.cnt-options');
        
        cntOptionsInCurrentSection.forEach(element => {
            
            element.style.display = 'flex';
            
            setTimeout(() => {
                element.style.opacity = 1;
            }, 2000);
        });
    }


    function scrollToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides && isScrollingAllowed) {
            
            smoothScrollTo(sections[slideIndex], animationDuration);
            currentSlide = slideIndex;
            disableScrolling();
    
            
            updateActiveBlock(slideIndex);
            
            updateVisibilityOfSidebarAndSvg(slideIndex);
            updateVisibilityOfCntOptions(slideIndex);
        }
    }
    
    function updateActiveBlock(activeIndex) {
        document.querySelectorAll('.navigate-block').forEach((block, index) => {
            
            block.classList.remove('active');
            
            
            const targetId = block.getAttribute('data-target');
            const targetSection = document.querySelector('.' + targetId);
            const targetSectionIndex = Array.from(sections).indexOf(targetSection);
            
            
            if (targetSectionIndex === activeIndex) {
                block.classList.add('active');
            }
        });
    }
    

    window.addEventListener('wheel', function(e) {
        e.preventDefault();
        if (!isScrollingAllowed) return;

        if (e.deltaY > 0) {
            if (currentSlide < totalSlides - 1) {
                scrollToSlide(currentSlide + 1);
            }
        } else {
            if (currentSlide > 0) {
                scrollToSlide(currentSlide - 1);
            }
        }
    }, { passive: false });

    
    document.querySelectorAll('.navigate-block').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetSection = document.querySelector('.' + targetId);
            const targetIndex = Array.from(sections).indexOf(targetSection);
            if (targetIndex !== -1) {
                scrollToSlide(targetIndex);
            }
        });
    });

    
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        touchEndY = e.touches[0].clientY;
        e.preventDefault(); 
    }

    function handleTouchEnd() {
        if (!isScrollingAllowed) return;

        if (touchStartY - touchEndY > 50) {
            
            if (currentSlide < totalSlides - 1) {
                scrollToSlide(currentSlide + 1);
            }
        } else if (touchEndY - touchStartY > 50) {
            
            if (currentSlide > 0) {
                scrollToSlide(currentSlide - 1);
            }
        }
    }

    window.addEventListener('touchstart', handleTouchStart, false);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, false);

    
    function findSectionIndexById(buttonId) {
        const mapping = {
            'bt-m-1': 'section-hold',
            'bt-m-2': 'section-dayTrading',
            'bt-m-3': 'section-staking',
            'bt-m-4': 'section-arbitrage',
            'bt-m-5': 'section-futures',
        };
        const targetClass = mapping[buttonId];
        return Array.from(sections).findIndex(section => section.classList.contains(targetClass));
    }

    
    const mobileMenu = document.querySelector('.menu-mobile');
    const mainMobile = document.querySelector('.main-mobile');
    const buttonLngMobile = document.querySelector('.button-lng-mobile');
    document.querySelectorAll('.button-main').forEach(button => {
        button.addEventListener('click', () => {
            const buttonId = button.id;
            const sectionIndex = findSectionIndexById(buttonId);
            if (sectionIndex !== -1) {
                scrollToSlide(sectionIndex);
            }
        });
    });
    document.querySelectorAll('.button-main-mobile').forEach(button => {
        button.addEventListener('click', () => {
            const buttonId = button.id;
            const sectionIndex = findSectionIndexById(buttonId);
            if (sectionIndex !== -1) {
                scrollToSlide(sectionIndex);
            }
            mobileMenu.classList.toggle('active'); 
            mainMobile.classList.toggle('active'); 
            buttonLngMobile.classList.toggle('active'); 
        });
    });
    
    const mainButton = document.querySelector('#bt-m');
    if (mainButton) {
        mainButton.addEventListener('click', () => {
            scrollToSlide(0); 
        });
    }
});


new Visualization();


document.addEventListener("DOMContentLoaded", function() {
    var preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
      preloader.style.display = 'none';
    });
});
  
document.addEventListener('mousedown', function(event) {
    if (event.button === 1) {
      event.preventDefault();
    }
});

    
