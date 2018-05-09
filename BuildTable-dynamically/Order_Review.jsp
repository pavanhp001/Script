<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Product Customization</title>

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
<link rel="stylesheet" href="<c:url value='/style/common_checkout.css'/>" />
<link rel="stylesheet" href="<c:url value='/style/static_checkout.css'/>" />
<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
<link rel="stylesheet" type="text/css" href="css/static_checkout.css" /> -->

<script type="text/javascript" src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
<script src="<c:url value='/script/crossdomain.js'/>"></script>
<script src="<c:url value='/script/feedback.js'/>"></script>

<!-- <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script type="text/javascript" src="bootstrap-3.3.5/js/bootstrap.min.js"></script> -->
<link rel="stylesheet" href="<c:url value='/style/acdc/acdc_order_review.css'/>" />
 <script type="text/javascript">
 var orderReviewJson = ${orderRecapVO};
	$(document).ready(function() {
	    $(".next").on("click", function() {
	    	displayCheckoutLoader(false);
	        $('#placeOrderForm').submit();
	    });
	    $('.next_step').bind("keydown", function(event) {
		    if (event.keyCode === 13){
		    	$('#placeOrderForm').submit();
		    }
		 });
	    setCustomerDetails();
	    featureHtmlBulid(orderReviewJson);
	    $('#accordion').on('hidden.bs.collapse', setDynamicHeight);
	    $('#accordion').on('shown.bs.collapse', setDynamicHeight);
		
		$('.panel').on('show.bs.collapse', function (e) {
			$("#"+e.currentTarget.id).addClass("accord-selected");
			$(e.target).prev('.panel-heading').find("span.indicator").addClass('glyphicon-triangle-bottom');
			$(e.target).prev('.panel-heading').find("span.leftindicator").toggleClass('glyphicon-plus glyphicon-minus');
			$("#"+e.currentTarget.id).find("panel-collapse").removeClass("in");
			setDynamicHeight();
			setCheckoutActions();
		})
		$('.panel').on('hide.bs.collapse', function (e) {
			$("#"+e.currentTarget.id).removeClass("accord-selected");
			console.log(e.currentTarget.id);
			$("#"+e.currentTarget.id).find("panel-collapse").removeClass("in");
			$(e.target).prev('.panel-heading').find("span.indicator").removeClass('glyphicon-triangle-bottom');
			$(e.target).prev('.panel-heading').find("span.leftindicator").toggleClass('glyphicon-minus glyphicon-plus');
			setDynamicHeight();
			setCheckoutActions();
		});
	   
	    var checkoutPageTitle = "Product Customization";
	    if(dataLayer!=undefined && dataLayer.pageContent!= undefined)
	    	dataLayer.pageContent.pageName="Review and Place Order";
	   	setCheckoutPageTitle(checkoutPageTitle);
	   	setDynamicHeight();
	   	checkoutToDigitalActions("isHideViewChannelLineup");
	   	displayCheckoutLoader(true);
	});
	var collapseCount = 1;
	var panelCount = 1;

	function featureHtmlBulid(orderReviewJsonList) {
	    var orderDetialList = orderReviewJsonList.orderDetialList
	    var promotionList = orderReviewJsonList.promotionList
	    var termsAndConditionsPanelBody = $("<div></div>").attr({
	        "class": "panel-body"
	    });
	    var promotionPanelBody = $("<div></div>").attr({
	        "class": "panel-body"
	    });
	    var panelBody = $("<div></div>").attr({
	        "class": "panel-body"
	    });
	    var table = $("<table></table>").attr({
	        "class": "orderDetailsTable"
	    });
	    var thead = $("<thead></thead>").attr({
	        "class": "orderDetailsthead"
	    });
	    var tbody = $("<tbody></tbody>").attr({
	        "class": "orderDetailstbody"
	    });
	    var theadTr = $("<tr></tr>");

	    theadTr.append($("<th></th>").text("Description"));
	    theadTr.append($("<th></th>").text(""));
	    theadTr.append($("<th></th>").text("Price"));
	    thead.append(theadTr);
	    $.each(orderDetialList, function(j, orderDetialListObj) {
	        //Start create pannel body content 
	        if (orderDetialListObj.isIncluded == false) {
	            if (orderDetialListObj.baseRecurringPrice != undefined) {
	                if(toFixedNumber(orderDetialListObj.baseRecurringPrice) > 0){
	                	var price = toFixedNumber(orderDetialListObj.baseRecurringPrice) + "/month";
		    	        tbody.append(detailsTrAppend(price,orderDetialListObj.description,""));
		            }
	            }  
	            if (orderDetialListObj.baseNonRecurringPrice != undefined) {
	                if(toFixedNumber(orderDetialListObj.baseNonRecurringPrice) > 0){
	                	price = toFixedNumber(orderDetialListObj.baseNonRecurringPrice) + "/installation";
	                	tbody.append(detailsTrAppend(price,orderDetialListObj.description,""));
		            }
	            }
	        } else if (orderDetialListObj.isIncluded == true) {
	        	var price  = "Included";
	            tbody.append(detailsTrAppend(price,orderDetialListObj.description,""));
	        }

	        if (orderDetialListObj.featureVOList != undefined) {

	            $.each(orderDetialListObj.featureVOList, function(j, featureVO) {
		            if (featureVO.baseRecurringPrice != undefined) {
		                if(toFixedNumber(featureVO.baseRecurringPrice) > 0){
		                	var price = toFixedNumber(featureVO.baseRecurringPrice) + "/month";
		                	 tbody.append(detailsTrAppend(price,orderDetialListObj.description,featureVO.description));
			            }
		            } 
		            if (featureVO.baseNonRecurringPrice != undefined) {
		                if(toFixedNumber(featureVO.baseNonRecurringPrice) > 0){
		                	var price =  toFixedNumber(featureVO.baseNonRecurringPrice) + "/installation";
			    	        tbody.append(detailsTrAppend(price,orderDetialListObj.description,featureVO.description));
			            }
		            }
	            });
	        }
	    });
	    table.append(thead);
	    table.append(tbody);
	    panelBody.append(table)
	    accordionContent(panelBody, "Order Details");
	    var promotionDiv = $("<div></div>").addClass("promotionDetails");
	    var termsAndConditions = $("<div></div>").addClass("promotionConditions");
	    if(promotionList.length > 0){
	    	$.each(promotionList, function(j, promotionobj) {
		        var promotionDescription = $("<div></div>").text(promotionobj.promotion.description);
		        promotionDiv.append(promotionDescription);
		        var promotionConditions = $("<div></div>").text(promotionobj.promotion.conditions);
		        termsAndConditions.append(promotionConditions);
		    });
		    promotionPanelBody.append(promotionDiv)
		    accordionContent(promotionPanelBody, "Promotion Details");		    

	    	termsAndConditionsPanelBody.append(termsAndConditions);
		    accordionContent(termsAndConditionsPanelBody,"Terms And Conditions");
	    }
	}

