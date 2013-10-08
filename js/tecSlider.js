var tecSlider = {
    pages: [],
    intervalID: null,
    currentElem: null,
    duration: 2, // fade duration between images
    interval: 3000, // milliseconds image is visible
    controlOpacity: 0.7, // opacity of control buttons
    controlFaceDuration: 0.5, // control btn fadeout/in time
    transitionType: 'fade', // fade | slide, default transition type between images
    transitionEffect: { // available prototype fadeout/in effects
        'sinoidal' : Effect.Transitions.sinoidal,
        'linear' : Effect.Transitions.linear,
        'reverse': Effect.Transitions.reverse,
        'wobble': Effect.Transitions.wobble,
        'flicker': Effect.Transitions.flicker,
        'pulse': Effect.Transitions.pulse,
        'spring': Effect.Transitions.spring,
        'none': Effect.Transitions.none,
        'full': Effect.Transitions.full
    },
    imageTransition: 'linear',
    controlTransition: 'linear',
    getCurrentElem: function(){

        // get active page
        var currElem = this.currentElem;

        // use first page if current is not set
        if (currElem === null) {
            currElem = this.pages[0];
        }

        return currElem;
    },
    slidePages: function (obj, options) {

        // self reference
        var sliderObj = this;

        // get pages
        this.pages = obj.childElements();
        this.pages.reverse();

        // hide pages
        this.preparePages(this.pages);

        // add controls
        this.posControls();

        // positioning controls on window resize
        Event.observe(window, "resize", function() {
            sliderObj.posControls();
        });

        // set options
        $H(options).each(function (pair) {
            if (String(pair.key) == "duration") {
                sliderObj.duration = parseInt(pair.value,10);
            } else if (String(pair.key) == "interval") {
                sliderObj.interval = parseInt(pair.value,10);
            } else if (String(pair.key) == 'imageTransition'){
                if(sliderObj.transitionEffect.hasOwnProperty(String(pair.value))){
                    sliderObj.imageTransition = String(pair.value);
                }
            } else if (String(pair.key) == 'controlTransition'){
                if(sliderObj.transitionEffect.hasOwnProperty(String(pair.value))){
                    sliderObj.controlTransition = String(pair.value);
                }
            } else {
                // throw error if option not part of object
                throw {
                    name: "Slider Options Error",
                    level: "Show Stopper",
                    message: "Property unknown",
                    htmlMessage: "Property unknown",
                    toString: function () {
                        return this.name + ": " + this.message;
                    }
                };
            }
        });

        // start slide
        this.intervalID = setInterval(
            (function (self) {
                return function () {
                    self.startSlide();
                };
            })(this),
            this.interval);

        // stop slider on event
        $$('ul#slide-box').invoke('observe', 'mouseenter', function (event) {

            // prevent mouseenter on controls
            var e = event.fromElement;

            if(e !== null && e !== undefined){
                if (e.parentNode == this.parentNode) {
                    return;
                }
            }

            // stop animation
            clearInterval(sliderObj.intervalID);

            // show controls
            sliderObj.showControls();

        });

        // start slider again on event
        $$('ul#slide-box').invoke('observe', 'mouseleave', function (event) {

            // prevent mouseleave on controls
            var e = event.toElement;
            if(e !== null && e !== undefined){
                if (e.parentNode == this.parentNode) {
                    return;
                }
            }

            // start slider
            sliderObj.intervalID = setInterval(
                (function (self) {
                    return function () {
                        self.startSlide();
                    };
                })(sliderObj),
                sliderObj.interval);

            // hide controls
            sliderObj.hideControls();

        });

    },
    posControls: function(){

        // get durrent element
        var currElem = this.getCurrentElem();

        var lcon = $('lcontrol');
        var rcon = $('rcontrol');

        // positioning controls
        var posX = currElem.getWidth() - lcon.getWidth();
        var posY = (currElem.getHeight() / 2) - (lcon.getHeight() / 2);

        // left control
        lcon.setStyle({marginTop:posY+'px'});

        // right control
        rcon.setStyle({marginTop:posY+'px',marginLeft: posX + 'px'});

    },
    fadeObj: function(obj,from,to,duration,trans){
        var tEff = this.transitionEffect[trans];
        new Effect.Opacity(obj, {from: from, to: to, duration: duration, transition: tEff});
    },
    showControls: function(){
        this.fadeObj($('lcontrol'),0,this.controlOpacity,this.controlFaceDuration,this.controlTransition);
        this.fadeObj($('rcontrol'),0,this.controlOpacity,this.controlFaceDuration,this.controlTransition);
    },
    hideControls: function(){
        this.fadeObj($('lcontrol'),this.controlOpacity,0,this.controlFaceDuration,this.controlTransition);
        this.fadeObj($('rcontrol'),this.controlOpacity,0,this.controlFaceDuration,this.controlTransition);
    },
    preparePages: function (elems) {
        elems.each(function (elem, i) {
            var s = i > 0 ? elem.setStyle({
                opacity: '0'
            }) : null;
        });
    },
    startSlide: function () {

        // get active page
        var currElem = this.getCurrentElem();

        // get previous sibling
        var prevElem = currElem.previous();

        // animate
        this.fadeObj(currElem,1,0,this.duration,this.imageTransition);
        this.fadeObj(prevElem,0,1,this.duration,this.imageTransition);

        // set current elem
        this.currentElem = prevElem;

        // move elem
        $('slide-box').insertBefore(currElem, $('slide-box').childElements()[0]);

    }
};

