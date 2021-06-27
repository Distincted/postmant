/*
*	versao 3.0.7319
* att 03/05/2021
  melhorado construct| add loading | add $lang $pwa $ready |	add regexp
 $bind $inc remodelado
* add $when	changed $val()
* since 20/09/2019
* trocado o template por conctruct | allow without abs |	force adicionado 
* fim do $router.close Novo $html() |mudado scriptSRC styleSRC	 reformulado $component
* add $remove_func([],'')	removido arrow functions

*/


const Base_SRC = '/components/';
const integrity_actived = false;
//const cache = false;
var isDev = false;
var $scope = {};

const faa = function(arrai={} ){
	let aux = "";
	if(Object.keys(arrai).length>0){
		for (let key in arrai) {
			aux +=" "+key +"='"+ arrai[key] +"'";
		}
	}
	return aux;
};

const $pwa = {
	go: function(src='/sw.js', scope ={scope:'/'} ){
		
		function showUpdateBar() {
			let snackbar = document.getElementById('snackbar');
			snackbar.className = 'show';
		}

		function showRefreshUI(registration) {
			var button = document.createElement('button');
			button.style.position = 'absolute';
			button.style.bottom = '24px';
			button.style.left = '24px';
			button.textContent = 'This site has updated. Please click here to see changes.';
			button.addEventListener('click', function() {
				if (!registration.waiting) {
					return;
				}
				button.disabled = true;
				registration.waiting.postMessage('skipWaiting');
			});
			showUpdateBar()
			document.body.appendChild(button);
		}

		function onNewServiceWorker(registration, callback) {
			if (registration.waiting) {
				return callback();
			}

			function listenInstalledStateChange() {
				registration.installing.addEventListener('statechange', function(event) {
					if (event.target.state === 'installed') {
						callback();
					}
				});
			};

			if (registration.installing) {
				return listenInstalledStateChange();
			}

			registration.addEventListener('updatefound', listenInstalledStateChange);
		}

		window.addEventListener('load', function() {
			var refreshing;
			navigator.serviceWorker.addEventListener('controllerchange', function(event) {
				if (refreshing) return; // prevent infinite refresh loop when you use "Update on Reload"
				refreshing = true;
				console.log('Controller loaded');
				window.location.reload();
			});

			navigator.serviceWorker.register( src ).then(function (registration) {
				if (!navigator.serviceWorker.controller) {
					return;
				}
				registration.update();

				onNewServiceWorker(registration, function() {
				showRefreshUI(registration);
				});
			});
		});

	},
	remove(){
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
			for(let registration of registrations) {
				registration.unregister()
			}
		});
		
	}
}

function $lang(arr, index, url, name_lang='lang' ){
	return new Promise(function(resolve, reject){
		if(url==null){
			url = arr[index];
		}else{
			url = url + arr[index];
		}
		$modules({name: name_lang, src: url}).then(function(r){
			resolve( $scope[name_lang].construct() );
		});
	});
}

const $delete = function(name_func){
	let au;
	try{
		if(name_func.indexOf(",")!=-1){
			var aux = name_func.split(",");
			for( let au in aux){
				let temp = aux[au].trim();
				delete window[temp];
			}
		}else{
			delete window[name_func];
		}
		return'';
	}catch(e){
		return 'error';
	}
};

function $ry(func=function(){}){
	func(); return'';
}

function $exec(func=function(){} ){
	return func();
}

function var_create(name='', value=''){
	if(name!=''){
		window[name] = value;
	}
	return'';
}

function var_get(name=''){
	if(name!=''){
		return window[name];
	}
}
function var_set(name='',value=''){
	if(name!=''){
		window[name] = value;
		return '';
	}
}
function inc(name, func){
	return '$scope.'+name+'.'+func;
}
function $inc(name, func, param){
	if( typeof $scope[name][func]=='function'){
		return $scope[name][func](param);
	}
	return $scope[name][func];
}
function $bind(comp1, name_func, thiss, args ){
	const a = $scope[comp1][name_func].bind(thiss);
	a(args);	
}

