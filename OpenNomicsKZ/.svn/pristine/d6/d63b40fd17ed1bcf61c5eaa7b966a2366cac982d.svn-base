$(document).ready(function() {
	appovalInfoLoad();
});

var map1;
var map2;
var view;

/**
 * 승인된 레이어를 가져온다.
 * @author seulgi.lee
 * @date 2016. 02.
 */
function appovalInfoLoad(){
	var rid = document.getElementById("rid").value;
	var tname = document.getElementById("tname").value;
	
	var url = "http://175.116.181.39:9990/geoserver/wms";
	var layer = tname+"_approval";
	var wms = createWmsLayer(url, layer);
	wms.setZIndex(1);
	map1.addLayer(wms);
	map2.addLayer(wms);
	
	var url=CONTEXT+"/chairman/appovalInfoLoad.ajax";
	var params ={
		rid : rid,
		tname : tname
	};
	sendJsonRequest(url, params, appovalInfoCallback);
}

/**
 * appovalInfoLoad의 반환 함수이다.
 * @author seulgi.lee
 * @date 2016. 02.
 * @param result - 검수전 레이어, 검수후 레이어, 오류리포트, 접수정보
 * @returns 
 */
function appovalInfoCallback(result){
	var qaPreLayer = result.qaPreLayer;
	var qaAftLayer = result.qaAftLayer;
	var errReport = result.errReports;
	var receiptVO = result.receiptVO;
	
	var allAccuracy = 0;
	$('#errTableBody > tr').remove();
	for ( var obj in errReport) {
		$('#errTableBody').append(
				"<tr>" + "<td>" + errReport[obj].type + "</td>" + "<td>" + errReport[obj].numOfItems 
						+ "</td>" + "<td>" + errReport[obj].numOfErr + "</td>" + "<td>"
						+ errReport[obj].ratioOfErr + "</td>" + "<td>" + errReport[obj].accuracy + "</td>"
						+ "<td>" + errReport[obj].weights + "</td>" + "<td>" + errReport[obj].weightedValue
						+ "</td>" + "</tr>");

		allAccuracy = allAccuracy + errReport[obj].weightedValue;
	}
	$('#errTableBody')
			.append(
					"<tr>"
							+ "<td colspan='7' align='center' style='vertical-align: top;'>(defined as the sum of weighted accuracy proportion * 100)&nbsp;"
							+ allAccuracy + "%</td>" + "</tr>");
	
	
	var info = "<tr>" + "<td scope='col' align='center' style='font-weight: bold' colspan='4'>" + "접수번호" + "</td>" +
			  "<td scope='col' align='center' colspan='3'>" + receiptVO.rid + "</td>" + "</tr>" +
			  "<tr>" + "<td scope='col' align='center' style='font-weight: bold' colspan='4'>" + "신청자" + "</td>" +
			  "<td scope='col' align='center' colspan='3'>" + receiptVO.uid + "</td>" + "</tr>" +
			  "<tr>" + "<td scope='col' align='center' style='font-weight: bold' colspan='4'>" + "소속" + "</td>" +
			  "<td scope='col' align='center' colspan='3'>" + receiptVO.utype + "</td>" + "</tr>" +
			  "<tr>" + "<td scope='col' align='center' style='font-weight: bold' colspan='4'>" + "작업명" + "</td>" +
			  "<td scope='col' align='center' colspan='3'>" + receiptVO.jname + "</td>" + "</tr>" +
			  "<tr>" + "<td scope='col' align='center' style='font-weight: bold' colspan='4'>" + "세부설명" + "</td>" +
			  "<td scope='col' align='center' colspan='3'>" + receiptVO.jcontent + "</td>" + "</tr>" +
			  "<tr>" + "<td scope='col' align='center' style='font-weight: bold' colspan='4'>" + "요청시간" + "</td>" +
			  "<td scope='col' align='center' colspan='3'>" + foo(receiptVO.cdate) + "</td>" + "</tr>";
			  
	$('#infoBody').append(info);
	
	var gjson1 = new ol.format.GeoJSON().readFeatures(qaPreLayer, {
		dataProjection : 'EPSG:4326',
		featureProjection : 'EPSG:3857'
	});
	
	var gjson2 = new ol.format.GeoJSON().readFeatures(qaAftLayer, {
		dataProjection : 'EPSG:4326',
		featureProjection : 'EPSG:3857'
	});
	
	var source1 = new ol.source.Vector({
		wrapX : false
	});

	source1.addFeatures(gjson1);
	
	var source2 = new ol.source.Vector({
		wrapX : false
	});

	source2.addFeatures(gjson2);
	
	var fill = new ol.style.Fill({
		color : 'rgba(255, 255, 255, 0.3)'
	});
	var stroke = new ol.style.Stroke({
		color : 'rgba(255, 0, 0, 0.8)',
		width : 2
	});
	var style = [ new ol.style.Style({
		image : new ol.style.Circle({
			fill : fill,
			stroke : stroke,
			radius : 5
		}),
		fill : fill,
		stroke : stroke
	}) ];
	
	var layer1 = new ol.layer.Vector({
		source: source1,
		style: style
	});
	var layer2 = new ol.layer.Vector({
		source: source2,
		style: style
	});
	
	setTwoLayer(layer1, layer2);
	
	view.fit(source1.getExtent(), map1.getSize());
}


