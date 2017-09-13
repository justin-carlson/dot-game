(function(){

    let gameView      = document.querySelector('.game-view'),
        score         = document.querySelector('.score'),
        startLockup   = document.querySelector('.start-lockup'),
        currentPoints = document.querySelector('.current-points'),
        controls      = document.querySelector('.controls'),
        controlsScore = document.querySelector('.controls--score'),
        slider        = document.querySelector('#slider'),
        isAnimate     = false,
        gameSpeed     = undefined,
        intervalID    = undefined,
        /* Snap SVG Instance Variables */
        snap          = Snap('.game-view'),
        dots          = [],
        dotSize       = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        dotGroup      = snap.group();



    /*
        Events
    */
    document.querySelector('.start-btn').addEventListener('click', (e)=> {

        // Transition View
        gameView.classList.remove('u-hide');
        controls.classList.remove('u-hide');
        TweenMax.to(gameView, 1, { alpha: 1, ease: Quad.easeOut });
        TweenMax.to(controls, 1, { alpha: 1, ease: Quad.easeOut });
        TweenMax.to(startLockup, 1, { alpha: 0,
            onComplete: ()=> {
                startLockup.classList.add('u-hide');
            }
        });

        isAnimate = true;
        gameSpeed = getGameSpeed();

        intervalControl(true); // Create a new dot each second
        animateDots(); // Init Dot Animation

        // Fullscreen Android Chrome Only
        if(/Android/i.test(navigator.userAgent) && /Chrome/i.test(navigator.userAgent)) {
            document.querySelector('.container').webkitRequestFullscreen();
        }
    });

    // Play-Pause
    document.querySelector('.controls--pause-play').addEventListener('click', (e)=> {
        isAnimate = !isAnimate;
        e.currentTarget.classList.toggle('is-pause');

        if(isAnimate) {
            dots.forEach((dot)=>{ dot.node.style.pointerEvents = 'visible' })
            animateDots();
            intervalControl(true);
        } else {
            //Disable dots from being created while game is paused
            intervalControl(false);
            //Disable events when game is paused
            dots.forEach((dot)=>{ dot.node.style.pointerEvents = 'none' })
        }
    });

    // Slider
    slider.addEventListener('input', (e)=> {
        gameSpeed = getGameSpeed();
    });

    /*
        Create Dot
    */
    function createDot() {
        // Dot Properties
        let size   = getSize(),
            margin = size + 20 //add 20px of margin
            cx     = getRandom(margin, window.innerWidth - margin),
            cy     = -size; //set dot offscreen by value of height

        // Init Dot
        let dot = snap.circle(cx, cy, size);

        // Set Dot Data & Attributes
        dot.attr({ 'fill-opacity': size * .01, 'fill': '#fff', 'cursor': 'pointer', 'pointer-events': 'visible' });
        dot.data('cy', cy);
        dot.data('cx', cx);

        dots.push(dot); // Create array pass to requestAnimationFrame
        dotGroup.add(dot); // Add dot to SVG group (game view)

        // Dot Click Handler
        dot.node.addEventListener('click', (e)=> {

            // Set Overall Score
            let points = ((e.target.r.animVal.value) * 2)/10;
            score.innerHTML = Number(score.innerHTML) + getPoints(points);
            e.target.classList.add('is-selected');

            // Show current points for dot
            let pointClone = currentPoints.cloneNode(true);
            controlsScore.prepend(pointClone);
            pointClone.classList.add('u-show-points');
            pointClone.innerHTML = '+' + getPoints(points);

            // Animation event when dot is selected
            TweenMax.to(e.target, 1, { scaleX: 1.75, scaleY:1.75, transformOrigin:'50% 50%', ease: Quad.easeOut });
            TweenMax.to(e.target, .75, { alpha: 0, delay: .1, ease: Quad.easeOut,
                onComplete: ()=> {
                    e.target.parentNode.removeChild(e.target);
                    pointClone.parentNode.removeChild(pointClone);
                }
            });
        });
    };


    /*
        Utility Functions
    */
    function getPoints(points) {
        return 11 - points;
    };

    function getGameSpeed() {
        //console.log('Game Speed : ', (Math.round(slider.value)/59.99) * 60)
        return gameSpeed =  Math.round(slider.value)/59.99;
    };

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    };

    function getSize() {
        /*
            Dividing dot size by 2 creates dots that measure
            10, 20, 30, 40, 50, 60, 70, 80 & 90 pixels on a high density display
        */
        //console.log('Size : ', dotSize[Math.floor(Math.random() * dotSize.length)]/2)
        return dotSize[Math.floor(Math.random() * dotSize.length)]/2;
    };

    /*
        Animation
    */
    function intervalControl(active) {
        if(active) {
            intervalID = setInterval(()=>{ createDot() }, 1000);
        } else {
            clearInterval(intervalID);
        }
    };

    function animateDots() {
        if(isAnimate) {
            dots.forEach((dot)=> {
                dot.data('cy', dot.data('cy') + (gameSpeed));
                dot.attr({ cy: dot.data('cy') });

                // Remove Dot when outside of viewport
                if(dot.node.cy.animVal.value > ( window.innerHeight + dot.node.r.animVal.value )) {
                    dot.remove();
                }
            });
            requestAnimationFrame(animateDots);
        }
    };

})();