var $router = {
	go(val, hash={hash:true}){
		if(hash.hash){
			window.location.hash = val;
		}else{
			window.location.href = val;
		}
	},
	run( $func, others = null){
		if(typeof $router_config =='undefined'){
			let urll = window.location.href;
			$router_config = function( param2 ){
				let _url = window.location.href;
				if( $router.getParams( _url ).length ==0 ){
					let val = window.location.hash;
					if( val.indexOf("?")){
						val = val.split("?")[0];
					}
					$func( val, null, param2 );
				}else{
					let params =  $router.getParams( _url );
					let val = window.location.hash;
					if( val.indexOf("?")){
						val = val.split("?")[0];
					}
					$func( val, params, param2 );
				}
			};
			$router_config();
			window.addEventListener('hashchange', $router_config);
		}
	},
	getParams(url = window.location.href ){
		
		let arr = [];
		if(url.indexOf('?')!=-1){
			var ary = url.split('?')[1].split('&');
			let ax={};
			let va = ary[0].split('=');
			$for(function(v){
				let u = v.split('=');
				ax[u[0]] = u[1];
			},ary);
			return ax;
		}
		return arr;
	},
	reload( args){
		$router_config(args);
	},
	close(){
		if(typeof $router_config =='undefined'){
			return;
		}
		window.removeEventListener('hashchange',  $router_config);
		delete window['$router_config'];
	}
}

function $start_comp(locate=''){
	if(locate==''){return;}
	$(locate).html(
		$t('div', {class: 'loader',style: 'text-align: center;'})
	)
	$('.loader').show(400);
}

function $end_comp(val=null){
	if(val==null){
		$('.loader').hide(400).remove();
	}else{
		$.when(
			$(val).hide(400)
		).done(function(){
			$(val).remove()
		});
	}
}

const $remove_component = function(val){
	if( typeof val =='string'){
		$for(function(data, increment){
			if(increment==val){
				if( typeof $scope[val].onclose != 'undefined'){
					$scope[val].onclose();
				}
				$('#abs_'+val).remove();
				delete $scope[val];

			}
		}, $scope);
	}else if( typeof val == 'object'){
		$for(function(dats){
			$for(function(data, increment){
				if(increment==dats){
					if( typeof $scope[val].onclose != 'undefined'){
						$scope[val].onclose();
					}
					$('#abs_'+data.abs).remove();
					delete $scope[increment];
				}
			}, $scope);
		}, val);
	}
	return '';

}
function $remove_func(del_name=[], name_comp=''){
	$for((val, key)=>{
		if( del_name.includes(key) ){
			delete $scope[name_comp][key]
		}
	}, $scope[name_comp] );
}

function $modules( arr=[] ){ // in: [ [{},{}] ] out: 1
	return new Promise((resolve, reject)=>{
		function _aux(){
			$component( arr[count][0], arr[count][1], arr[count][2] ).then((res)=>{
				count++;
				if( count > a){
					resolve(1)
				}else{		
					_aux();
				}
			})
		}
		let a = arr.length-1;
		let count = 0;
		_aux();
	});
}

const $extend = function(param, name_func=[], target, newname=null ){
	 // select from component 'perfil' function= 'wait, responder' and parse in 'home'
	return new Promise(function(resolve, reject){
		let padrao = {
			async: true, 	promise: true
		};
		if(typeof param =='string'){
			padrao['name'] = param;
			padrao['src'] = Base_SRC+param+".js";
		}else if(typeof param=='object'){
			padrao['name'] = param.name;
			padrao['src'] = Base_SRC+param.name+".js";
			padrao = Object.assign( padrao, param);
		}
		let result;
		let pega = true;
		let tests;
		let name = padrao.name;
		try{
			$.ajax({
				url: padrao.src,
				type: 'GET',
				async: padrao.async,
				cache: (isDev?false:true), // PARA DEV
				timeout: 3000,
				dataType: 'text',
				error: function(){	
					console.log('Error in Ajax'); 
					reject(err);
					return false;
				},
				success: function(data){
					result = data;
					let tests = eval(result);
					$delete( name );

					let arr={};
					if( name_func.length>0 ){
						$for( function(val, key){
							$for( function(r){
								if(key== r ){
								//7	arr[r] = val;
									arr[r] = val.bind($scope[target]);
								}
							},name_func);
						},tests);
					
					}else{
						let nf=	['abs','onclose','after','construct','style','styleSRC','scriptSRC','handler','title'];
						$for( function(val, key){
							$for( function(r){
								if(key== r ){
									delete tests[r];		
								}
							},nf);
						},tests);
						arr = tests;
					}
				//	vv(target,'deg-dm.js ')
					if( typeof $scope[target] == 'undefined'){
						$scope[target] = arr;
					}else{
						$scope[target] = $.extend( $scope[target] , arr );
					//7	Object.assign( $scope[target], arr );
					}
					resolve(1)
				}
			});
		}catch(err){
			reject(err);
			return false;
		}		
	});
}

