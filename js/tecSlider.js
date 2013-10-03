var tecSlider = {
    pages: [],
    intervalID: null,
    currentElem: null,
    duration: 2, // fade duration between images
    interval: 3000, // milliseconds image is visible
    controlOpacity: 0.7, // opacity of control buttons
    controlFaceDuration: 0.5, // controll btn fadeout/in time
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
            console.log(e);
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
            // show controls
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
    fadeObj: function(obj,from,to,duration){
        new Effect.Opacity(obj, {from: from,to: to,duration: duration});
    },
    showControls: function(){
        this.fadeObj($('lcontrol'),0,this.controlOpacity,this.controlFaceDuration);
        this.fadeObj($('rcontrol'),0,this.controlOpacity,this.controlFaceDuration);
    },
    hideControls: function(){
        this.fadeObj($('lcontrol'),this.controlOpacity,0,this.controlFaceDuration);
        this.fadeObj($('rcontrol'),this.controlOpacity,0,this.controlFaceDuration);
    },
    preparePages: function (elems) {
        elems.each(function (elem, i) {
            var s = i > 0 ? elem.setStyle({
                opacity: '0',
                filter: 'alpha(opacity = 50)'
            }) : null;
        });
    },
    startSlide: function () {

        // get active page
        var currElem = this.getCurrentElem();

        // get previous sibling
        var prevElem = currElem.previous();

        // animate
        this.fadeObj(currElem,1,0,this.duration);
        this.fadeObj(prevElem,0,1,this.duration);

        // set current elem
        this.currentElem = prevElem;

        // move elem
        $('slide-box').insertBefore(currElem, $('slide-box').childElements()[0]);

    }
};

