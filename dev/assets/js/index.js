(function(){

    let gameView      = document.querySelector('.game-view'),
        score         = document.querySelector('.score'),
        currentPoints = document.querySelector('.current-points'),
        slider        = document.querySelector('#slider'),
        isAnimate     = false,
        gameSpeed     = undefined,
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
        TweenMax.to(document.querySelector('.start-lockup'), .5, { alpha: 0,
            onComplete: ()=>{
                gameView.classList.remove('u-hide');
                document.querySelector('.controls--score').classList.remove('u-hide');
                document.querySelector('.controls').classList.remove('u-hide');
                document.querySelector('.start-lockup').classList.add('u-hide')
            }
        });

        isAnimate = true;
        gameSpeed = getGameSpeed();

        // Create a new dot each second
        intervalID = setInterval(()=>{ createDot() }, 1000);
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
        //Disable events when game is paused
        gameView.classList.toggle('u-disable-events');
        //Disable dots from being created while game is paused
        intervalControl(false);

        if(isAnimate) {
            animateDots();
            intervalControl(true)
        }
    });
    // Slider
    slider.addEventListener('input', (e)=>{
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
        dot.attr({  'fill-opacity': size * .01, 'fill': '#fff' })
        dot.data('cy', cy);
        dot.data('cx', cx);

        dots.push(dot); // Create array pass to requestAnimationFrame
        dotGroup.add(dot); // Add dot to SVG group (game view)

        // Dot Click Handler
        dot.click((e)=> {

            // Set Overall Score
            let points = ((e.target.r.animVal.value) * 2)/10;
            score.innerHTML = Number(score.innerHTML) + getPoints(points);
            e.target.classList.add('is-selected');

            // Show current points for dot
            let pointClone = currentPoints.cloneNode(true);
            document.querySelector('.controls--score').prepend(pointClone)
            pointClone.classList.add('u-show-points');
            pointClone.innerHTML = '+' + getPoints(points);

            // Animation event when dot is selected
            TweenMax.to(e.target, 1, { scaleX: 1.75, scaleY:1.75, transformOrigin:"50% 50%", ease: Quad.easeOut,
                onComplete: ()=> {
                    e.target.parentNode.removeChild(e.target);
                    pointClone.parentNode.removeChild(pointClone);
                }
            });
            TweenMax.to(e.target, .5, { alpha: 0, delay: .1 });
        });

        function getPoints(points) {
            switch (points) {
                case 1:  return 10; break;
                case 2:  return 9;  break;
                case 3:  return 8;  break;
                case 4:  return 7;  break;
                case 5:  return 6;  break;
                case 6:  return 5;  break;
                case 7:  return 4;  break;
                case 8:  return 3;  break;
                case 9:  return 2;  break;
                case 10: return 1;  break;
                default:
                break;
            }
        }
    };


    /*
        Utility Functions
    */

    function getGameSpeed() {
        console.log('Game Speed : ', Math.round(slider.value))
        return gameSpeed = Math.round(slider.value/2);
    };

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    };

    function getSize() {
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
                dot.data('cy', dot.data('cy') + (gameSpeed*.8)); //Choke Game Speed * .8
                dot.attr({ cy: dot.data('cy') });
            });
            requestAnimationFrame(animateDots);
        }
    };

})();