/**
 * 검수전, 검수후 맵에 대한 정보를 입력한다.
 * @author seulgi.lee
 * @date 2016. 02.
 * @param trgt1 - 검수전 지도 div ID
 * @param trgt2 - 검수후 지도 div ID
 * @returns 
 */
function setSeparateMap(trgt1, trgt2) {
	var tile = new ol.layer.Tile({
		source : new ol.source.MapQuest({
			layer : 'osm'
		})
	});

	view = new ol.View({
		center : [ 0, 0 ],
		zoom : 1,
		projection : "EPSG:3857"
	});

	map1 = new ol.Map({
		target : trgt1,
		layers : [ tile ],
		view : view
	});

	map2 = new ol.Map({
		target : trgt2,
		layers : [ tile ],
		view : map1.getView()
	});
}


/**
* 검수전, 검수후 맵에 레이어를 추가한다.
* @author seulgi.lee
* @date 2016. 02.
* @param bfLayer - 검수 전 레이어
* @param afLayer - 검수 후 레이어
* @returns 
*/
function setTwoLayer(bfLayer, afLayer){
	bfLayer.setZIndex(2);
	afLayer.setZIndex(2);
	map1.addLayer(bfLayer);
	map2.addLayer(afLayer);
}

/**
* 지도가 이동할 때 검수전, 검수후 지도가 같이 움직인다.
* @author seulgi.lee
* @date 2016. 02.
* @param view - 보이는 화면의 View
* @param map - 보이는 화면의 Map
* @returns 
*/
function moveToSource(view, map){
	var layers = map.getLayers().getArray();
	for (var i = 0; i < layers.length; i++) {
		if (layers[i] instanceof ol.layer.Vector) {
			var source = layers[i].getSource();
			view.fit(source.getExtent(), map.getSize());		
		}
	}		
}

/**
* Wms레이어를 Geoserver에서 가져온다.
* @author seulgi.lee
* @date 2016. 02.
* @param url - Geoserver 주소
* @param layer - 레이어 이름
* @returns ol.layer.Image
*/
function createWmsLayer(url, layer) {

	var wmsSource = new ol.source.ImageWMS({
		url : url,
		params : {
			'LAYERS' : layer
		},
		serverType : 'geoserver'
	});

	var wmsLayer = new ol.layer.Image({
		source : wmsSource
	});

	return wmsLayer;
}

/**
* 최종승인을 한다.
* @author seulgi.lee
* @date 2016. 02.
*/
function onApprovalClick(){
	var rid = document.getElementById("rid").value;
	var url=CONTEXT+"/chairman/lastApproval.ajax";
	var params ={
		rid : rid
	};
	sendJsonRequest(url, params, onApprovalClickCallback);
}

/**
* onApprovalClick의 반환 함수이다.
* @author seulgi.lee
* @date 2016. 02.
* @param result - 요청결과
* @returns 
*/
function onApprovalClickCallback(result){
	if(result){
		showLastApprovalComplete();
	}
	else{
		alertPopup("알림","다시 시도해주세요.");
	}
}


/**
* 최종거절을 한다.
* @author seulgi.lee
* @date 2016. 02.
*/
function onDisApprovalClick(){
	var rid = document.getElementById("rid").value;
	var url=CONTEXT+"/chairman/lastDisApproval.ajax";
	var params ={
		rid : rid
	};
	sendJsonRequest(url, params, onDisApprovalCallback);
}


/**
* onDisApprovalClick의 반환 함수이다.
* @author seulgi.lee
* @date 2016. 02.
* @param result - 요청결과
* @returns 
*/
function onDisApprovalCallback(result){
	if(result){
		showLastDisApprovalComplete();
	}
	else{
		alertPopup("알림","다시 시도해주세요.");
	}
}