function detailsTrAppend(price, description, subdescription){
	var detailsTr = $("<tr></tr>");
	detailsTr.append($("<td></td>").text(description));
    detailsTr.append($("<td></td>").text(subdescription));
    detailsTr.append($("<td></td>").text(price));
    return detailsTr;
}
 function toFixedNumber(price){
	if(!isNaN(parseFloat(price))){
		return parseFloat(price).toFixed(2);
	}
   return "";
 }
	function accordionContent(panelBody, title) {
	    panelCount = panelCount + 1
	    collapseCount = collapseCount + 1
	    var panelDefault = $("<div></div>").attr({
	        "class": "panel panel-default",
	        "id": panelCount
	    });
	    var panelHeading = $("<div></div>").attr({
	        "class": "panel-heading"
	    });
	    var panelTitle = $("<h4></h4>").attr({
	        "class": "panel-title"
	    });
	    var collapse = $("<a></a>").attr({
	        "data-toggle": "collapse",
	        "data-parent": "#accordion",
	        "href": "#collapse" + collapseCount
	    }); //page
	    var leftindicator = $("<span></span>").attr({
	        "class": "leftindicator glyphicon glyphicon-plus"
	    });
	    var leftindicatorValue = $("<span></span>").attr({
	        "class": "leftindicatorValue"
	    }).text(title); //title  
	    $("#accordion").append(panelDefault);
	    collapse.append(leftindicator);
	    collapse.append(leftindicatorValue);
	    panelTitle.append(collapse);
	    panelHeading.append(panelTitle);
	    panelDefault.append(panelHeading);
	    var panelCollapse = $("<div></div>").attr({
	        "class": "panel-collapse collapse",
	        "id": "collapse" + collapseCount
	    });
	    panelCollapse.append(panelBody);
	    panelDefault.append(panelCollapse);
	    $("#orderReview").append(panelDefault);
	}

	function gobacktopage() {
	    $("#placeOrderForm").attr({
	        "action": "<%=request.getContextPath()%>/static/backButtonInstallationVO"
	    });
	    $('#placeOrderForm').submit();
	}
	
	function setCustomerDetails() {
		//$(".basePriceNoPromotion").hide();
		$(".basePricePromotion").hide();
	    $("#custName").text(orderReviewJson.firstName + " " + orderReviewJson.lastName);
	    $(".serviceAddressContent address:eq(0)").text(orderReviewJson.addr1);
	    $(".serviceAddressContent address:eq(1)").text(orderReviewJson.addr2);
	    var orderDate = new Date(orderReviewJson.fisrInstallDate);
        var orderInstallDate = new Date(orderReviewJson.secondInstallDate);
        console.log(orderInstallDate.toDateString())
        console.log(JSON.stringify(orderReviewJson))
        $("#ddLableValue").text(orderDate.toDateString()+", "+orderReviewJson.fisrInstallTime);
        $("#secondDateLabelValue").text(orderInstallDate.toDateString()+", "+orderReviewJson.secondInstallTime);
       // $(".basePriceNoPromotion").show();
	    $("table.priceTable tbody tr:eq(0) td:eq(1) span").text("$" + orderReviewJson.baseMonthlyWithOutPromotion.toFixed(2) + "/month");
	    if(orderReviewJson.billingDisclosure != undefined){
		    $(".billingDisclosure div.alert.alert-info").text(orderReviewJson.billingDisclosure);
	    }else {
	    	$(".billingDisclosure").hide();
	    }
	    if(orderReviewJson.baseMonthlyPromotion != undefined){
	    	$(".basePricePromotion").show();
	    	$("table.priceTable tbody tr:eq(1) td:eq(1) span").text("$" + orderReviewJson.baseMonthlyPromotion.toFixed(2) + "/month");
		}
	    $("table.priceTable tbody tr:eq(2) td:eq(1) span").text("$" + orderReviewJson.monthly.toFixed(2) + "/month");
	    $("table.priceTable tbody tr:eq(3) td:eq(1) span").text("$" + orderReviewJson.installationTotal.toFixed(2) + "/month");
	}
