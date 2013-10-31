define( [

	"suds/events/Interval",
	"suds/views/View",
	"mout/function/bind",
	"mout/time/now"

], function( Interval, View, bind, now ) {

	/*
		Usage: 
		new AnimatedSpriteSheetView({
			width: 100,
			height: 100,
			spriteSheetUrl: "images/my-sprite.png",
			maxLoops: 10, //optional - defaults to Infinite
			$el: $(".mySprite"), //optional - if omitted, it'll create a new div
			className: "myClass", //optional
			autoPlay: true|false, //optional
			numFrames: 25 //optional - will loop between these frames only
			fps: 35 //optional - will default to 25
		})
	*/

	var AnimatedSpriteSheetView = View.extend({
		//user options
		height: null,
		width: null,
		spriteSheetUrl: null,
		maxLoops: -1,
		className: null,
		fps: null,	//defaults to 25
		autoPlay: true,

		//private vars
		cols: 0,
		rows: 0,
		downloadSuccess: false,
		currentFrame: null,
		onFrameClosure: null,
		numFrames: null,
		currFrameNum: 1,
		currLoopNum: 0,
		timeout: 0,
		lastUpdateTime: 0,
		isPlaying: false,
		
		initialize: function(params) {

			var $el = params.$el;

			this.height = params.height;
			this.width = params.width;
			this.spriteSheetUrl = params.spriteSheetUrl;
			this.className = params.className;

			if(typeof params.maxLoops != "undefined") {
				this.maxLoops = params.maxLoops;
			}

			if(params.fps) {
				this.fps = params.fps;
			} else {
				this.fps = 25;
			}

			if(params.autoPlay !== null) {
				this.autoPlay = params.autoPlay;
			}

			if(params.numFrames !== null) {
				this.numFrames = params.numFrames;
			}

			if(!$el) {
				$el = $("<div>");
			}

			this.currentFrame = {
				row: 0,
				col: 0
			};

			this._super($el);
			this.onFrameClosure = bind(this.onFrame, this);
			this.interval = 1000 / (this.fps || 50);
			this.initImage();

		},

		initImage: function() {
			
			//preload the image
			var self = this;
			var img = new Image();

			img.onload = function() {
				self.cols = Math.ceil(img.width / self.width);
				self.rows = Math.ceil(img.height / self.height);
				self.initHtml(true);
			};

			img.onabort = function() {
				self.initHtml(false);
			};

			img.onerror = function() {
				self.initHtml(false);
			};

			img.src = this.spriteSheetUrl;

		},

		initHtml: function(downloadSuccess) {

			this.downloadSuccess = downloadSuccess;

			if(this.className) {
				this.element.addClass(this.className);
			}
			
			this.element.css({
				width: this.width,
				height: this.height,
				overflow: "hidden",
				backgroundImage: "url(" + this.spriteSheetUrl + ")",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "left top"
			});

			if(this.autoPlay) {
				this.start();
			}

		},

		onNextFrame: function() {

			var x,y;
			this.currentFrame.col++;
			this.currFrameNum++;

			if(this.numFrames >= 0 && this.currFrameNum >= this.numFrames) {
				this.currentFrame.col = 0;
				this.currentFrame.row = 0;
				this.currFrameNum = 1;
				this.currLoopNum++;

				if(this.currLoopNum >= this.maxLoops && (this.maxLoops >= 0)) {
					this.stop(true);
					return;
				}
			} else {
				if(this.currentFrame.col >= this.cols) {
					this.currentFrame.col = 0;
					this.currentFrame.row++;

					if(this.currentFrame.row >= this.rows) {
						this.currentFrame.row = 0;

						this.currLoopNum++;
						this.currFrameNum = 1;
						
						if(this.currLoopNum >= this.maxLoops && (this.maxLoops >= 0)) {

							this.currLoopNum = 0;
							this.stop(true);
							return;
						}

					}
				}
			}


			x = this.currentFrame.col * -this.width;
			y = this.currentFrame.row * -this.height;

			this.element.css({
				backgroundPosition: x + "px " + y + "px"
			});

		},

		onFrame: function() {

			var currTime = now();
			var delta = currTime - this.lastUpdateTime;
			
			if (delta > this.interval) {
				this.lastUpdateTime = currTime - (delta % this.interval);
				this.onNextFrame();
			}

		},

		start: function() {

			if(this.downloadSuccess) {
				//no use in looping if the image didn't download..
				if(!this.isPlaying) {
					this.isPlaying = true;
					Interval.addListener( Interval.FRAME, this.onFrameClosure );
				}
			}
			
		},

		stop: function(isComplete) {

			var self = this;
			Interval.removeListener( Interval.FRAME, this.onFrameClosure );
			this.isPlaying = false;
			if(isComplete) {
				//
			}

		}

	});
	
	return AnimatedSpriteSheetView;
});