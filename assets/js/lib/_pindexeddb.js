/*
*  Pindexeddbb.js 1.5.53
*	31/12/2020
	voltamos atrás na reformulação porque o tava errado era os valores de entrada
	reformulado a reformulação do update_db. deu trabalho e o resto foi em vão
	reformulador get_value_db
	reformulado o update_db
	att set_values_db
*	consertado set_values_db pra retornar a key inserida
*	consertado o result do get_values_db 
*
*/


/*
database = {
	name: 'agendaphp',
	version: 3,
	obj:{
		user:{
			val: {
				keyPath: ['id_user','email']
			},
			index:[
				['id_user', 'id_user',{unique: true, multiEntry: true}],
				['pass','pass',{unique: false,multiEntry: false}],
				['email','email',{unique: true, multiEntry: true}]
			]
		}
	}
}
*/
if (!window.indexedDB) {
	window.alert("Seu navegador não suporta Alguns recursos.");
}

function _get_db(name_db ){
	return new Promise((resolve, reject)=>{
		//	const database = 'redeneural';
		try{
			const nameStore = database.name;

		//	delete database.name;
		//	vv(nameStore,'nameStore');
		let db;
		//	vv(database.version,'version')
		let dbReq = indexedDB.open( nameStore , database.version, (upgradeDb)=>{
			//	console.warn('making a new object store (Banco de Dados) ');
		//	vv(database,'database');

		vv('Criando Banco');
		let db_obj = database.obj;
		let aux;
		for(let dat in db_obj ){
			aux = db_obj.obg[dat]['createIndex'];
				//	vv(aux,'aux')
				delete db_obj.obg[dat]['createIndex'];
				//	vv(dat,'dat');
				if (!upgradeDb.objectStoreNames.contains( dat )) {
					//	if( dat != 'name' && dat != 'version'){
						//	vv(database[dat], 'zzzzzzzzzzzzzz')
						upgradeDb.createObjectStore( dat , db_obj[dat] );

					//	}
				}
			}


		});


		dbReq.onupgradeneeded = (event)=>{
			upgradeDb = event.target.result;

/*
				var upgradeTransaction = event.target.transaction;
				var objectStore;
				if (!db.objectStoreNames.contains("my-store")) {
				  objectStore = db.createObjectStore("my-store");
				} else {
				  objectStore = upgradeTransaction.objectStore('my-store');
				}

				if (!objectStore.indexNames.contains("my-index")) {
				  objectStore.createIndex("my-index", "status", { unique: false });
				}
				*/

				vv( 'Atualizando Banco');// debug = upgradeDb;
			//	upgradeDb.createObjectStore( 'conversas', {  autoIncrement: true});
			//	upgradeDb.createObjectStore( 'contatos', {  autoIncrement: true});
		//	vv( database.obj[name_db], ' database.obj[name_db]')
		let db_obj = database.obj;
		let aux;

		var upgradeTransaction = event.target.transaction;
		var objectStore;
			//	var seguro = 0;
			for(let dat in db_obj ){
				//	vv(db_obj,'db_obj');
				//	vv(dat,'')
				if( typeof db_obj[dat]['index'] == 'undefined'){

				}else{
					aux =  db_obj[dat]['index'];
					//	vv(aux,'aux')
				}
				delete db_obj[dat]['index'];
				//	vv(dat, 'KKKKKKKKKK')
				//	if( dat != 'name'){
				//	vv(db_obj[dat], 'db_obj');
				//	vv(aux, 'aux')

				if (!upgradeDb.objectStoreNames.contains(dat)) {
					//	vv(dat,'dat');
					//	vv(db_obj[dat].val,'db_obj[dat].val');

					objectStore = upgradeDb.createObjectStore(dat, db_obj[dat].val );
					//	objectStore = upgradeTransaction.objectStore(dat, db_obj[dat] );

					if(typeof objectStore != 'undefined'){
						//	vv(aux, 'aux _pindexeddb')
						for(let i in aux){
							//	console.log(...aux[i]);
							//	vv( aux[i], 'aux[i]' );
							objectStore.createIndex( ...aux[i] );

						}
					}
				} else {
					objectStore = upgradeTransaction.objectStore(dat, db_obj[dat] );
				}

				//	upgradeDb.createObjectStore( dat, db_obj[dat] );

					/*
					if(typeof objectStore != 'undefined'){
						for(let i in aux){
							objectStore.createIndex( ...aux[i] );

						}
					}
					*/
					//	db.createObjectStore( 'contatos', {  autoIncrement: true});

				//	}
			}


			//	var os =  db.createObjectStore( 'chat', { autoIncrement: true});
			//		os.createIndex("idagenda", 'id_agenda',  { unique: false, multiEntry: true });

			//	var osc = db.createObjectStore( 'contatos', { keyPath: 'id_contato', autoIncrement: false});
			//		osc.createIndex("idagenda", 'id_contato',  { unique: false, multiEntry: true });


			//5	_get_db(name_db, func);
				/*
				_get_db(name_db).then((res)=>{
					resolve();
				});
				*/

				/*
				db.onsuccess = function(event) {
				//	db = event.target.result;
				//	func(db);
				}
				*/
			//	func(db);
		}
		dbReq.onsuccess = function(event) {
			db = event.target.result;
			resolve(db);
			//5	func(db);
		}
		dbReq.onerror = function(event) {
			alert('error opening database ' + event.target.errorCode);
			reject(event.target.errorCode);
		}
	}catch(err){
		vv('Catch do try')
		reject(err);
	}
});

}


