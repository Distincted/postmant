/*
*	version 1.0.1
*/
const get_base_url = function(param=''){
	var getUrl = window.location;
//	var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1] + "/"+param ; // para php puro
//	var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1] + "/"+ getUrl.pathname.split('/')[2] + "/"+param ; // para codeigniter
	var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + ""+param ; // para php puro
	return base_url_be || baseUrl;
}

const sleep = function (time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

var timeout;
var debounce = function(func, wait, inmediate){
	return function(){
		var context = this, args = arguments;
		var later = function(){
			timeout=null;
			if(!inmediate) func.apply(context, args);
		};
		var callNow = inmediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later,wait);
		if(callNow) func.apply(context, args);
	}
}


function ends(thiss, lua='.loader'){
	setTimeout(()=>{
		$removeFade(lua);
		thiss.disabled = false;
	},1000);	
}

var vv = function(val,msg='',param=''){
	try{
		if(msg!=''){
			console.log(msg+" \\/ ")
		}
		console.log(val);
		return '';
	}catch(e){
		console.log("Error  "+br_n+"  "+e);
	}	
};




function deleteCookie(name) {
	if (getCookie(name)) {
		document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
}

function setCookie(name, value, days=2) {
	var expires = "";
	var date = new Date();
	date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	expires = "; expires=" + date.toUTCString();
	//	cookie = cookie+';path=/;SameSite=Lax';
	const path = ';path=/;SameSite=Lax';
	document.cookie = name + "=" + (value || "") + expires + path;
}
function getCookie(name) {
	var cookies = document.cookie;
	var prefix = name + "=";
	var begin = cookies.indexOf("; " + prefix);
	if (begin == -1) {
		begin = cookies.indexOf(prefix);
		if (begin != 0) {
			return null;
		}
	}else{
		begin += 2;
	}
	var end = cookies.indexOf(";", begin);
	if (end == -1) {
		end = cookies.length;                        
	}
	return unescape(cookies.substring(begin + prefix.length, end));
}


var toast = function(txt='',exitt='.showmsg', type=1, mode=1){
	var pp = exitt.substring(0,1);
	
	var classi;
	switch(type){
		case 0: classi = "danger";    break;
		case 1:	classi = "success";   break;
		case 2:	classi = "primary";	  break;
		case 3:	classi = "warning";	  break;
		case 4:	classi = "info";	  break;
		case 5:	classi = "secondary"; break;
		case 6:	classi = "dark";	  break;
		case 7:	classi = "light";	  break;
		default: classi = 'info';

	}
	if(txt!=''){
		/*
		var texto = '<div class="btn-block alert-'+classi+' showmsg" id="twerr_temp" >'+
						'<p><strong>'+txt+'</strong></p>'+
					'</div>';
		*/
		/*
		var texto = $t('div',{class:'showmsg btn-block alert-'+classi, id:'twerr_temp'},
			$t('p',{},
				$t('strong',{},txt)
			)
		);
		*/
		var texto = $t('div',{id:'snackbar', class: 'twerr_temp alert-'+classi},txt)

		if(mode==1){
			$(exitt).html(texto);
		}else if(mode==2){
			$(exitt).append(texto);
		}else{
			$(exitt).html(texto);
		}
		$.when( $(".twerr_temp").attr('class','twerr_temp show').fadeIn().delay(2500).fadeOut(1500).delay(200) ).done(function(){
			$('.twerr_temp').remove()//.attr('class');	

		});	
	//	$.when( $(".twerr_temp").fadeIn(777).delay(3000) ).done(function(){
		//	$('#twerr_temp').remove();	
	//	}); 

	}
	
}