window.palyer = window.palyer ||{};
(function(){
	//所欲音频播放的界面，逻辑，统一Player在里面种关联
	function Player (){
		var urls = ["res/songs/宋冬野 - 董小姐.mp3",
					"res/songs/味道.mp3",										
					"res/songs/丑八怪.mp3",
					"res/songs/一次就好.mp3",
					"res/songs/Need You Now.mp3",
					"res/songs/Sam Tsui,Kylee - Just Give Me a Reason.mp3"];
		
		this.audioPlayer = new palyer.AudioPlayer(urls);
		//single:0,
//		random:1,
//		order:2
		this.playTypes = ["single","random","order"];
		//indexOf  查找字串中指定字符或字串首次出现的位置,返首索引值
		this.curTypeIndex = this.playTypes.indexOf(localStorage.getItem("loopType") ?localStorage.getItem("loopType"):"single") ;
		this.getUI();
		this.addListener();
	}
	Player.prototype.getUI = function(){
		//获取播放元素 
		this.playTypeControl = document.querySelector('.playerControlBox :first-child');
		var type = this.playTypes[this.curTypeIndex];
		this.playTypeControl.src = "res/img/"+type +".png";
		this.playButton = document.querySelector('.playerControlBox :nth-child(3) ');
		this.nextButton = document.querySelector('.playerControlBox :nth-child(4) ');
		this.lastButton = document.querySelector('.playerControlBox :nth-child(2)');
		//获取时长的按钮
		this.endTimeLabel = document.querySelector('.playerTimeControlBox :nth-child(3)');
//		this.audioPlayer.duration(function(time){
//			this.endTimeLabel.textContent = time;
//	}.bind(this));
	//获取时长的另一种写法
		this.audioPlayer.duration().then(function(time){
			this.endTimeLabel.textContent = time
		}.bind(this));
	//获取当前时间的按钮
		this.firstTimeLabel = document.querySelector('.playerTimeControlBox :first-child');
		//不绑定this 就是指window 的所以要绑定
			 this.audioPlayer.getCurrentTime(function(time){
			 	this.firstTimeLabel.textContent = time;
			 }.bind(this));
	
	//显示歌词的,对象
		var lrc = new palyer.LRCReader();
		this.lrcBox = document.querySelector('.lrcBox');
		 var lastLrc = "";
		 //获取歌曲时间进度条的
		this.timeRange = document.querySelector('.playerTimeControlBox :nth-child(2)');
			 		var self = this;
			 this.audioPlayer.getCurrentTime(function(time){
			 			self.timeRange.textContent = time;
			 			//滑块的比例    以秒我单位的当前时间  ：this.audioEle.currentTime
			 			//总时间this.audioEle.duration
			 			//百分比：当前时间、总时间
			 			this.timeRange.value = this.audioPlayer.audioEle.currentTime/this.audioPlayer.audioEle.duration*100;
			 		 	
			 		 	lrc.parseLrc("res/lrc/董小姐.lrc").then(function(lrcObj){
			 		 	 var lrcString  = lrcObj[parseInt(this.audioPlayer.audioEle.currentTime)];
			 		 	if (lrcString) {
			 		 		lastLrc = lrcString;
			 		 	}
			 		 	this.lrcBox.innerHTML = lastLrc;
//			 		 	this.lrcBox.innerHTML = lrcString?lrcString:lastLrc;
			 		 }.bind(this));
			 }.bind(this));
	//音量控制的滑块
		this.volumeRnage = document.querySelector('.volumeRange');
			 	var self = this;
			 	this.volumeRnage.addEventListener("change",function(event){
			 		self.audioPlayer.audioEle.volume = event.target.value/100 
			
		});
		
		
 
	};
	Player.prototype.addListener = function(){
		var self =this;
		//注意指向  this.playButton指的是点击按钮 input
		this.playButton.onclick = function(){
			//self是指的是audio元素的
 this.src = self.audioPlayer.playControl()?"res/img/play.png":"res/img/pause.png";
		};
		this.nextButton.onclick = function(){
			self.audioPlayer.next();
		}
		this.lastButton.onclick =function(){
			self.audioPlayer.last();
		}
		//播放类型切换
		this.playTypeControl.onclick = function(){
			self.curTypeIndex++;
			if (self.curTypeIndex > 2) {
				self.curTypeIndex = 0;
				
			}  
			var type =  self.playTypes[self.curTypeIndex];
			 self.audioPlayer.setPlayType(type);
			 this.src = "res/img/"+type +".png";
		}
		
		
	};
	 
	window.palyer.Player = Player;
}());