function set_values_db(name_db, value){
//	$vv(value, 'add_db no indexeddb')
// use val{ keyPath: ['a','b'] } Sem autoincrement ou multiEntry
return new Promise((resolve, reject)=>{

	_get_db( name_db ).then( (db)=>{
		addStickyNote(db, value, name_db).then((end)=>{
			db.close();
			resolve(end);
		}).catch((err)=>{
			db.close();
			reject(err);
		});
	});
	function addStickyNote(db, values, name_db) {
		return new Promise((resolve, reject)=>{

			let request = db.transaction([name_db], 'readwrite');
				let store = request.objectStore(name_db);  // Put the sticky note into the object store
				let note = values;
				var key_val;
				try{
					 key_val = store.add(note);  // Wait for the database transaction to complete
				}catch(e){
					resolve(0);
				//	reject(0);
				}
				key_val.onsuccess = function(event){
					//	document.write("Saved with id ", event.result)
					//	var key = event.target.result;
					//	vv( event.target.result ,'_pindexeddb set_values_db')
						/*
						let aux={};
						for(let u in event.target.source.keyPath ){
							aux[event.target.source.keyPath[u] ] = event.target.result[u];
						}
						*/
					//	vv(key_val, '_pindexeddb')
				//	vv(event, 'event Pindexeddbb');
				//	vv(key_val, 'key_val Pindexeddbb');
					values[key_val.source.keyPath] = key_val.result;
					

				//	values['keyPath'] = key_val.result;
				//	vv(values, 'values')
					resolve( [values] );
					//	resolve( aux );
					//	resolve(event.target.result);
				};
				request.oncomplete = function() { 
					//	console.log('stored note!') 

					//	resolve(1);
				}
				request.onerror = function(event) {
					//	alert('error storing note ' + event.target.errorCode);
					//	vv(event.target,'error code ')
					reject(event.target.error.message);
				}
			});
		}
	});
}

function get_values_db( name_db ){
	return new Promise((resolve, reject)=>{

		_get_db( name_db ).then( (db)=>{
		//	console.log('ccccccccccc')
		getting(db, name_db).then((end)=>{
			db.close();
			resolve(end);
		})
	});
		function getting(db, name_db){
			return new Promise((resolve, reject)=>{

			//	$vv(db,'werwerwer')
			let tx = db.transaction([name_db], 'readwrite');
			let store = tx.objectStore(name_db); 
			//	console.log('bbbbbb')
			var request = store.openCursor();
			//	$vv(request);
			request.onsuccess = function(event){
				
				//7	let cursor = event.target.result;
				let res = store.getAll();
				//	var res = store.getAll();
				res.onsuccess = function() {
					//	vv(res,'_pindexeddb.js res 1')
					//	console.log(res.result);
					resolve( res.result );

				};
				//	res = res.result;
				//	vv(res,'_pindexeddb.js res 2')

				//5	func( cursor ) ;
			};
			request.onerror = function(ev){
				//	console.log('Error in updating record');
				reject(ev);
			};
		});

		}
	});
}

