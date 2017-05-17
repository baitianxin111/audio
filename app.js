//可以在这里做测试的
var lrc = new palyer.LRCReader();
lrc.parseLrc("res/lrc/董小姐.lrc").then(function(obj){
	console.log(obj);
});
(function(){
	function init (){
		new palyer.Player();
//		console.log(TimeTools.songTimeFromat(123));
	}
	init();
})();