const $component = function(param, value='', locate='', others=null){
//	window.document.clear();
//	window.document.close();
	

	let padrao = {
			async: true,	promise: true, force: false, loading: false, construct: true
	};
	if(typeof param =='string'){
		padrao['name'] = param;
		padrao['src'] = Base_SRC+param+".js";
	}else if(typeof param=='object'){
		padrao['name'] = param.name;
		padrao['src'] = Base_SRC+param.name+".js";
		padrao = Object.assign( padrao, param);
	}
	if(padrao['loading']){
		$start_comp(padrao['loading']);
	}


	let name = padrao.name;
	if( typeof $scope[name] != 'undefined' && padrao.force == false){
		if( typeof $scope[name].construct != 'undefined' && padrao.construct === true ){
			if(padrao.async==true){
				/* 77
				$html(locate,
					$scope[name].template( value )
				);
				*/
			//	if(padrao.history==true){
				//	_save_history({padrao: padrao, value: value, locate: locate}, padrao.href );
			//	}
			//	return;
			}
			try{
			//	$end_comp();
				if(padrao['loading']){
					$end_comp(padrao['loading']);
				}
				if( padrao.promise == true){
					return new Promise((resolve, reject)=>{
						resolve(
							$scope[name].construct( value, others )
						);
					});
				}else{
					return $scope[name].construct( value, others );

				}
			}catch(err){
				throw(err);
				return '';
			}
		}
	}
	var result;
	var ok_name = null;	
	
//5	$start_comp(locate);

	function core(test, padrao,  locate='' ){
		function remove_parent(arr){
			$for(function(val, key){
				$for(function(vallue, increment){
					if(vallue.abs.indexOf('<-')!=-1){
						var varc = vallue.abs.split('<-');
						if(varc[0]==val){
							$('.abs_'+varc[0]).remove();
							if(  typeof $scope[increment].onclose != 'undefined' ){
								$scope[increment].onclose();
							}
							if(  typeof $scope[increment].handler != 'undefined' ){
								window['p_config_'+$scope[increment].handler.name].revoke();
								$delete('p_config_'+$scope[increment].handler.name);
							}
							delete $scope[increment];
						}
					}else{
						if(val==vallue.abs ){

							$('.abs_'+val).remove();
							if(  typeof $scope[increment].onclose != 'undefined' ){
								$scope[increment].onclose();
							}
							if(  typeof $scope[increment].handler != 'undefined' ){
								window['p_config_'+$scope[increment].handler.name].revoke();
								$delete('p_config_'+$scope[increment].handler.name);
							}
							delete $scope[increment];
						}
					}
				}, $scope);
			}, arr);
		}
		var test_abs;
	//	vv( test, 'testingg' );
		let parent_abs;
		if( typeof test.abs == 'undefined'){
			test.abs = name;
		}

		if(test.abs.indexOf('<-')!=-1){
			let varcc = test.abs.split('<-');
		//	vv(varc,'varc contem <-');
			test_abs = varcc[0];
			parent_abs = varcc[1];
		}else{
			test_abs = test.abs;
			parent_abs = null;
		}
		var ok = '';
		var sid;
		if( Object.keys($scope).length == 0 ){

			if(test.abs.indexOf('<-')!=-1){
				var varc = test.abs.split('<-');
				if( test_abs==varc[0]){
					ok = varc[0];
					parent_ = '';
					sid = ok;
				}else{
					ok = test_abs;
					sid = test_abs;
				}
			}else{
				ok = test.abs;
				sid = ok;
			}
		}else{

			function tradicional(val){
				var tt = [];
				var aux;
				for( let sc in $scope){
					if( $scope[sc].abs.indexOf("<-") ){
						var varc = $scope[sc].abs.split("<-");
						if(varc[0]==val){
							tt = varc[0];
						}
					}else{
						
						if( $scope[sc].abs==val){
							tt = val;
						}
					}
				}
				return tt;
			}
							
			function get_comp(val){// retorna todos os filhos passado num array
				let tt = [];
				let aux;
				aux = val;
				let abc = 0;
				let auxx;
				auxx= [];
				while( aux.length != 0){
					for( let auu in val){
						for( let sc in $scope){
							if( $scope[sc].abs.indexOf("<-")!=-1 ){
								let varc = $scope[sc].abs.split("<-");
								if(varc[1]==val[auu]){
									tt.push(varc[0]);
								}
							}
						}
						aux = auxx || 0;
					}
					val = auxx;
					auxx = [];
				}
				return tt;
			}
			let ae = [test_abs];
			let bbc = [];
			let tra = tradicional(test_abs);
		//	vv(tra,'tradicional');
			if( tra.length >0){
			//	vv(ae, 'ae');
			//	vv(parent_abs,'parent_abs')
				if(parent_abs == null){
				//	bbc = [ get_comp( ae ) ];
				//	vv(get_comp(ae), 'get_comp')
					bbc =  [tra].concat( ...get_comp( ae ) );
				}else{
					bbc = [...tra,...get_comp( ae ) ];
				}

			}else{
				if(parent_abs != null){
					bbc = [...get_comp( ae ) ];
				}
			}
		//	vv(bbc, 'bbc')
			remove_parent(bbc);
			ok = test_abs;
			sid = ok;
		}
		$('.abs_'+ok).remove(); // add 30/10/20
		/* comentado 30/10/20
		if(ok != ''){
			$('.abs_'+ok).remove();
		}else{
			$('.abs_'+ok).remove();
		}
		*/
	//	if(ok_name){
		//	$vv('existe'); result
		//	return;
		
	//7	if(!ok_name){
		/* 77
			if(  typeof test.construct !='undefined' ){
				if( typeof padrao.construct != 'undefined'){
					param = padrao.construct;
				}else{
					param = '';
				}
				test.construct(param);
			}
		*/
		
			$scope[ name ] = test;
			$scope[ name ]['name'] = test.name || name;

	//7	}
		

		if(  typeof test.handler !='undefined' ){
			let ci = test.handler;
			let name = '';
			let obj = {};
			if( typeof ci['name'] != 'undefined'){
				if( typeof ci['target'] != 'undefined'){
				//	vv('obj targer 1')
					obj = ci.target;
					delete ci.target;
				}
				name = ci['name'];
			//2	delete ci['name'];
			}
			var_create( 'p_config_'+name , Proxy.revocable( obj , ci ) );
			let tem = new Array();
			tem[padrao.nome] =  window['p_config_'+name].proxy;
			var_create( name ,  tem[padrao.nome] );

		}

		if( typeof test.scriptSRC !='undefined' ){
			const arrai = test.scriptSRC;
			$for(function(datts){

				$head(
					$script({class: 'abs_'+sid, src: datts})
				)
			}, arrai);

		}

		if( typeof test.styleSRC !='undefined' ){
			const arrai = test.styleSRC;		
			$for(function(datts){
				$head(
					$link({rel:'stylesheet', class: 'abs_'+sid, href: datts})
				)
			}, arrai);
		}

		if( typeof test.style !='undefined' ){
			$head(
				$style(
					{ class: 'abs_'+sid },
					test.style()
				)
			) 
		}
		if( typeof test.title != 'undefined'){
			document.title = test.title;
		}

		delete test.style;
		var response='';
	//7	response = test.template( value, others );
		if( typeof test.construct != 'undefined' && padrao.construct === true){ // new
			response = $scope[name].construct( value, others );
		//7	response = test.template.bind( $scope[ name ] );
		//7	response = response( value, others );
		}

		if(  typeof test.after !='undefined' ){
		//	setTimeout(()=>{
			test.after();
		//	},500);
		}

		if(  typeof test.router !='undefined' ){
			$router.close();
		}
		
		test = [];
		if(padrao.promise==true){

		}else if(padrao.async==true){
			if( typeof locate == 'string'){
			//7	$html( locate, response ); // depreciei 29/03/21
			}else if( typeof locate =='function'){ // depreciar ?
				locate(response);
			}
		}
		if(padrao['loading']){
			$end_comp(padrao['loading']);
		}
		return response; //4
	
	}

	const req = function(padrao, name, locate=null ){
		let result;
		let tests;
		try{
			$.ajax({
				url: padrao.src,
				type: 'GET',
				async: padrao.async,
				cache: (isDev?false:true), // PARA DEV
				timeout: 3000,
				dataType: 'text',
				error: function(){	
					console.log('Error Ajax'); 
					return false;
				},
				success: function(data){
					result = data;
					var reg = /[a-z\_?]{1,99}/im;
					let name_text = data.match(reg)[0];

					tests = eval(result);
					$delete( name_text );
					tests = core( tests, padrao, locate );
				}
			});
			return tests;
		}catch(err){
			return false;
		}	
		
	}

	if(padrao.promise==true){
		return new Promise(function(resolve, reject){
			let result;
			let tests;
			try{
				$.ajax({
					url: padrao.src,
					type: 'GET',
					async: padrao.async,
					cache: (isDev?false:true), // PARA DEV
					timeout: 3000,
					dataType: 'text',
					error: function(err){	
						reject(err);
						return false;
					},
					success: function(data){
						result = data;
						var reg = /[a-z\_?]{1,99}/im;
					let name_text = data.match(reg)[0];

						tests = eval(result);
					$delete( name_text );
						tests = core( tests, padrao, locate );
						resolve(tests, others);
					}
				});
			}catch(err){
				reject('Error Promise Deg_dm_3.js');
				return false;
			}	

		});
	}else{
		
		if(padrao.async==true){
			let kf = req(padrao, name, locate);
			return kf;
		}else{
			let kf = req(padrao, name, locate);
			return kf;
		}
	}
	
};

