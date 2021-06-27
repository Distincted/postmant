

	footer = {
		abs: 'footer',
		
		call_test(){
			if($('#callmodal').html() != ''){
			//	$html('#callmodal','');
				$end_comp('iframe')
				return;
			}
			$html('#callmodal',
				$t('iframe',{src:'https://redeantimal.000webhostapp.com/start/testRequest',style:'width:100%;height:23em;'})
			);
		},
		construct(){
			return new Promise((resolve, reject)=>{
				resolve(
					$t('footer',{class:'bg-light text-center text-lg-start mt-2'},
						$t('div',{class:'text-center p-3', style: 'background-color: rgba(0,0,0,0.2);'},
							'Postmant Request Test'
							+$t('a',{class:'text-dark', href: 'https://mdbootstrap.com'}, '&copy;')
							
						)
					)
					
				);
			});
		}
	};

		