function get_value_db( name_db, index){
	return new Promise((resolve, reject)=>{

		_get_db( name_db ).then( (db)=>{
			getting(db, index, name_db).then((end)=>{
				db.close();
				resolve(end);
			}).catch((res)=>{
				reject(res);
			})
		});
		
		function getting(db, where, name_db){
			return new Promise((resolve, reject)=>{
				//	vv( key, '_pindexeddb' )

				let tx = db.transaction([name_db], 'readwrite');
				let store = tx.objectStore(name_db);
				/*
				try{
				//	vv( Object.keys(key)[0], 'getting _pindexeddb')
					store = store.index( Object.keys(key) );

				}catch(r){
					resolve([]);
				}
			//	let note = {text: message, timestamp: Date.now()};
			//	vv( key[Object.keys(key)], 'getting 2 _pindexeddb')
				var request = store.get( key[Object.keys(key)] );
				*/
				var request = store.openCursor();
			//	$vv(request);
			//	var result;
				request.onsuccess = function(event){
					
					//7	let cursor = event.target.result;

					let result = store.getAll();
					//	var res = store.getAll();
					result.onsuccess = function() {
						//	vv(result,'_pindexeddb.js res 1')
						//	console.log(res.result);
						result= result.result.filter(function(item) {
							for (var ky in where) {
								//	vv(ky,'ky')
								//	vv(where,'where[ky]')
								//	vv(item,'item')
								//	vv(item[ky],'item[ky]')
								if (item[ky] === undefined || item[ky] != where[ky]){
									return false;
								}

							}
							//	arr[ky] = item;
							return true;
						});
						//	vv(result,'result')
						resolve( result );

					};
					//	res = res.result;
					//	vv(res,'_pindexeddb.js res 2')

					//5	func( cursor ) ;
				};
				request.onerror = function(ev){
					//	console.log('Error in updating record');
					reject(ev);
				};


				/*
				if(key.length>1){
					function test(arr){
						arr.filter()
					}
					for(let i in key){
						test();
					}
				}
				*/
			//	vv( key[Object.keys(key)] ,'key[Object.keys(key)]');
			//	var request = store.getAll(  )

			//	let note = key;
			//	var request = store.get(key);
			//	var request = store.getAll(IDBKeyRange.upperBound(key, true))
			/*
				request.onsuccess = function(event){
				//	vv(request,'getting 3')
					resolve( request.result || [] );
				};
			
				request.onerror = function(evt){
				//	console.log('Error in retrieving record');

					reject(ev);
				};
				*/
			});
		}

	});
}

function __update_db( name_db, values, where ){
//	var name_db = 'pontos';
//	return new Promise((resolve, reject)=>{
	return new Promise((resolve, reject)=>{
		_get_db( name_db ).then((db)=>{
			let tx = db.transaction([name_db], 'readwrite');
			let store = tx.objectStore(name_db); 
			  //	console.log('bbbbbb')

			  var request = store.openCursor();
			  request.onsuccess = function(eve){
			  	var res = store.getAll();
			  	res.onsuccess = function(event){
			  		vv(res.result, 'res.result');
			  		var result;
			  		var arr={};
						//	if(where.length>1){
					result= event.target.result.filter(function(item) {
					for (var ky in where) {
						//	vv(ky,'ky')
						//	vv(where,'where[ky]')
						//	vv(item,'item')
						//	vv(item[ky],'item[ky]')
						if (item[ky] === undefined || item[ky] != where[ky]){
							return false;
						}

					}
					arr[ky] = item;
					return true;
				});
					  //	}else{
					  //	vv(arr, 'arr;')
					  vv( result, 'result final')

					  if(result.length==0){
						//	vv(Object.keys(result).length,' result aaa')
					 //   resolve([]);
					 return false;
					}
					for(let i in values ){
						result[0][i] = values[i];
					}

					var update_store = store.put(result[0] );
					update_store.onsuccess = function(){
						vv(result,' Atualizando com sucesso cursor aqui')
					 	 resolve( result[0] );

					};
						//	db.close();
					}
				}

			});
		});
//	});
}

