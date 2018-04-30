angular.module("ac-redesign", []).service('acSorting', function() {
  ///This service returns chipest products
    this.ac_chipest_resutls_sort = function (sortingArray) {
      sortingArray = sortingArray.sort(function(a,b){
        if (a.baseRecurringPrice < b.baseRecurringPrice)
    		    return -1;
    		  else if (a.baseRecurringPrice > b.baseRecurringPrice)
    		    return 1;
    		  else
    		    return 0;
    })
        return sortingArray;
    }
}).service('splitPrices', function() {
  ///This service returns dicimal values
    this.splitPricesValues = function (priceValue) {
      if(priceValue.toString().split(".").length > 1){
          priceValue = priceValue.toString().split(".");
      }else{
        priceValue = [priceValue,00]
      }
        return priceValue;
    }
}).service('getFastestProducts', function() {
  ///This service returns fastest products
    this.getFastestProductsList = function (productsJson) {
      productsJson = productsJson.sort(function(a,b){
        if (a.connectionSpeed < b.connectionSpeed)
    		      return -1;
            else if (a.connectionSpeed > b.connectionSpeed)
      		    return 1;
    		    else
    		      return 0;

    })
        return productsJson;
    }
}).controller('productResultsController', ['$scope','$http','acSorting','splitPrices','getFastestProducts','$filter', function($scope,$http,acSorting,splitPrices,getFastestProducts,$filter) {
  //////////////////////////////////////////////////////////

      var pageShown =  1;
      var pageSize = 10;

      $scope.bundleTypes = [];
      $scope.providers = [];
      $scope.channels = [];
      $scope.contractLength = [];
      $scope.filterList = [];
      $scope.providerList = [];
     $scope.bundleList = [];
     $scope.contractList = [];
     $scope.checkedFiltersList = [];
     $scope.productCategory= productCategory;
     $scope.zipcode= zipcode;


  //////////////////////////////////////////////////////////
  //Load Products Information -- this method return init products Information
	$scope.loadProductInfo = function() {
		console.log("category="+$scope.productCategory);
	        $scope.productSize = productResutsArray.length;
            $scope.productResultsArrayJson = productResutsArray;
            $scope.originalProductResultsArrayJson = productResutsArray;
            $scope.loadFilterData();
	 },///--End loadProductInfo
   //////////////////////////////////////////////////////////
  //View Chipest product results -- this method return chipest product only products under $60
  $scope.loadChipestProduct = function() {
    $scope.chipestProductsList = [];
    angular.forEach($scope.originalProductResultsArrayJson, function(value, key){
       if(value.baseRecurringPrice != undefined && value.baseRecurringPrice <= 60 )
          $scope.chipestProductsList.push(value)
    });
    $scope.productResultsArrayJson = acSorting.ac_chipest_resutls_sort($scope.chipestProductsList);
    console.log($scope.productResultsArrayJson)
  },///--End loadChipestProduct
  //////////////////////////////////////////////////////////
 //View All product results -- this method return chipest product only products under $60
  $scope.loadAllProduct = function() {
    $scope.productResultsArrayJson = $scope.originalProductResultsArrayJson;
    console.log($scope.productResultsArrayJson)
  }
  ///--End loadAllProduct
  //////////////////////////////////////////////////////////
  //View fastest product results -- this method return fastest product only products over 50 Mbps
  $scope.loadFastestProduct = function() {
    var fastestArray = [];//parseInt($scope.num1)
    angular.forEach($scope.originalProductResultsArrayJson, function(value, key){
       if(value.connectionSpeed != undefined  && parseInt(value.connectionSpeed) >= 20)
          fastestArray.push(value)
    });
	  $scope.productResultsArrayJson = getFastestProducts.getFastestProductsList(fastestArray);
    console.log($scope.productResultsArrayJson.length)
  },///--End loadFastestProduct
  //////////////////////////////////////////////////////////
  //-- this method return price dimentions
  	$scope.splitPrices = function(price) {
      $scope.price = splitPrices.splitPricesValues(price);
      $scope.nonDecimalPrice = $scope.price[0]
      if($scope.price[1] > 0){
          $scope.decimalPrice = $scope.price[1]
      }
      return true;
    },///--End loadFastestProduct
    $scope.getCountValue = function(view, value){
    var count = 0;
    angular.forEach($scope.productResultsArrayJson, function(obj, index){

        if(value == 'Provider' && obj.providerName == view){
            count++;
        }else if( value == 'Bundle' && obj.productCategories == view){
            count++;
        }else if( value == 'Contract' && obj.contractTerm == view ){
              count++;
          }
      });

      return count;
  },$scope.loadFilterData = function(){
        $scope.loadProductsResults = [];
        angular.forEach($scope.productResultsArrayJson, function(dataObj, index){

            if($scope.providers == ''){
                $scope.providers.push({key:dataObj.providerName,count:$scope.getCountValue(dataObj.providerName,'Provider')});
            }else{
                var bool = $filter('filter')($scope.providers,{key : dataObj.providerName});
                if(bool.length == 0 ){
                    $scope.providers.push({key:dataObj.providerName,count:$scope.getCountValue(dataObj.providerName,'Provider')});
                }
            }

            if($scope.bundleTypes == ''){
                $scope.bundleTypes.push({key:dataObj.productCategories,count:$scope.getCountValue(dataObj.productCategories,'Bundle')});
            }else{
                 var bool = $filter('filter')($scope.bundleTypes,{key : dataObj.productCategories});
                 if(bool.length == 0 ){
                    $scope.bundleTypes.push({key:dataObj.productCategories,count:$scope.getCountValue(dataObj.productCategories,'Bundle')});
                 }
            }

            if($scope.contractLength == ''){
                $scope.contractLength.push({key:dataObj.contractTerm,count:$scope.getCountValue(dataObj.contractTerm,'Contract')});
            }else{
                 var bool = $filter('filter')($scope.contractLength,{key : dataObj.contractTerm});
                 if(bool.length == 0 ){
                    $scope.contractLength.push({key:dataObj.contractTerm,count:$scope.getCountValue(dataObj.contractTerm,'Contract')});
                 }
            }


        });
      //  $scope.loadProductsResults = $scope.productArrays;
        //$scope.productResultsArrayJson = $scope.loadProductsResults;
	},
  // Applying Filters for products
   $scope.onClickFilter = function(viewValue, filterType){

       if(filterType == 'Provider'){
           var bool = $filter('filter')($scope.providerList,viewValue);
           if(bool.length == 0){
               $scope.providerList.push(viewValue);
               $scope.checkedFiltersList.push({key: viewValue, type:'Provider'});
           }else{
               var removeIndex = $scope.providerList.map(function(item) { return item; }).indexOf(viewValue);
               var removeIndex1 = $scope.checkedFiltersList.map(function(item) { return item.key; }).indexOf(viewValue);
               $scope.providerList.splice(removeIndex,1);
               $scope.checkedFiltersList.splice(removeIndex1,1);
           }
//           $scope.loadOtherFilters($scope.providerList, filterType);
       }else if(filterType == 'BundleType'){
           var bool = $filter('filter')($scope.bundleList,viewValue);
           if(bool.length == 0){
               $scope.bundleList.push(viewValue);
               $scope.checkedFiltersList.push({key: viewValue, type:'Bundle'});
           }else{
               var removeIndex = $scope.bundleList.map(function(item) { return item; }).indexOf(viewValue);
               var removeIndex1 = $scope.checkedFiltersList.map(function(item) { return item.key; }).indexOf(viewValue);
               $scope.bundleList.splice(removeIndex,1);
               $scope.checkedFiltersList.splice(removeIndex1,1);
           }
//           $scope.loadOtherFilters($scope.bundleList, filterType);
       }else if(filterType == 'Contract'){
           var bool = $filter('filter')($scope.contractList,viewValue);
           if(bool.length == 0){
               $scope.contractList.push(viewValue);
               $scope.checkedFiltersList.push({key: viewValue, type:'Provider'});
           }else{
               var removeIndex = $scope.contractList.map(function(item) { return item; }).indexOf(viewValue);
               var removeIndex1 = $scope.checkedFiltersList.map(function(item) { return item.key; }).indexOf(viewValue);
               $scope.contractList.splice(removeIndex,1);
               $scope.checkedFiltersList.splice(removeIndex1,1);
           }
//           $scope.loadOtherFilters($scope.contractList, filterType);
       }

       console.log($scope.checkedFiltersList);
       $scope.filterList = [];
       $scope.findFilterProducts($scope.providerList, $scope.bundleList, $scope.contractList);
       if($scope.providerList.length == 0 && $scope.bundleList == 0 && $scope.contractList == 0){
  			$scope.productResultsArrayJson = $scope.originalProductResultsArrayJson;
        $scope.loadFilterData();
  		}

   },

    //Building Products Resutls
   $scope.findFilterProducts = function(provides, bundles, contracts){

       if(provides.length > 0){
           if($scope.filterList.length == 0){
               angular.forEach(provides, function(dataObj, index){
                   var bool = $filter('filter')($scope.originalProductResultsArrayJson, { providerName: dataObj});
                   var bool1 = $filter('filter')($scope.filterList, { provider: dataObj});
                   if(bool.length > 0 && bool1.length == 0){
                       angular.forEach(bool, function(dataObj1, index){
                           $scope.filterList.push(dataObj1);
                       })
                   }
               });
           }else{
                $scope.providerFilterList = [];
                angular.forEach(provides, function(dataObj, index){
                    var bool = $filter('filter')($scope.filterList, { providerName: dataObj});
                    if(bool.length > 0){
                        angular.forEach(bool, function(dataObj1, index){
                            $scope.providerFilterList.push(dataObj1);
                        })
                    }
                });
                $scope.filterList = $scope.providerFilterList;;
           }

       }
       if(bundles.length > 0){
            if($scope.filterList.length == 0){
                angular.forEach(bundles, function(dataObj, index){
                   var bool = $filter('filter')($scope.originalProductResultsArrayJson, { productCategories: dataObj});
                   if(bool.length > 0){
                       angular.forEach(bool, function(dataObj1, index){
                           $scope.filterList.push(dataObj1);
                       })
                   }
               });
            }else{
                $scope.bundleFilterList = [];
                angular.forEach(bundles, function(dataObj, index){
                   var bool = $filter('filter')($scope.filterList, { productCategories: dataObj});
                   if(bool.length > 0){
                       angular.forEach(bool, function(dataObj1, index){
                           $scope.bundleFilterList.push(dataObj1);
                       })
                   }
               });
               $scope.filterList = $scope.bundleFilterList;
            }
       }
       if(contracts.length > 0){
           if($scope.filterList.length == 0){
               angular.forEach(contracts, function(dataObj, index){
                  var bool = $filter('filter')($scope.originalProductResultsArrayJson, { contractTerm: dataObj});
                  if(bool.length > 0){
                      angular.forEach(bool, function(dataObj1, index){
                          $scope.filterList.push(dataObj1);
                      })
                  }
              });
           }else{
                $scope.contractFilterList = [];
                angular.forEach(contracts, function(dataObj, index){
                    var bool = $filter('filter')($scope.filterList, { contractTerm: dataObj});
                    if(bool.length > 0){
                      angular.forEach(bool, function(dataObj1, index){
                          $scope.contractFilterList.push(dataObj1);
                      })
                    }
                });
                $scope.filterList = scope.contractFilterList;
           }
       }
            console.log("contracts length"+$scope.filterList);
            $scope.productResultsArrayJson = $scope.filterList;

   },//Clearing filters...
   $scope.clearFilters = function(){

        $scope.providerList = [];
        $scope.bundleList = [];
        $scope.contractList = [];
        $scope.providers = [];
        $scope.contractLength = [];
        $scope.bundleTypes = [];
        $scope.productResultsArrayJson = $scope.originalProductResultsArrayJson;
        $scope.loadFilterData();

   },  $scope.getCountForFilters = function(view, value, type, value1){
        var count = 0;
        angular.forEach($scope.productResultsArrayJson, function(obj, index){

            if(value == 'Provider' && type == 'Bundles' && view == obj.providerName && value1 == obj.productCategories){
                count++;
            }else if(value == 'Contract' && type == 'Bundles' && view == obj.contractTerm && value1 == obj.productCategories){
                count++;
            }else if( value == 'Bundle' && type == 'ContractTerm' && obj.productCategories == view && value1 == obj.contractTerm){
                count++;
            }else if( value == 'Provider' && type == 'ContractTerm' && obj.providerName == view && value1 == obj.contractTerm){
                count++;
            }else if( value == 'Contract' && type == 'Providers' && obj.contractTerm == view &&  value1 == obj.providerName){
                count++;
            }else if( value == 'Bundle' &&  type == 'Providers' && obj.productCategories == view &&  value1 == obj.providerName){
                count++;
            }
        });

        return count;
    },
// load filters basedon

   $scope.loadOtherFilters = function(list, type){

        if(type == 'Provider' && list.length > 0){
            $scope.bundleFilters = [];
            $scope.contractFilters = [];
            angular.forEach(list, function(obj, index){
                var provider = $filter('filter')($scope.productResultsArrayJson, { providerName: obj});
                if( provider.length > 0 ){
                   angular.forEach(provider, function(obj, index){
                        if($scope.bundleFilters == ''){
                            $scope.bundleFilters.push({key:obj.productCategories,count:$scope.getCountForFilters(obj.productCategories,'Bundle', 'Providers', obj.providerName)});
                        }else{
                            var bool = $filter('filter')($scope.bundleFilters,{key : obj.productCategories});
                            if(bool.length == 0 ){
                                $scope.bundleFilters.push({key:obj.productCategories,count:$scope.getCountForFilters(obj.productCategories,'Bundle','Providers', obj.providerName)});
                            }
                        }
                        if($scope.contractFilters == ''){
                            $scope.contractFilters.push({key:obj.contractTerm,count:$scope.getCountForFilters(obj.contractTerm,'Contract','Providers', obj.providerName)});
                        }else{
                            var bool = $filter('filter')($scope.contractFilters,{key : obj.contractTerm});
                            if(bool.length == 0 ){
                                $scope.contractFilters.push({key:obj.contractTerm,count:$scope.getCountForFilters(obj.contractTerm,'Contract','Providers', obj.providerName)});
                            }
                        }
                   });
                }
            });
            $scope.contractLength = $scope.contractFilters;
            $scope.bundleTypes = $scope.bundleFilters;
        }else if(type == 'BundleType' && list.length > 0){
            $scope.providerFilters = [];
            $scope.contractFilters = [];
            angular.forEach(list, function(obj, index){
                var bundle = $filter('filter')($scope.productResultsArrayJson, { productCategories: obj});
                if( bundle.length > 0 ){
                   angular.forEach(bundle, function(obj, index){
                        if($scope.providerFilters == ''){
                            $scope.providerFilters.push({key:obj.providerName,count:$scope.getCountForFilters(obj.providerName,'Provider','Bundles', obj.productCategories)});
                        }else{
                            var bool = $filter('filter')($scope.providerFilters,{key : obj.providerName});
                            if(bool.length == 0 ){
                                $scope.providerFilters.push({key:obj.providerName,count:$scope.getCountForFilters(obj.providerName,'Provider','Bundles', obj.productCategories)});
                            }
                        }
                        if($scope.contractFilters == ''){
                            $scope.contractFilters.push({key:obj.contractTerm,count:$scope.getCountForFilters(obj.contractTerm,'Contract', 'Bundles', obj.productCategories)});
                        }else{
                            var bool = $filter('filter')($scope.contractFilters,{key : obj.contractTerm});
                            if(bool.length == 0 ){
                                $scope.contractFilters.push({key:obj.contractTerm,count:$scope.getCountForFilters(obj.contractTerm,'Contract', 'Bundles', obj.productCategories)});
                            }
                        }
                   });
                }
            });
             $scope.contractLength = $scope.contractFilters;
             $scope.providers = $scope.providerFilters;
        }else if(type == 'Contract' && list.length > 0){
            $scope.providerFilters = [];
            $scope.bundleFilters = [];
            angular.forEach(list, function(obj, index){
                var contract = $filter('filter')($scope.productResultsArrayJson, { contractTerm: obj});
                if( contract.length > 0 ){
                   angular.forEach(contract, function(obj, index){
                        if($scope.bundleFilters == ''){
                            $scope.bundleFilters.push({key:obj.productCategories,count:$scope.getCountForFilters(obj.productCategories,'Bundle','ContractTerm',obj.contractTerm)});
                        }else{
                            var bool = $filter('filter')($scope.bundleFilters,{key : obj.productCategories});
                            if(bool.length == 0 ){
                                $scope.bundleFilters.push({key:obj.productCategories,count:$scope.getCountForFilters(obj.productCategories,'Bundle','ContractTerm',obj.contractTerm)});
                            }
                        }
                        if($scope.providerFilters == ''){
                            $scope.providerFilters.push({key:obj.providerName,count:$scope.getCountForFilters(obj.providerName,'Provider','ContractTerm',obj.contractTerm)});
                        }else{
                            var bool = $filter('filter')($scope.providerFilters,{key : obj.providerName});
                            if(bool.length == 0 ){
                                $scope.providerFilters.push({key:obj.providerName,count:$scope.getCountForFilters(obj.providerName,'Provider','ContractTerm',obj.contractTerm)});
                            }
                        }
                   });
                }
            });
            $scope.bundleTypes = $scope.bundleFilters;
            $scope.providers = $scope.providerFilters;
        }else {
            $scope.loadFilterData();
        }

   },$scope.paginationLimit = function(){
        return pageSize * pageShown;
    },

    $scope.hasMoreItemsToShow = function() {
        return pageShown < ($scope.productResultsArrayJson.length / pageSize);
    };
    $scope.showMoreItems = function() {
        pageShown = pageShown + 1;
    };
    $scope.hasLessItemsToShow = function() {
        return ( $scope.productResultsArrayJson.length > pageSize && pageShown >= ($scope.productResultsArrayJson.length / pageSize) );
    };

    $scope.showLessItems = function(){
       pageShown = 1;
    };

}]);