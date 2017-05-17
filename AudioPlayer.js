window.palyer = window.palyer ||{};
(function(){
	//todo:音频播放的核心代码 (注意封装核心代码时候尽量减少入口 添加有必要的（接口）出口)
	//不需要把所有的接口公开
	//歌曲有多首，AudioPlayer音频播放的核心代码 （逻辑部分）
//	urls：音频url的数组  需要让播放器核心  知道要播放的内容（可以进行下一曲  随机）
	function AudioPlayer(urls) {
	 	this.urls = urls;
	 	this.init();
	 	
	}
	//初始化 音频播放器的函数
	AudioPlayer.prototype.init = function(){
		//把标签的属性找到
		//当前播放音频的下标，随机播放 下一曲是通过这个属性currentSongIndex来控制的
		this.currentSongIndex = 0;
		//创建音频播放的dom元素
		this.audioEle = document.createElement("audio");
		document.body.appendChild(this.audioEle);
		//资源文件
		this.audioEle.src = this.urls[this.currentSongIndex];
		this.audioEle.autoplay = true;	
		//0单曲循环
		//1随机播放
		//2顺序播放
		this.PlayType = {
					single:0,
					random:1,
					order:2
			
		};
		//设置初始状态为单曲循环,获取保存过的状态，
		//null undefind -->false
		this.currentPlayType =this.PlayType[localStorage.getItem("loopType") ?localStorage.getItem("loopType"):"single" ]  ;
		this.listenEnd();
	};
	
	//播放暂停的控制方法，会返回一个播放暂停的状态
	AudioPlayer.prototype.playControl = function(){
		//返回一个状态 ，play pause是这个元素本身有的
		this.audioEle.paused?this.audioEle.play():this.audioEle.pause();
		return this.audioEle.paused;
	}
	//设置播放类型   prototype里面的方法，属性都是共享的
	AudioPlayer.prototype.setPlayType = function(type){
			this.currentPlayType = this.PlayType[type];
			//保存设置循环状态到本地   
			localStorage.setItem('loopType',type);
	};
	//下一曲的2中情况：
	//1，单曲和顺序播放-》音频列表的下一曲
	//2.随机播放 -》下一曲 是随机的
	//currentSongIndex是用于获取或者设置 当前播放音乐的下标，
	//urls 是整个音乐播放列表的数组
	//获取当前音乐 this.urls[this.currentSongIndex]
	AudioPlayer.prototype.next = function(){
		if (this.currentPlayType != 1) {
			 this.currentSongIndex++;
			this.currentSongIndex=this.currentSongIndex >= this.urls.length ? 0:this.currentSongIndex;
		} else{
			this.currentSongIndex = parseInt(Math.random()*this.urls.length);			
		}
		//获得到 currentSongIndex（经过处理随机和顺序2中情况）,就可以获得到 下一曲要播放的音乐了
			//需要播放的音乐：this.urls[this.currentSongIndex]
			//重新给 播放器资源文件  this.audioEle.src = this.urls[this.currentSongIndex]
//		this.currentPlayType != 1 ? this.urls[++this.currentSongIndex]:this.urls[ this.currentSongIndex]
		this.audioEle.src = this.urls[this.currentSongIndex];
	}
	//上一曲
	AudioPlayer.prototype.last = function(){
//		alert(111);
		if (this.currentPlayType != 1) {
			this.currentSongIndex--;
		this.currentSongIndex = this.currentSongIndex<0 ? this.urls.length-1:this.currentSongIndex;
		} else{
			this.currentSongIndex = parseInt(Math.random()*this.urls.length);			
		}
		this.audioEle.src = this.urls[this.currentSongIndex];
	}
	//监听播放完的状态
	AudioPlayer.prototype.listenEnd = function(){
		this.audioEle.addEventListener("ended",function(){
			this.next();
//			alert("end");
		}.bind(this));
		//因为我没在Player.js 中写监听完的，所以要再这里获取，this.audioPlayer
		//bind(this) 过去的是this.audioPlayer
		
	}
	//获取音频总时长
//	AudioPlayer.prototype.duration = function(callBack){
//		//总时长以秒来显示的,获取媒体的基本信息，需要等加载完原数据后，才能获取到
//		this.audioEle.addEventListener("loadedmetadata",function(event){
//			//event.target值得是this.audioEle
//			callBack(TimeTools.songTimeFromat(event.target.duration));
//		});
//	};
//获取总时长的另一种写法
	AudioPlayer.prototype.duration = function(){
		var self = this;
		function config (resloe,reject){
			self.audioEle.addEventListener("loadedmetadata",function(event){
//			resloe(TimeTools.songTimeFromat(event.target.duration));
			if (event) {
				resloe(TimeTools.songTimeFromat(event.target.duration));
			} else{
				reject("获取Dom错误")
				
			}
			
   			});
		};
		return new Promise(config);
//		return promise;
//		promise.then()
	}
//获取当前时间
	AudioPlayer.prototype.getCurrentTime = function(callBack){
		this.audioEle.addEventListener("timeupdate",function(event){
			callBack(TimeTools.songTimeFromat(event.target.currentTime));
		});
	}
	window.palyer.AudioPlayer = AudioPlayer;
})();