</script>
  
 </head>
 <body>
					<div id="left_sec_content">
						<div id="steps" class="row">
							<div id="step1" class="past-step"><span class="step_id">1</span><span class="step_title">Product<br/>Customization</span></div>
							<div id="step2" class="past-step"><span class="step_id">2</span><span class="step_title">Customer <br/>Information</span></div>
							<div id="step3" class="past-step"><span class="step_id">3</span><span class="step_title">Installation <br/>and Payment</span></div>
							<div id="step4" class="current-step"><span class="step_id">4</span><span class="step_title">Review and<br/> Place Order</span></div>
						</div>
						<div id="customizations" class="row">
							<div class="cust_title">Confirm your Order</div>
							<div class="next_step next" tabindex="0"><span id="nextStep">Place Your Order</span></div>
						</div>
						<div id="orderInfoContent" class="confirm-order-details">
							<div class="confirm-address">
									<span id="custName"> </span>
									<div class="serviceAddressContent">
										<b>Service Address:</b>
										<address>  </address>
										<address>  </address>
									</div>
							</div>
							<div class="confirm-dates">
								<span id="rdLabel">Requested Installation Dates: </span>
								<div class="serviceAddressContent">
									<span id="ddLable">Desired Date: </span>
									<span id="ddLableValue" class=""> </span>
									
								</div>
								<div class="serviceAddressContent">
									<span id="secondDateLabel">2nd Date: </span>
									<span id="secondDateLabelValue" class="">  </span>
									
								</div>								
							</div>
						
						</div>
						<!-- <div class="priceTableContent">
								
									<table class="priceTable">
										<thead>
											<tr>
												<th>Description</th>
												<th>Price</th>
												
											</tr>
											
										</thead>
									<tbody>
										
										<tr class="basePriceNoPromotion">
												<td>Base Monthly Price Without Promotion</td>
											<td><span></span>
												<div>Plus taxes/surcharges</div>
											</td>
											
											
											</tr>
											<tr class="basePricePromotion">
												<td >Base Monthly Price With Promotion</td>
												
												
												<td><span></span>
												<div>Plus taxes/surcharges</div>
											</td>
										</tr>
										<tr>
											<td>Monthly Total</td>
												
												<td><span></span>
												<div>Plus taxes/surcharges</div>
											</td>
										</tr>
										<tr>
											<td>Installation Total</td>
												<td><span></span>
												
											</td>
											</tr>
										</tbody>
									</table>
								</div> -->
								<div class="billingDisclosure"><div class="alert alert-info"></div></div>

						<div id="optionsgroup">
							<div class="panel-group" id="accordion">
                                <!-- <div  id="orderReview">
								</div> -->
							</div>
						</div>
						<div id="bottom-footer" class="row">
						<form method="post"	action="<%=request.getContextPath()%>/static/submitDigitalLineItem" name="placeOrderForm" id="placeOrderForm">
							<div class="prev_step" ><a id="gobacktopage" onclick="gobacktopage();">Back</a></div>
							<div class="next_step next" tabindex="0"><span id="nextStep">Place Your Order</span></div>
							<input id="monthlyTotal" name="monthlyTotal" value='${monthlyTotal}' type="hidden" />
							<input id="installationTotal" name="installationTotal" value='${installationTotal}' type="hidden" />
							<input id="lineitemNumber" name="lineitemNumber" value='${lineItemNumber}' type="hidden" />
							<input id="product_name" name="product_name" value='${product_name}' type="hidden" />
							<input id="provider_name" name="provider_name" value='${provider_name}' type="hidden" />
							<input id="orderID" name="orderID" value='${orderID}' type="hidden" />
							<input id="iData" name="iData" value='${iData}' type="hidden" />
						</form>
						</div>
					</div>
  
 </body>
</html>
 