function _update_db( name_db, values, where ){
	// Caso esteja dando erro tente passar a key na variavel values
	return new Promise((resolve, reject)=>{

			_get_db( name_db).then( (db)=>{
				updating(db, where, values, name_db).then((end)=>{
				//	db.close();
				resolve(end);
			});
		});


		async function updating(db, where,  values, name_db ){

			return new Promise((resolve, reject)=>{


				let tx = db.transaction([name_db], 'readwrite');
				let store = tx.objectStore(name_db); 
				//	console.log('bbbbbb')
			//	vv(where, 'where');
				store.openCursor().onsuccess = function(event){

					const cursor = event.target.result;
					if (cursor) {
						if (cursor.value[ Object.keys(where)[0] ] === where[ Object.keys(where)[0] ]) {
						//o	const updateData = cursor.value;

						//o	updateData.year = 2050;
						//o	const request = cursor.update(updateData);
						//	vv(values, 'values Pindexeddbb')
							const request = cursor.update(values );
							request.onsuccess = function() {
								resolve( values );
								
							};
						};

						
						cursor.continue();
					}else{
					//	console.log('Entries displayed.');
						resolve( values );

					}

				}

				/*
				vv( Object.keys(where)[0], 'Object.keys(where)')
			//	vv(where[ Object.keys(where) ], 'where _pindexeddb');

				var res = store.get(  Object.keys(where)[0]  );
				res.onsuccess = function(){
					const data  = res.result;
					var test = store.put( values );
					test.onsuccess = function(){
						vv(test, 'Atualizando com sucesso 0347');
						resolve(values);
					}
				}
				*/
				
				/*
				var cursor = store.openCursor();
			//	$vv(cursor);

				cursor.onsuccess = function(event){
				
				//7	let cursor = event.target.result;
					
					var res = store.getAll();
				//	var res = store.getAll();
					res.onsuccess = function(event) {
						vv(event,' event.result _pindexeddb.js res 1')
					//	console.log(res.result,'res.result');
						var result;
						var arr={};
					//	if(where.length>1){
						result= event.target.result.filter(function(item) {
							for (var ky in where) {
							//	vv(ky,'ky')
							//	vv(where,'where[ky]')
							//	vv(item,'item')
							//	vv(item[ky],'item[ky]')
								if (item[ky] === undefined || item[ky] != where[ky]){
									return false;
								}

							}
							arr[ky] = item;
							return true;
						});
					//	}else{
					//	vv(arr, 'arr;')
						vv( result, 'result final')

						if(result.length==0){
						//	vv(Object.keys(result).length,' result aaa')
							resolve([]);
							return false;
						}
						for(let i in values ){
							result[0][i] = values[i];
						}

						var update_store = store.put(result[0] );
						update_store.onsuccess = function(){
							resolve( result[0] );
						//	vv(result,' Atualizando com sucesso cursor aqui')

						};
					//	}
					//	resolve( res.result );
					};



				};
				*/

				//	res = res.result;
				//	vv(res,'_pindexeddb.js res 2')

				//5	func( cursor ) ;
				

				/*
				request.onsuccess = function(event){
				//	var objRequest = store.put(data);
					objRequest.onsuccess = function(ev){
					//	console.log('Success in updating record');
						resolve(1);
					};
					objRequest.onerror = function(ev){
					//	console.log('Error in updating record');
						reject(ev);
					};
				
					
				};
				*/
			});
		}


	});
}


function update_db( name_db, values, where ){
	// Caso esteja dando erro tente passar a key na variavel values
	return new Promise((resolve, reject)=>{

			_get_db( name_db).then( (db)=>{
				updating(db, where, values, name_db).then((end)=>{
				db.close();
				resolve(end);
			});
		});


		function updating(db, where,  values, name_db ){

			return new Promise((resolve, reject)=>{


				let tx = db.transaction([name_db], 'readwrite');
				let store = tx.objectStore(name_db); 
				//	console.log('bbbbbb')
			//	vv(where, 'where');
			//	vv(values, 'values');
				var res = store.getAll();
				//	var res = store.getAll();
				res.onsuccess = function(event) {
				//	vv(event,' event.result _pindexeddb.js res 1')
				//	console.log(res.result,'res.result');
					var result;
					var arr={};
				//	if(where.length>1){
					result= event.target.result.filter(function(item) {
						for (var ky in where) {
							if (item[ky] === undefined || item[ky] != where[ky]){
								return false;
							}
						}
						arr[ky] = item;
						return true;
					});
			

					if(result.length==0){
					//	vv(Object.keys(result).length,' result aaa')
					//	vv(result, 'where não satisfaz')
						resolve([]);
						return false;
					}
					for(let i in values ){
						result[0][i] = values[i];
					}

					var update_store = store.put(result[0] );
					update_store.onsuccess = function(){
						resolve( [ result[0] ] );
					//	vv(result,' Atualizando com sucesso cursor aqui')

					};
				//	}
				//	resolve( res.result );
				};			

			});
		}


	});
}

function remove_db( name_db, index){
	return new Promise((resolve, reject)=>{

		_get_db( name_db).then( (db)=>{
			deleting(db, index, name_db ).then((end)=>{
				db.close();
				resolve(end);
			})
		});
	});	
	
	function deleting(db, index, name_db ){
		return new Promise((resolve, reject)=>{

			let tx = db.transaction([name_db], 'readwrite');
			let store = tx.objectStore(name_db); 

			var request = store.delete(index);
			request.onsuccess = function(event){
			//	vv(event, 'Pindexeddbb')
				resolve(1);
			};

			request.onerror = function(ev){
			//	console.log('Error in updating record');
			reject(ev);
		};
	});
	}
}