const rtn = function(val=''){
	return'';
}

const $removeFade = function(dom, r=1){
	if(r==1){
	//	$(dom).fadeOut(400).remove();
		$.when(
			$(dom).fadeOut(400)
		).done(function(){
			return $(dom).remove()
		});
	}else{
		return $(dom).remove();

	}
};

const $text = function(dom, value=''){
	$(dom).text(value);
};

const $val = function(dom, value=null){
	if(value==null){
		return $(dom).val();
	}else{
		$(dom).val(value);

	}
}

function $when( func ){ 
	return new Promise((resolve, reject)=>{
  		$.when(
			func()
		).done((r)=>{
			resolve(r);
		});
	});
}

const $rtext = function(val){
	function text_convert(str) {
		function replaceTag(tag) {
			var tagsToReplace = {
			//	'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;'
			};
			return tagsToReplace[tag] || tag;
		}
		return str.replace(/[&<>]/g, replaceTag);
	}
	return text_convert(val);
}

function _effects(dom, value=null, r=1, tip){
	if(value!=null){
		if(r==1){
			$(dom).css('display','none');
			return $(dom)[tip](value).fadeIn(400); // rtn();
		}else{
			return $(dom)[tip](value);
		}
	}else{
		return $(dom)[tip]();
	}
}

