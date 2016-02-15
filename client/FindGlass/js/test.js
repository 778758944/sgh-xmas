/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-12-21 10:43:10
 * @version $Id$
 */
window.onbeforeunload=function(){
	$.post("/lottery/checkWinnerRegistered",{
		openID:openId
	});
	return false;
}
window.onload=function(){
	$(".btn_alert").click(function(){
		//alert("close");
		$(".alert").hide();
		$(".deal_pic").show();
		// $("#share_mask").hide();
	})
}

// setTimeout(function(){
// 	alert(openId);
// },5000);