function delete_db(name_db, where, orAnd='and') {
	return new Promise((resolve, reject)=>{

		_get_db( name_db).then( (db)=>{
			delete_db(db, where, name_db, orAnd ).then((end)=>{
				db.close();
				resolve(end);
			})
		});
	});	
	function delete_db( db, where, name_db, orAnd ){
		return new Promise((resolve, reject)=>{


				let tx = db.transaction([name_db], 'readwrite');
				let store = tx.objectStore(name_db); 
				//	console.log('bbbbbb')
			//	vv(where, 'where');
			//	vv(values, 'values');
				var res = store.getAll();
				//	var res = store.getAll();
				res.onsuccess = function(event) {
				//	vv(event,' event.result _pindexeddb.js res 1')
				//	console.log(res.result,'res.result');
					var result;
					var arr={};
				//	if(where.length>1){
					
					result= event.target.result.filter(function(item) {
						for (var ky in where) {
							if (item[ky] === undefined || item[ky] != where[ky]){
								return false;
							}
						}
						arr[ky] = item;
						return true;
					});
					

					/*
					result= event.target.result.filter(function(item) {
						for (var ky in where) {
							//	vv(ky,'ky')
							//	vv(where,'where[ky]')
							//	vv(item,'item')
							//	vv(item[ky],'item[ky]')
							if(orAnd=='and'){
								if (item[ky] === undefined || item[ky] != where[ky]){
									return false;
								}

							}else if(orAnd=='or'){
								if (item[ky] === undefined || item[ky] == where[ky] ){
									return true;
								}									
							}

						}
						if( orAnd == 'and'){
							return true;

						}else if(orAnd =='or'){
							return false;

						}
						//	arr[ky] = item;
					});
					*/
			

					if(result.length==0){
					//	vv(Object.keys(result).length,' result aaa')
					//	vv(result, 'where não satisfaz')
						resolve([]);
						return false;
					}
					/*
					for(let i in values ){
						result[0][i] = values[i];
					}
					*/
				//	vv(result, 'result Pindexeddbb')
				//	var cc = [];
					var cont = 0;
					/*
					var cc = $for_order((v)=>{
					//	vv(v,'vvv')
						cont++;
						return v+((cont==1&& Object.keys(where).length > 1)?(','):(''));

					}, where, 'desc' );
					*/
				//	vv(result,'result ')
					
				//	var update_store = store.delete( where );
					var update_store = store.delete( where[ Object.keys(where) ] );
					update_store.onsuccess = function(){
						resolve( [ result[0] ] );
					//	vv(result,' Atualizando com sucesso cursor aqui')

					};
				//	}
				//	resolve( res.result );
				};			

			});
		}


/*
	return new Promise((resolve, reject)=>{
	//	get_values_db
		_get_db( name_db).then( (db)=>{
			clearing(db,  name_db ).then((end)=>{
				db.close();
				resolve(end);
			})
		});
	});
*/
	/*
	function clearing( db, name_db ){
		return new Promise((resolve, reject)=>{

		//	var store = db.getObjectStore(name_db, 'readwrite');
			var req = db.clear();
			req.onsuccess = function(evt) {
				//	displayActionSuccess("Store cleared");
				//	displayPubList(store);
				vv(store,'_pindexeddb')
				resolve(store);
			};
			req.onerror = function (evt) {
				//	console.error("clearObjectStore:", evt.target.errorCode);
				//	displayActionFailure(this.error);
				reject(evt);
			};
		});
	}
	*/
}

function filter_db( arr, where){

	var result= arr.filter(function(item) {
		for (var ky in where) {
			if (item[ky] === undefined || item[ky] != where[ky]){
				return false;
			}

		}
	//2	arr[ky] = item;
	return true;
	});
	//	vv(result, 'result filter_db');
	return result;
}

function clear_db( name_db ){
	return new Promise((resolve, reject)=>{

		_get_db( name_db).then( (db)=>{
			function clearing(dbb, name_db){
				return new Promise((resolve, reject)=>{
					let tx = db.transaction([name_db], 'readwrite');
					let store = tx.objectStore(name_db); 
				  //	console.log('bbbbbb')
				  	var request = store.clear();
				  	request.onerror = function(){
				  		resolve(0);
				  	}
				  	request.onsuccess = function(){
				  		resolve(1);
				  	}

				});
			}
			clearing(db,  name_db ).then((end)=>{
			//	db.close();
				resolve(end);
			});
		});
	});
}