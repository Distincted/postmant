postmant = {
	verbos: ['GET','POST','DELETE','PATCH','PUT','other' ],
	inp_post: 0,
	switch_html: 1,
	construct: function(){

		new Promise((resolve)=>{
			$html('body',
				$t('div',{style:'margin: 37px;'},
					$t('label',{},'Verbo:')
					+$t1('br')
					+$t1('input',{type:'checkbox',checked:'checked', id:'box_check',onclick:`(function(){
						if(document.getElementById("box_check").checked) {
							$scope.postmant.switch_html = 1;
						}else{
							$scope.postmant.switch_html = 0;
						}
					})();`},
						$t('label',{for:'box_check'},'Ocultar HTML')
					)
					+$t('select',{class:'form-control',id:'sel_search', onchange: inc(this.name,'sel_testing(this);')},
						$for(function(val){
							return(
								$t('option',{},val)
							);
						}, this.verbos )
					)
					+$t('label',{},'URL:')
					+$t('div',{class:'d-flex'},
						$t1('input',{class:'form-control',placeholder:'URL',value:'http://localhost/',id:'inp_search'})
						
						+$t('button',{class:'btn btn-success',onclick:inc(this.name, 'testing();' )}, 'Testar')
					)
					+$t('div',{id:'exit_sel'})
				//	+$t('code',{id:''})
					+$t('code',{id:'exit_result'})
				)
				
			);
			resolve();
		});
	},
	testing: function(){
		let inp = $('#inp_search').val();
		let sel = $('#sel_search ').find(":selected").text();
		let var_data = null;
		if(sel){
			if($scope.postmant.inp_post>0){
				let obj = {};
				$for(function(val){
					obj[ $('#inp_post'+val).val() ]	= $('#inp_postt'+val).val();
				}, (function(){
						let arr=[];
						for(let i = $scope.postmant.inp_post; i>0; i--){
							arr.push(i);
						}
						return( arr );
					})()
				);
				var_data = obj;
			}
		}
		let rajax = {
			url: inp,
			type: sel,
			async: true,
			cache: true,
			data: var_data,
			timeout: 3000,
			dataType: 'text',
			error: function(){	
				$html('#exit_result',
					$t('h1',{},'Error na Requisição')
				);
				return false;
			},
			success: function(data){
				if( $scope.postmant.switch_html == 1){
					$html('#exit_result',
						$rtext(
							data
						)
					);
				}else{
					$html('#exit_result',
						data
					);
				}
			}
		}
		$.ajax( rajax );
	},
	add_inp: function(){
		inp_post++;
		$append('#ex_sel',
			$row(
				$col_md_(
					$t1('input',{class:'form-control',id:'inp_post'+inp_post, placeholder:'Campo '+inp_post })
				,6)
				+$col_md_(
					$t1('input',{class:'form-control',id:'inp_postt'+inp_post, placeholder:'Campo '+inp_post })
				,6)
			)
		);
	},
	remove_inp: function(){
		if(inp_post==0){
			return;
		}
		$removeFade('#inp_post'+inp_post );
		$removeFade('#inp_postt'+inp_post );
		inp_post--;
	},
	sel_testing: function(thiss, evento){
		if( typeof thiss =='undefined'){
			return false;
		}
		if(true){
			$html('#exit_sel',
				$t('div',{id:'ex_sel'},
					$t('label',{},'Data ')
					+$t('button',{class:'btn btn-primary',onclick: inc('postmant', 'add_inp();') },'Add')
					+$t('button',{class:'btn btn-danger',onclick:inc('postmant', 'remove_inp();') },'Remove')
				)
			)
			inp_post = 0;
		}else{
			$removeFade('#ex_sel');
		}
	}
}