const $html = function(dom, value=null, r=1){
	return _effects(dom, value, r, 'html');
};

const $before = function(dom, value=null, r=1){
	return _effects(dom, value, r, 'before');
};

const $prepend = function(dom, value=null, r=1){
	return _effects(dom, value, r, 'prepend');
};

const $append = function(dom, value=null, r=1){
	return _effects(dom, value, r, 'append');
};

const $after = function(dom, value=null, r=1){
	return _effects(dom, value, r, 'after');
};

const $head = function( into=""){
	$('head').append(into);
};

function $ready(func, dom=document){
	$(dom).ready( func );
}

const $for = function( $val,  arrai={} ){
	var aux = '';
	for(var key in arrai){
		aux += $val( arrai[key], key, arguments );
		if( aux == 'undefined'){ aux = '';}
	}
	return aux;
};

// MUDEI 30-09-20
const $for_order = function(  func='', param1, order='asc' , ){
	let aux_temp = '';
	if(order.trim()=='asc' || order.trim() =='ASC'){
		for(let key in param1){
			aux_temp += func(  param1[key], key  )
		}
	}else if(order.trim()=='desc' || order.trim()=='DESC'){
		let temp = Object.keys(param1).sort(function(a,b){
			return b-a
		});
		for(let i = 0; i<temp.length; i++){
			aux_temp += func(  param1[temp[i]], temp[i])
		}
	}
	return aux_temp;
}

const $t = function(tag, arrai={}, into="" ){
	return "<"+tag+faa(arrai)+" >"+into+"</"+tag+">";
};

const $t1 = function(tag, arrai={}, into="", f='' ){
	return into+"<"+tag+faa(arrai)+" "+f+"/>";
};

const $t2 = function(tag, arrai={}, into="",f='' ){
	return "<"+tag+faa(arrai)+" "+f+" >"+into+"</"+tag+">";
};

const $script = function( arrai={}, into=""){
	return "<script"+faa(arrai)+" >"+into+"</script>";
};

const $link = function( arrai={}, into=""){
	return "<link"+faa(arrai)+" />";
};

const $style = function( arrai={}, into=""){
	return "<style"+faa(arrai)+" >"+into+"</style>";
};

const $container = function(  into="", arrai={}){
	return "<div class='container' "+faa(arrai)+" >"+into+"</div>";
};

const $row = function( into="",arrai={} ){
	return "<div class='row' "+faa(arrai)+" >"+into+"</div>";
};

const $col_sm_ = function( into="", colum=12){
	return "<div class='col-md-"+colum+"' >"+into+"</div>";
};

const $col_md_ = function(  into="", colum=12){
	return "<div class='col-md-"+colum+"' >"+into+"</div>";
};

const $col_lg_ = function(  into="", colum=12){
	return "<div class='col-lg-"+colum+"' >"+into+"</div>";
};

const $col_xl_ = function(  into="", colum=12){
	return "<div class='col-xl-"+colum+"' >"+into+"</div>";
};