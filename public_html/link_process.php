<?php   
   	
	//require_once('helpers/FbHelper.php');
	
	require_once('../config.php'); 
	require_once('../helpers/lib_autolink_curl.php'); 
	
	try 
	{
	    if (!$_GET['id'] or !$_GET['url'])
		{
			//No input
			header('Location: ' . $config['URL_BASE']);	
			return;
		}
	
		
	
		//Referral id
		$referral_id =$_GET['id'];
		
		//Product url
		$product_url = $_GET['url'];
		
		if(strlen($product_url) == 0)
		{
			header('Location: ' . $config['URL_MAIN']);	
			return;
		}
		
		//Generate affiliated url
		$api_url = $config['VL_API'] . '&out=' . urlencode($product_url) . '&key=' . $config['VL_KEY'] . '&cuid=' . $referral_id;
        $affiliated_url = getUrlContents($api_url);
			
		
		if(strlen($affiliated_url) > 0)
        {
            //Redirect to affiliated product page
            header('Location: '. $affiliated_url);
			return;
        }
		
		echo 'Ups... error redirecting to product page! ' . $api_url;	
	} 
	catch(Exception $e) 
	{
        error_log($e->getMessage());	
		echo $e->getMessage();
	}
    
?>