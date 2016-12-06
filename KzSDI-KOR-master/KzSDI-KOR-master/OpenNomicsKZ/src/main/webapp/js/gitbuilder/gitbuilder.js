/**
 * 공간정보 편집도구를 구성하는 함수를 정의한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
var errReport = null;
var crsrPosition = []; // 커서 위치
var projectGroup = {};
var clipboard = [];
var lid; // 설정 레이어

/* jQuery */
$(document).ready(
		function() {

			// 마우스 움직일때마다 좌표를 저장
			$(document).on("mousemove", function(event) {
				crsrPosition = [ event.pageX, event.pageY ];
			});

			var winSz = setMapDivSize();

			$("#errContent").css("width", winSz[0]).css("height", 0).css("background-color", "#ffffff").css(
					"visibility", "hidden");
			var centBtnPstn = winSz[0] / 2;

			$(".rptOpen").css("left", centBtnPstn);

			$("#closeReport").on("click", function() {
				$(this).css("visibility", "hidden");
				$("#errContent").css("height", 0).css("visibility", "hidden");
			});

			$("#openReport").on("click", function() {
				$("#errContent").css("height", 600).css("visibility", "visible").position({
					at : "right bottom",
					my : "right bottom",
					of : "#map"
				});
				$("#closeReport").css("visibility", "visible");

				$("#closeReport").position({
					at : "center top",
					my : "center top",
					of : "#errContent"
				});

				$("#rptTable").position({
					at : "left top+30",
					my : "left top",
					of : "#errContent"
				});
			});

			$(document).on("change", "#attrfx", function() {
				if ($(this).is(":checked")) {
					var layer = getLayerById(lid);
					$(this).parent().parent().after(showAttributeForFix(layer));

				} else {
					$("#fixInfo").remove();
				}
			});

		});

/**
 * 사용자가 선택한 스타일을 레이어에 적용한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Layer
 */
function applyLayerStyle(layer) {

	// layer = getLayerById(map.get("nowStyleEditingId"));

	// 레이어 타입 획득
	var layerType = layer.get("type");

	// 못찾으면 리턴
	if (layer === undefined) {
		console.log("선택된 레이어가 없습니다.");
		// console.log("선택된 레이어가 없습니다.");
		return;
	}
	var aTab = $("#tabs").tabs("option", "active");
	switch (aTab) {
	case 0:
		// 레이어 보이기 안보이기 체크박스가 체크되있다면
		if ($("input:checkbox[id='showOrHide']").is(":checked") === true) {
			// 해당 레이어를 보인다
			layer.setVisible(true);
		} else {
			// 해당 레이어를 숨긴다
			layer.setVisible(false);
		}
		break;
	case 1:
		// 레이어 보이기 안보이기 체크박스가 체크되있다면
		if ($("input:checkbox[id='showOrHideBase']").is(":checked") === true) {
			// 해당 레이어를 보인다
			layer.setVisible(true);
		} else {
			// 해당 레이어를 숨긴다
			layer.setVisible(false);
		}
		break;
	case 2:

		break;
	case 3:

		break;
	case 4:

		break;
	case 5:

		break;
	case 6:

		break;
	default:
		break;
	}

	// 레이어 이름을 변경한다
	layer.set("name", $("#layerName").val());

	if (layerType === "point" || layerType === "linestring" || layerType === "polygon" || layerType === "multipoint"
			|| layerType === "multilinestring" || layerType === "multipolygon") {
		// 컬러픽커에서 선택된 숫자를 조합해서 rgba코드로 변수에 저장

		var rgbaStringStroke = $("#strk").spectrum("get").toRgbString();
		rgbaStringStroke = rgbaStringStroke.trim().replace(/\s/gi, '');

		var rgbaStringFill = $("#fll").spectrum("get").toRgbString();
		rgbaStringFill = rgbaStringFill.trim().replace(/\s/gi, '');

		// 선의 두께를 저장
		var width = 0;
		if ($("#lnspnr").spinner("value") != null) {
			width = $("#lnspnr").spinner("value");
		}

		// 점의 크기를 저장
		var radius = 0;
		if ($("#ptspnr").spinner("value") != null) {
			radius = $("#ptspnr").spinner("value");
		}

		// 점의 표시타입을 선택
		var selectedMarker = $("input[type='radio'][name='markerType']:checked").val();

		var markerStyle;

		// 마커를 선택시
		if ($("#pointType").val() === "marker" && selectedMarker !== undefined) {
			// 마커스타일을 정의한다
			markerStyle = new ol.style.Icon({
				anchor : [ 0.5, 1 ],
				src : getContextPath() + "/js/gitbuilder/image/marker/" + selectedMarker
			});
			// 마커스타일 변수의 클래스타입을 아이콘으로 저장한다
			markerStyle.CLASS_TYPE = "ICON";
		} else {
			// 마커스타일을 정의한다
			markerStyle = new ol.style.Circle({
				radius : radius,
				fill : new ol.style.Fill({
					color : rgbaStringFill
				}),
				stroke : new ol.style.Stroke({
					color : rgbaStringStroke,
					width : width
				})
			});
			// 마커스타일 변수의 클래스타입을 서클로 저장한다
			markerStyle.CLASS_TYPE = "CIRCLE";
		}

		// 선택된 레이어의 스타일을 위에 정의한 스타일로 변경
		layer.setStyle(new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : rgbaStringStroke,
				width : width
			}),
			fill : new ol.style.Fill({
				color : rgbaStringFill
			}),
			image : markerStyle
		}));
	} else if (layerType === "tile") {
		var bType = $("#baseType").val();
		switch (bType) {
		case "osm":
			source = new ol.source.MapQuest({
				layer : "osm"
			});
			source.SOURCE_TYPE = "osm";
			break;
		case "bing":
			source = new ol.source.BingMaps({
				key : 'AtZS5HHiM9JIaF1cUX-x-zQT_97S8YkWkjxDowNNUGD1D8jWUtgVmdaxsiitNQbo',
				imagerySet : "Aerial"
			// use maxZoom 19 to see stretched tiles instead of the BingMaps
			// "no photos at this zoom level" tiles
			// maxZoom: 19
			});
			source.SOURCE_TYPE = "bing";
			break;
		case "arc":
			var attribution = new ol.Attribution({
				html : 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/'
						+ 'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
			});

			source = new ol.source.XYZ({
				attributions : [ attribution ],
				url : 'http://server.arcgisonline.com/ArcGIS/rest/services/'
						+ 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
			});
			source.SOURCE_TYPE = "arc";
			break;
		}
		layer.setSource(source);
	}

	// 레이어 리스트 업데이트 함수 실행
	updateLayerList(map);
}

// 레이어 스타일 창 정보출력
/**
 * 레이어의 스타일을 불러온다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function loadLayerStyle(layerId) {
	// 레이어 객체 획득
	var selectedLayer = getLayerById(layerId);

	// 못찾으면 리턴
	if (selectedLayer === undefined) {
		console.log("선택된 레이어가 없습니다.");
		return;
	}

	// 선택한 레이어 이름 출력
	$("#layerName").val(selectedLayer.get("name"));

	// 현재 스타일편집 중인 레이어 아이디를 맵객체 nowStyleEditingId키로 저장
	// map.set("nowStyleEditingId", selectedLayer.get("id"));

	// 레이어 이름 인풋태그에 readonly 속성 추가
	$("#layerName").prop("readonly", true).css("border", "none");

	// 레이어 타입 획득
	var layerType = selectedLayer.get("type");
	var layerStyle;
	switch (layerType) {
	case "point":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 0);
		$("#tabs").tabs("option", "active", 0);
		$("#ptType").prop("checked", true);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHide']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHide']").prop("checked", false);
		}

		layerStyle = selectedLayer.getStyle();
		setStyleWindow(layerType, layerStyle);
		$("#layerStyle").dialog("open");
		break;
	case "multipoint":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 0);
		$("#tabs").tabs("option", "active", 0);
		$("#ptType").prop("checked", true);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHide']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHide']").prop("checked", false);
		}

		layerStyle = selectedLayer.getStyle();
		setStyleWindow(layerType, layerStyle);
		$("#layerStyle").dialog("open");
		break;
	case "linestring":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 0);
		$("#tabs").tabs("option", "active", 0);
		$("#lsType").prop("checked", true);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHide']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHide']").prop("checked", false);
		}

		layerStyle = selectedLayer.getStyle();
		setStyleWindow(layerType, layerStyle);
		$("#layerStyle").dialog("open");
		break;
	case "multilinestring":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 0);
		$("#tabs").tabs("option", "active", 0);
		$("#lsType").prop("checked", true);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHide']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHide']").prop("checked", false);
		}

		layerStyle = selectedLayer.getStyle();
		setStyleWindow(layerType, layerStyle);
		$("#layerStyle").dialog("open");
		break;
	case "polygon":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 0);
		$("#tabs").tabs("option", "active", 0);
		$("#pgType").prop("checked", true);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHide']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHide']").prop("checked", false);
		}

		layerStyle = selectedLayer.getStyle();
		setStyleWindow(layerType, layerStyle);
		$("#layerStyle").dialog("open");
		break;
	case "multipolygon":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 0);
		$("#tabs").tabs("option", "active", 0);
		$("#pgType").prop("checked", true);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHide']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHide']").prop("checked", false);
		}

		layerStyle = selectedLayer.getStyle();
		setStyleWindow(layerType, layerStyle);
		$("#layerStyle").dialog("open");
		break;
	case "raster":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 5);
		$("#tabs").tabs("option", "active", 5);
		var alphaR = selectedLayer.getOpacity();
		$("#alphaR").slider("value", alphaR);
		break;
	case "tile":
		$("#tabs").tabs("disable");
		$("#tabs").tabs("enable", 1);
		$("#tabs").tabs("option", "active", 1);

		// 보이기 속성에 따라서
		if (selectedLayer.getVisible()) {
			// 보이기 체크
			$("input:checkbox[id='showOrHideBase']").prop("checked", true);
		} else {
			// 보이기 체크해제
			$("input:checkbox[id='showOrHideBase']").prop("checked", false);
		}

		var layerSource = selectedLayer.getSource();
		var sourceType;
		switch (layerSource.SOURCE_TYPE) {
		case "google":
			sourceType = "google";
			break;
		case "osm":
			sourceType = "osm";
			break;
		case "bing":
			sourceType = "bing";
			break;
		case "arc":
			sourceType = "arc";
			break;
		default:
			break;
		}

		$("#baseType").val(sourceType);
		$("#layerStyle").dialog("open");
		break;
	default:
		console.log("not supported type");
		break;
	}

	var strokeStyle;

	// 포인트 타입일때
	if (layerType === "point" || layerType === "multipoint") {
		if (layerStyle.getImage().CLASS_TYPE === "ICON") {

		} else if (layerStyle.getImage().CLASS_TYPE === "CIRCLE") {
			// 이미지 스타일의 스트로크 스타일을 획득
			strokeStyle = layerStyle.getImage().getStroke();
		}
	} else if (layerType === "linestring" || layerType === "polygon" || layerType === "multilinestring"
			|| layerType === "multipolygon") {
		// 그 이외에는 스타일 내부의 스트로크 스타일을 획득
		strokeStyle = layerStyle.getStroke();
	}

	if (strokeStyle !== undefined) {
		// 너비 출력
		$("#lnspnr").spinner("value", strokeStyle.getWidth());
	}

	// 레이어 타입에 따른 스타일 양식 변경
	if (layerType === "point") {
		// 포인트 양식으로 변경
		$("#pointStyle").css("display", "block");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "block");
		$("#typeRadio").css("display", "block");
		if (layerStyle.getImage().CLASS_TYPE === "ICON") {
			$("#pointType").val("marker");
			changePointType();
		} else if (layerStyle.getImage().CLASS_TYPE === "CIRCLE") {
			$("#pointType").val("dot");
			changePointType();
		}
	} else if (layerType === "linestring") {
		// 라인 스타일로 변경
		$("#pointStyle").css("display", "none");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "none");
	} else if (layerType === "polygon") {
		// 폴리곤 스타일로 변경
		$("#pointStyle").css("display", "none");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "block");
	} else if (layerType === "raster") {
		// 래스터 스타일로 변경
		$("#pointStyle").css("display", "none");
		$("#strokeStyle").css("display", "none");
		$("#fillStyle").css("display", "none");
	}

}

/**
 * ID를 통해 피처를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @return ol.Feature
 */
function getFeatureById(_id) {
	var layers = getSelectedLayers();
	if (layers.length === 1) {
		var layer = layers[0];
		var features = layer.getSource().getFeatures();
		for (var i = 0; i < features.length; i++) {
			if (features[i].getId() === _id) {
				return features[i];
			}
		}
	} else {
		console.log("choose one layer");
	}
}

/**
 * 레이어ID와 피처ID를 통해 피처를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @return ol.Feature
 */
function getFeatureById2(_layerId, _id) {
	var layer = getLayerById(_layerId);

	var features = layer.getSource().getFeatures();
	for (var i = 0; i < features.length; i++) {
		if (features[i].getId() === _id) {
			return features[i];
		}
	}
}

/**
 * 레이어 목록으로 사용되는 jQuery UI Sortable과 Selectable을 초기화 한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function selectableInit() {
	$("#layerList").sortable({
		handle : ".handle",
		stop : function(event, ui) {
			// 선택한 li의 배열
			var layerLiArr = $("#layerList li").toArray();
			// 배열을 뒤집는다
			layerLiArr.reverse();
			// 모든 레이어 획득
			var layers = map.getLayers();
			// 모든 레이어를 배열로 획득
			var addedLayers = layers.getArray();

			for (var i = 0; i < layerLiArr.length; i++) {
				// 레이어 아이디와 같은 레이어를 검색
				for (var j = 0; j < addedLayers.length; j++) {
					// li의 아이디가 레이어의 아이디와 같다면
					if (addedLayers[j].get("id") === $(layerLiArr[i]).attr("id")) {
						if (addedLayers[j] instanceof ol.layer.Group) {
							addedLayers[j].setZIndex(i);
							var layers = addedLayers[j].getLayers().getArray();
							for (var k = 0; k < layers.length; k++) {
								layers[k].setZIndex(i);
							}
						} else {
							// li의 인덱스를 레이어의 인덱스로 설정
							addedLayers[j].setZIndex(i);
							break;
						}
					}
				}
			}
		}
	}).addClass("layerSelectable").selectable(
			{
				filter : "li",
				cancel : ".handle, .layerPropBtn",
				stop : function(event, ui) {

					// ul 객체를 저장
					var p1 = $(this);

					// 선택한 li들의 객체배열을 획득
					var selected = $(".layerSelectable .ui-selected");

					// 모든 레이어 획득
					var allLayers = map.getLayers().getArray();

					// 모든 레이어를 비선택으로 설정
					for (var i = 0; i < allLayers.length; i++) {
						allLayers[i].set("selected", 0);
					}

					// 각각의 li마다
					selected.each(function() {
						// li의 부모를 획득
						var p2 = $(this).parent();
						// 같은 부모의 자식이라면
						if (p1.get(0) === p2.get(0)) {
							// selectable에서 선택한 아이디를 가진 레이어 객체획득
							var selectedLayer = getLayerById($(this).attr("id"));
							// 선택여부를 1로 설정
							selectedLayer.set("selected", 1);
						} else {
							// 아니라면 메시지 출력
							console.log("it isn't a descendant");
						}
					});
					// 선택한 레이어 객체들 획득
					var selected = getSelectedLayers();

					// 선택한 레이어가 2개 이상이면
					if (selected.length > 1) {
						// 레이어 이름 배열로 초기화
						var layerNames = [];
						// 선택된 레이어들의 이름을 배열에 추가
						for (var i = 0; i < selected.length; i++) {
							layerNames.push(selected[i].get("name"));
						}
						// 레이어 이름들을 다이얼로그에 출력
						$("#drawTool").dialog("option", "title", "Tool - " + layerNames);
						// 다중레이어 선택으로 도구모음을 연다
						openToolBox("multiplex");

						$("#featureList").empty();

						// 선택한 레이어가 1개라면
					} else if (selected.length === 1) {

						var layer = selected[0];
						if (layer.get("editable") === false) {
							disabledTool();
						} else {
							enabledTool();
						}

						var view = map.getView();

						if (layer instanceof ol.layer.Image) {
							view.fit(layer.getExtent(), map.getSize());
						} else if (layer instanceof ol.layer.Vector) {
							var source = layer.getSource();
							var features = source.getFeatures();
							if (features.length > 0) {
								view.fit(source.getExtent(), map.getSize());
							}
						} else if (layer instanceof ol.layer.Group) {
							var layers = layer.getLayers().getArray();
							for (var i = 0; i < layers.length; i++) {
								if (layers[i] instanceof ol.layer.Tile) {
									view.fit(layers[i].getExtent(), map.getSize());
								}
							}
						}
						// 레이어 이름을 저장
						var layerNames = selected[0].get("name");

						// 선택한 레이어가 베이스맵이 아니라면
						if (selected[0].get("type") === "point" || selected[0].get("type") === "linestring"
								|| selected[0].get("type") === "polygon" || selected[0].get("type") === "multipoint"
								|| selected[0].get("type") === "multilinestring"
								|| selected[0].get("type") === "multipolygon") {

							// 레이어 이름 출력
							$("#drawTool").dialog("option", "title", "Tool - " + layerNames);
							// 레이어 타입에 따른 도구모음을 연다
							openToolBox(selected[0].get("type"));
							if (selected[0].get("cat") === 2) {
								openToolBox("error");
							}
							var layers = getSelectedLayers();
							if (layers.length === 1 && layers[0] instanceof ol.layer.Vector) {
								$("#featureList").empty();
								var features = layers[0].getSource().getFeatures();
								for (var i = 0; i < features.length; i++) {
									var str = '<li class="ui-widget-content" id="' + features[i].getId()
											+ '" style="padding: 3px;">' + features[i].getId() + '</li>';
									$("#featureList").append(str);
								}

								$("#featureList").selectable({
									start : function(event, ui) {
										selectedFeatures = new ol.Collection();
									},
									selected : function(event, ui) {

										var id = ui.selected.id;
										var feature = getFeatureById(id);
										selectedFeatures.push(feature);

									},
									stop : function(event, ui) {

										var view = map.getView();
										var source = new ol.source.Vector();
										source.addFeatures(selectedFeatures.getArray());
										view.fit(source.getExtent(), map.getSize());

										removeMyInteraction(map);

										if (selectedFeatures.getLength() > 0) {

											popFeatureDialog(selectedFeatures.getArray());
											$("#selectPopUp").dialog("option", "position", {
												my : "right top",
												at : "right-310px top",
												of : $("#map")
											});

											var selectLayers = getSelectedLayers();
											if (selectedFeatures.getLength() > 0 && selectLayers.length > 1) {
												$("#dlet").button("disable");
											}

											if (selectedFeatures.getLength() === 1) {
												var layers = getSelectedLayers();
												if (layers.length === 1) {
													if (layers[0].get("cat") === 2) {
														$("#cpy").button("disable");
														$("#attr").button("disable");
														$("#dlet").button("enable");
														$("#mdfy").button("enable");
														$("#move").button("enable");
													} else {
														$("#cpy").button("enable");
														$("#attr").button("enable");
														$("#dlet").button("enable");
														$("#mdfy").button("enable");
														$("#move").button("enable");
													}
												}

												var feature = selectedFeatures.item(0);
												var str = getSimpleProperties(feature);
												$("#viewAttr").empty();
												$("#viewAttr").append(str);

												var keys = feature.getKeys();
												var features1 = selected[0].getSource().getFeatures();
												var keys = features1[0].getKeys();
												var flag = true;
												if (selectLayers.length === 1) {
													if (selectLayers[0].get("cat") === 2) {
														flag = false;
													}
												} else {

												}
												if (flag) {

													var featureId = feature.getId();
													var layerId = featureId.substring(0, featureId.indexOf("."));
													// console.log(layerId);
													layerId = layerId.trim();
													var layer = getLayerById(layerId);
													var layers = [ layer ];
													var collFeatures = new ol.Collection();
													var theFeature = getFeatureById2(layerId, featureId);
													collFeatures.push(theFeature);
													updateSelectInteraction2(layers, collFeatures, map);

													$("#deleteConfirmFeature").dialog({
														autoOpen : false,
														modal : true,
														buttons : {
															"확인" : function() {
																removeSelectedFeature(layer, collFeatures);
																$(this).dialog("close");
															},
															"취소" : function() {
																$(this).dialog("close");
															}
														}
													});

												} else if (!flag) {
													var featureId = feature.get("errfeatureID");
													// var featureId =
													// "layer1.1";
													var layerId = featureId.substring(0, featureId.indexOf("."));
													// console.log(layerId);
													layerId = layerId.trim();
													var layer = getLayerById(layerId);
													var layers = [ layer ];
													var collFeatures = new ol.Collection();
													var theFeature = getFeatureById2(layerId, featureId);
													collFeatures.push(theFeature);
													// updateSelectInteraction2(null,
													// null, map);
													updateSelectInteraction2(layers, collFeatures, map);

													$("#deleteConfirmFeature").dialog({
														autoOpen : false,
														modal : true,
														buttons : {
															"확인" : function() {
																removeSelectedFeature(layer, collFeatures);
																$(this).dialog("close");
															},
															"취소" : function() {
																$(this).dialog("close");
															}
														}
													});

												}

											} else if (selectedFeatures.getLength() > 1) {

												// //////////////////////////////
												var flag = true;
												if (selectLayers.length === 1) {
													if (selectLayers[0].get("cat") === 2) {
														flag = false;
													}
												} else {

												}
												if (flag) {

													var collFeatures = new ol.Collection();
													var layers;

													for (var i = 0; i < selectedFeatures.getLength(); i++) {
														var featureId = selectedFeatures.item(i).getId();
														var layerId = featureId.substring(0, featureId.indexOf("."));
														// console.log(layerId);
														layerId = layerId.trim();
														var layer = getLayerById(layerId);
														layers = [ layer ];
														var theFeature = getFeatureById2(layerId, featureId);
														collFeatures.push(theFeature);
													}

													updateSelectInteraction2(layers, collFeatures, map);

													$("#deleteConfirmFeature").dialog({
														autoOpen : false,
														modal : true,
														buttons : {
															"확인" : function() {
																removeSelectedFeature(layer, collFeatures);
																$(this).dialog("close");
															},
															"취소" : function() {
																$(this).dialog("close");
															}
														}
													});

												} else if (!flag) {

													var collFeatures = new ol.Collection();
													var layers;

													for (var i = 0; i < selectedFeatures.getLength(); i++) {
														var featureId = selectedFeatures.item(i).get("errfeatureID");
														var layerId = featureId.substring(0, featureId.indexOf("."));
														// console.log(layerId);
														layerId = layerId.trim();
														var layer = getLayerById(layerId);
														layers = [ layer ];
														var theFeature = getFeatureById2(layerId, featureId);
														collFeatures.push(theFeature);
													}

													updateSelectInteraction2(layers, collFeatures, map);

													$("#deleteConfirmFeature").dialog({
														autoOpen : false,
														modal : true,
														buttons : {
															"확인" : function() {
																removeSelectedFeature(layer, collFeatures);
																$(this).dialog("close");
															},
															"취소" : function() {
																$(this).dialog("close");
															}
														}
													});

												}

												// /////////////////////////////

												var layers = getSelectedLayers();
												if (layers.length === 1) {
													if (layers[0].get("cat") === 2) {
														$("#cpy").button("disable");
														$("#attr").button("disable");
														$("#dlet").button("disable");
														$("#mdfy").button("disable");
														$("#move").button("disable");
													} else {
														$("#cpy").button("enable");
														$("#attr").button("disable");
														$("#dlet").button("enable");
														$("#mdfy").button("enable");
														$("#move").button("enable");
													}
												}
											}

											$("#selectPopUp").dialog("open");
										}
									}
								});

							}
						} else {
							$("#drawTool").dialog("close");
						}

					} else {
						// 도구모음창을 닫는다
						$("#drawTool").dialog("close");
					}
					// 편집도구모음창을 닫는다
					$("#selectPopUp").dialog("close");
					// 인터랙션을 삭제한다
					removeMyInteraction(map);
				}
			}).find("li").addClass("ui-corner-all").prepend(
			"<span class='handle'><span class='ui-icon ui-icon-carat-2-n-s' style='top:50%;'></span></span>");
}

/**
 * RGB 색상코드를 16진수 색상코드로 변환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @param String
 * @return String
 */
function hexFromRGB(r, g, b) {
	// 받아온 파라미터를 16진수로 변환한다
	var hex = [ r.toString(16), g.toString(16), b.toString(16) ];
	// 각각의 16진수의 길이가 1이라면 0을 추가해 2자리로 만든다
	$.each(hex, function(nr, val) {
		if (val.length === 1) {
			hex[nr] = "0" + val;
		}
	});
	// 16진수 rgb코드를 반환한다
	return hex.join("").toUpperCase();
}

/**
 * 16진수 색상코드를 RGB 색상코드로 변환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @return String
 */
function decimalFromHex(hex) {
	// r코드 획득
	var first = hex.substring(0, 2);
	var firstDeci = parseInt(first, 16);

	// g코드 획득
	var second = hex.substring(2, 4);
	var secondDeci = parseInt(second, 16);

	// b코드 획득
	var third = hex.substring(4, 6);
	var thirdDeci = parseInt(third, 16);

	// 합친후 반환
	var deciArr = [ firstDeci, secondDeci, thirdDeci ];
	return deciArr.join("-");
}

/**
 * 유일한 레이어 ID를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return String
 */
function createLayerId() {
	var layers = map.getLayers().getArray();

	if (layers.length > 0) {
		var max = 1;
		for (var i = 0; i < layers.length; i++) {
			var lid = layers[i].get("id");
			var num = parseInt(lid.substring(lid.indexOf("layer") + 5));
			if (num > max) {
				max = num;
			} else {
				continue;
			}
		}
		max++;
		var layerId = "layer" + max;
		return layerId;
	} else if (layers.length === 0) {
		var layerId = "layer1";
		return layerId;
	}
}

/**
 * 지도와 목록상에서 레이어를 삭제한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Layer
 */
function removeLayerOnList(layer) {
	// 선택한 레이어가 없으면
	if (layer.length === 0) {
		// 메시지 출력
		console.log("choose a layer");
		return;
	}
	// 모든 레이어 획득
	var addedLayers = map.getLayers().getArray();

	// 선택한 레이어마다
	$(layer).each(function() {
		// 모든 레이어와 비교해서
		for (var i = 0; i < addedLayers.length; i++) {
			// 선택한 레이어와 같으면
			if (addedLayers[i].get("id") === this.get("id")) {
				// 삭제
				map.removeLayer(addedLayers[i]);
				break;
			}
		}
	});
	// 레이어 리스트 업데이트
	updateLayerList(map);
}

/**
 * RGBA색상코드를 만든다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @param String
 * @param String
 * @return String
 */
function makeOlColorObj(r, g, b, a) {
	var rgbaString = "rgba(" + r + "," + g + "," + b + "," + a + ")";
	rgbaString = rgbaString.trim().replace(/\s/gi, '');
	return rgbaString;
}

/**
 * 스타일 객체를 만든다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param ol.Color
 * @param ol.Color
 * @param String
 * @param String
 * @return ol.style.Style
 */
function makeOlStyleObj(type, colorStroke, colorFill, width, radius) {
	if (type === "circle") {
		var markerStyle = new ol.style.Circle({
			radius : radius,
			stroke : new ol.style.Stroke({
				color : colorStroke,
				width : width
			}),
			fill : new ol.style.Fill({
				color : colorFill
			})
		});
		markerStyle.CLASS_TYPE = "CIRCLE";
		return markerStyle;

	} else if (type === "icon") {
		var selectedMarker = $("input[type='radio'][name='markerType']:checked").val();
		var markerStyle = new ol.style.Icon({
			anchor : [ 0.5, 1 ],
			src : getContextPath() + "/js/gitbuilder/image/marker/" + selectedMarker
		});
		markerStyle.CLASS_TYPE = "ICON";
		return markerStyle;

	} else if (type === "stroke") {
		var stroke = new ol.style.Stroke({
			color : colorStroke,
			width : width
		});
		return stroke;

	} else if (type === "fill") {
		var fill = new ol.style.Fill({
			color : colorFill
		})
		return fill;
	}
}

/**
 * 사용자가 선택한 스타일정보를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function getUserSelectStyle() {
	var vectorStyle;

	var type = "";
	// 선택한 레이어 타입을 획득
	var selected = $("input[type='radio'][name='lType']:checked");
	if (selected.length > 0 && selected.length === 1) {
		type = selected.val();
	}

	// 포인트 레이어 생성시 스타일
	if (type === "point" || type === "multipoint") {

		// 점의 표시타입을 선택
		var selectedMarker = $("input[type='radio'][name='markerType']:checked").val();

		// 마커 일때
		if ($("#pointType").val() === "marker" && selectedMarker !== undefined) {
			// 아이콘 스타일로 초기화
			vectorStyle = new ol.style.Style({
				image : makeOlStyleObj("icon", null, null, null, null)
			});
			// 도트일때
		} else if ($("#pointType").val() === "dot") {

			var colorObjS = $("#strk").spectrum("get").toRgbString();

			var colorObjF = $("#fll").spectrum("get").toRgbString();

			var width = 0;
			if ($("#lnspnr").spinner("value") != null) {
				width = $("#lnspnr").spinner("value");
			}

			var radius = 0;
			if ($("#ptspnr").spinner("value") != null) {
				radius = $("#ptspnr").spinner("value");
			}
			// 선택한 스타일로 서클스타일 초기화
			vectorStyle = new ol.style.Style({
				image : makeOlStyleObj("circle", colorObjS, colorObjF, width, radius)
			});
		}
		// 라인스트링 레이어 생성시
	} else if (type === "linestring" || type === "multilinestring") {

		var colorObjS = $("#strk").spectrum("get").toRgbString();

		var width = 0;
		if ($("#lnspnr").spinner("value") != null) {
			width = $("#lnspnr").spinner("value");
		}
		// 스트록 스타일 초기화
		vectorStyle = new ol.style.Style({
			stroke : makeOlStyleObj("stroke", colorObjS, null, width, null)
		});
		// 폴리곤 레이어 생성시
	} else if (type === "polygon" || type === "multipolygon") {

		var colorObjS = $("#strk").spectrum("get").toRgbString();

		var colorObjF = $("#fll").spectrum("get").toRgbString();

		var width = 0;
		if ($("#lnspnr").spinner("value") != null) {
			width = $("#lnspnr").spinner("value");
		}
		// 스트록, 필 스타일 초기화
		vectorStyle = new ol.style.Style({
			stroke : makeOlStyleObj("stroke", colorObjS, null, width, null),
			fill : makeOlStyleObj("fill", null, colorObjF, null, null)
		});

	}
	var resultArr = [ type, vectorStyle ];
	return resultArr;
}

/**
 * 벡터 레이어를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.source.Vector
 * @param ol.style.Style
 * @return ol.layer.Vector
 */
function createVectorLayer(originSource, originStyle) {
	var layer;

	var source = originSource;
	// 소스 파라미터가 비어있다면 빈소스로 초기화
	if (source === null || source === undefined) {
		source = new ol.source.Vector({
			wrapX : false
		});
	}
	var style = originStyle;
	if (style === null || style === undefined) {
		var fill = new ol.style.Fill({
			color : 'rgba(0, 0, 255, 0.7)'
		});
		var stroke = new ol.style.Stroke({
			color : 'rgba(0, 0, 255, 0.7)',
			width : 1.25
		});
		var text = new ol.style.Text({});
		var styles = [ new ol.style.Style({
			image : new ol.style.Circle({
				fill : fill,
				stroke : stroke,
				radius : 5
			}),
			fill : fill,
			stroke : stroke,
			text : text
		}) ];

		style = styles;
	}

	layer = new ol.layer.Vector({
		source : source,
		style : style
	});

	return layer;
}

/**
 * 배경지도로 사용될 타일 맵을 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @return ol.layer.Tile
 */
function createBaseTileLayer(baseType) {
	// var bType = $("#baseType").val();
	var source;
	switch (baseType) {
	case "google":

		break;
	case "osm":
		source = new ol.source.MapQuest({
			layer : "osm"
		});
		source.SOURCE_TYPE = "osm";
		break;
	case "bing":
		source = new ol.source.BingMaps({
			key : 'AtZS5HHiM9JIaF1cUX-x-zQT_97S8YkWkjxDowNNUGD1D8jWUtgVmdaxsiitNQbo',
			imagerySet : "Aerial"
		// use maxZoom 19 to see stretched tiles instead of the BingMaps
		// "no photos at this zoom level" tiles
		// maxZoom: 19
		});
		source.SOURCE_TYPE = "bing";
		break;
	case "arc":
		var attribution = new ol.Attribution({
			html : 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/'
					+ 'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
		});

		source = new ol.source.XYZ({
			attributions : [ attribution ],
			url : 'http://server.arcgisonline.com/ArcGIS/rest/services/' + 'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
		});
		source.SOURCE_TYPE = "arc";
		break;
	}

	var layer;
	layer = new ol.layer.Tile({
		source : source
	});

	return layer;
}

/**
 * 새로운 WMS 레이어를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @return ol.layer.Image
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
 * WMTS 레이어를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @param Array
 * @return ol.layer.Tile
 */
function createWmsTileLayer(url, layer, nbBox) {

	var tileLayer = new ol.layer.Tile({
		extent : nbBox,
		source : new ol.source.TileWMS({
			url : url,
			params : {
				'LAYERS' : layer,
				'TILED' : true
			},
			serverType : 'geoserver'
		})
	})
	return tileLayer;
}

/**
 * 레이어 스타일 설정정보 적용
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @param ol.style.Style
 * @return ol.layer.Vector
 */
function createWfsLayer(url, name, style) {
	var xtnt = map.getView().calculateExtent(map.getSize());
	var trnsXtnt = ol.proj.transformExtent(xtnt, "EPSG:3857", "EPSG:4326");
	var prmt = {
		service : "WFS",
		version : "1.0.0",
		request : "GetFeature",
		typename : "kaz:kz_astana_water",
		outputFormat : "application/json",
		srsname : "EPSG:4326",
		bbox : trnsXtnt.join(",")
	};

	var str = $.param(prmt);
	var loc = "http://175.116.181.39:9990/geoserver/wfs?";

	loc += str;

	var obj = {
		url : loc
	};
	console.log(loc);
	str = $.param(obj);

	var cntr = getContextPath() + '/geoserver/proxy.ajax';

	var vectorSource = new ol.source.Vector();

	var features;

	$.ajax({
		async : false,
		url : cntr,
		type : "post",
		dataType : "json",
		beforeSend : function() { // 호출전실행
			loadImageShow();
		},
		data : obj,

		success : function(data, textStatus, jqXHR) {
			loadImageHide();
			// var result = JSON.parse(data);
			// console.log(JSON.stringify(data));
			// var str = JSON.stringify(result);

			var id = createLayerId();

			var features = new ol.format.GeoJSON().readFeatures(data, {
				dataProjection : 'EPSG:4326',
				featureProjection : 'EPSG:3857'
			});

			vectorSource.addFeatures(features);

		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	});

	var layer = new ol.layer.Vector({
		source : vectorSource,
		style : style
	});

	return layer;
}

/**
 * 그룹 레이어를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <ol.layer.Layer>
 * @return ol.layer.Group
 */
function createGroupLayer(layers) {

	if (layers.length >= 2) {
		var layer = new ol.layer.Group({
			layers : layers
		});

		return layer;
	} else {
		console.log("choose two or more layers");
	}
}

/**
 * 레이어를 그룹 레이어에 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Group
 * @param Array
 *            <ol.layer.Layer>
 */
function addLayerToGroup(group, layers) {

	var childLayers = group.getLayers();
	for (var i = 0; i < layers.length; i++) {
		childLayers.push(layers[i]);
	}
	group.setLayers(childLayers);
}

/**
 * 레이어에 속성정보를 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Layer
 * @param String
 * @param String
 * @param String
 * @param String
 * @param Number
 * @param Boolean
 * @param Object
 * @return ol.layer.Base
 */
function setLayerProperties(layer, name, id, type, from, cat, edit, attrType) {
	// 레이어의 갯수만큼의 인덱스를 부여(새로만든 레이어는 최상위로 보여진다)
	layer.setZIndex(map.getLayers().getLength());
	// 레이어 이름 부여
	layer.set("name", name);
	// 레이어 아이디 부여
	layer.set("id", id);
	// 선택한 타입을 부여
	layer.set("type", type);
	// 선택여부를 부여
	layer.set("selected", 0);
	// 레이어 저장위치 부여(디비인지 새로운 레이어인지 또는 파일인지)
	layer.set("from", from);
	// 검수결과 레이어인지
	layer.set("cat", cat);
	// 수정 가능한 레이어인지
	layer.set("editable", edit);

	// 애트리뷰트 설정
	if (attrType !== null && attrType !== undefined) {
		// 레이어 애트리뷰트 타입 부여
		layer.set("attribute", attrType);
	}
	// // 타입체인 설정
	// if (typeChain !== null || typeChain !== undefined) {
	// layer.set("typeChain", typeChain);
	// }
	// 레이어를 반환
	return layer;
}

/**
 * 레이어를 지도와 목록에 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Base
 */
function addLayerOnList(createdLayer) {
	if (createdLayer !== null || createdLayer !== undefined) {
		map.addLayer(createdLayer);
	} else {
		console.log("Layer is not created");
	}

	setApprovalLayer(createdLayer);
	updateLayerList(map);
	removeMyInteraction(map);
}

/**
 * 레이어 목록을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function updateLayerList(map) {

	var layers = map.getLayers();

	var addedLayers = layers.getArray();

	addedLayers.sort(function(a, b) {
		return a.getZIndex() < b.getZIndex() ? -1 : a.getZIndex() > b.getZIndex() ? 1 : 0;
	});

	$("#layerList").empty();
	for (var i = 0; i < addedLayers.length; i++) {

		var layerKeysStr = "";
		layerKeysStr += "<li id='" + addedLayers[i].get("id") + "' class='layerLi'><p class='ListedLayer'>"
				+ addedLayers[i].get("name") + "</p><button class='layerPropBtn'>Properties</button></li>";

		$("#layerList").prepend(layerKeysStr);

	}
	$(".ListedLayer").css("display", "inline-block").css("width", 160).css("height", 16).css("text-overflow",
			"ellipsis");
	$(".layerPropBtn").button({
		icons : {
			primary : "ui-icon-gear",
		},
		text : false
	});

	selectableInit();
}

/**
 * 피처를 복사한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <ol.Feature>
 */
function copyFeature(features) {
	for (var i = 0; i < features.length; i++) {
		clipboard.push(features[i].clone());
	}
}

/**
 * 복사한 피처를 붙여 넣는다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 */
function pasteFeature(layer) {
	var layerType = layer.get("type");
	switch (layerType) {
	case "point":

		for (var i = 0; i < clipboard.length; i++) {
			var feature = clipboard[i];
			if (feature.getGeometry() instanceof ol.geom.Point) {
				feature = createFeatureID(layer, feature);
				layer.getSource().addFeature(feature);
			}
		}

		break;

	case "linestring":

		for (var i = 0; i < clipboard.length; i++) {
			var feature = clipboard[i];
			if (feature.getGeometry() instanceof ol.geom.LineString) {
				feature = createFeatureID(layer, feature);
				layer.getSource().addFeature(feature);
			}
		}

		break;

	case "polygon":
		for (var i = 0; i < clipboard.length; i++) {
			var feature = clipboard[i];
			if (feature.getGeometry() instanceof ol.geom.Polygon) {
				feature = createFeatureID(layer, feature);
				layer.getSource().addFeature(feature);
			}
		}

		break;

	case "multipoint":
		for (var i = 0; i < clipboard.length; i++) {
			var feature = clipboard[i];
			if (feature.getGeometry() instanceof ol.geom.MultiPoint) {
				feature = createFeatureID(layer, feature);
				layer.getSource().addFeature(feature);
			}
		}

		break;

	case "multilinestring":
		for (var i = 0; i < clipboard.length; i++) {
			var feature = clipboard[i];
			if (feature.getGeometry() instanceof ol.geom.MultiLineString) {
				feature = createFeatureID(layer, feature);
				layer.getSource().addFeature(feature);
			}
		}

		break;
	case "multipolygon":
		for (var i = 0; i < clipboard.length; i++) {
			var feature = clipboard[i];
			if (feature.getGeometry() instanceof ol.geom.MultiPolygon) {
				feature = createFeatureID(layer, feature);
				layer.getSource().addFeature(feature);
			}
		}

		break;

	default:
		break;
	}

	clipboard = new Array();
}

/**
 * 레이어 스타일 창의 확인버튼을 상황에 따라 변경한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function changeBtnFntn(cond) {
	$("#layerStyle").dialog({
		autoOpen : false,
		modal : true
	});
	// 수정
	if (cond === "1") {

		$("input[type='radio'][name='lType']").prop("disabled", true);
		$("#layerName").prop("readonly", true).css("border", "none").css("width", 300);
		$(".onlyEdit").css("display", "inline");
		$("#layerStyle").dialog({
			buttons : {
				"확인" : function() {
					// console.log($("#tabs
					// .ui-tabs-panel:visible").attr("id"));
					// var layers = getSelectedLayers();
					// if (layers.length === 1) {
					// console.log(layers[0].get("id"));
					// applyLayerStyle(layers[0]);
					// }

					var layer = getLayerById(lid);
					applyLayerStyle(layer);
					$(this).dialog("close");
				},
				"취소" : function() {
					$(this).dialog("close");
				}
			}
		});
		// 새로 만들기
	} else if (cond === "2") {
		$("#tabs").tabs("enable");
		// 벡터 새로만들기 폼 초기화
		$("#typeRadio").css("display", "block");
		$("input[type='radio'][name='lType']").prop("disabled", false);
		$("#ptType").prop("checked", true);
		$("#layerName").prop("readonly", false).css("border", "1px solid #e3e3e3").css("width", 350);
		$("#layerName").val(createLayerId());

		$("#pointType").val("dot");
		changePointType();
		$("#lnspnr").spinner("value", 1);
		$("#ptspnr").spinner("value", 5);

		$(".onlyEdit").css("display", "none");

		$("#layerStyle").dialog({
			buttons : {
				"확인" : function() {
					var creatingLayer = $("#tabs").tabs("option", "active");

					var name = $("#layerName").val();

					var id = createLayerId();

					switch (creatingLayer) {
					case 0:
						var style = getUserSelectStyle();
						var layer = createVectorLayer(null, style[1]);
						layer = setLayerProperties(layer, name, id, style[0], "new", 1, true, undefined);
						addLayerOnList(layer);
						break;
					case 1:
						var type = $("#baseType").val();
						var layer = createBaseTileLayer(type);
						layer = setLayerProperties(layer, type + " base " + id, id, "tile", "new", 1, false, null);
						addLayerOnList(layer);
						break;
					case 2:
						fileUploadAjax("/file/upShpFile.ajax");
						break;
					default:
						break;
					}

					$(this).dialog("close");
				},
				"취소" : function() {
					$(this).dialog("close");
				}
			}
		});
	} else {
		console.log("invalid parameter");
	}
}

/**
 * 새로운 레이어 생성 창을 표시한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function newLayerWindow() {
	changeBtnFntn("2");

	$("#layerStyle").dialog("open");
}

/**
 * 점의 표시 형식에 따라 입력창의 표시여부를 변경
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function changePointType() {
	if ($("#pointType").val() === "dot") {
		$(".circleTab").css("display", "block");
		$("#iconTab").css("display", "none");
		$("#pointStyle").css("display", "block");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "block");
	} else if ($("#pointType").val() === "marker") {
		$(".circleTab").css("display", "none");
		$("#iconTab").css("display", "block");
		$("#pointStyle").css("display", "block");
		$("#strokeStyle").css("display", "none");
		$("#fillStyle").css("display", "none");
		// $("#fillColorTab").css("display", "none");
		// $(".circleTab").css("display", "block");
	} else {
		console.log("no selected type");
	}
}

/**
 * 지도상의 모든 벡터 레이어를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 * @return Array<ol.layer.Vector>
 */
function getAllVectorLayers(map) {
	var layers = map.getLayers().getArray();
	var vectorLayers = new Array();
	for (var i = 0; i < layers.length; i++) {
		if (layers[i] instanceof ol.layer.Vector
				&& (layers[i].get("type") === "point" || layers[i].get("type") === "linestring"
						|| layers[i].get("type") === "polygon" || layers[i].get("type") === "multipoint"
						|| layers[i].get("type") === "multilinestring" || layers[i].get("type") === "multipolygon")) {
			vectorLayers.push(layers[i]);
		}
	}

	if (apprvlLyr instanceof ol.layer.Vector) {
		vectorLayers.push(apprvlLyr);
	}

	return vectorLayers;
}
var source;

/**
 * 레이어의 모든 피처를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <ol.layer.Vector>
 * @return ol.source.Vector
 */
function getAllFeatures(layers) {
	source = new ol.source.Vector();
	for (var i = 0; i < layers.length; i++) {
		source.addFeatures(layers[i].getSource().getFeatures());
	}
	return source;
}

var draw; // global so we can remove it later
var snap;

/**
 * Draw 인터랙션을 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param ol.Map
 */
function addDrawInteraction(value, map) {
	var layers = getSelectedLayers();
	if (layers.length !== 1) {
		console.log("choose one layer");
		return;
	}

	if (value !== "None") {
		var geometryFunction, maxPoints;
		if (value === "Square") {
			value = "Circle";
			geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
		} else if (value === "Box") {
			value = "LineString";
			maxPoints = 2;
			geometryFunction = function(coordinates, geometry) {
				if (!geometry) {
					geometry = new ol.geom.Polygon(null);
				}
				var start = coordinates[0];
				var end = coordinates[1];
				geometry.setCoordinates([ [ start, [ start[0], end[1] ], end, [ end[0], start[1] ], start ] ]);
				return geometry;
			};
		}

		draw = new ol.interaction.Draw({
			source : layers[0].getSource(),
			type : /** @type {ol.geom.GeometryType} */
			(value),
			geometryFunction : geometryFunction,
			maxPoints : maxPoints
		});
		draw.set("name", "draw");
		map.addInteraction(draw);

		var measureTooltipElement = document.createElement('div');
		measureTooltipElement.className = 'tooltip tooltip-measure';
		measureTooltip = new ol.Overlay({
			element : measureTooltipElement,
			offset : [ 0, -15 ],
			positioning : 'bottom-center'
		});

		map.addOverlay(measureTooltip);

		draw.on('drawstart', function(evt) {

			$(measureTooltipElement).css("display", "block");
			var sketch = evt.feature;

			var tooltipCoord = evt.coordinate;

			var listener = sketch.getGeometry().on('change', function(evt) {
				var geom = evt.target;
				var output;
				if (geom instanceof ol.geom.Polygon) {
					output = formatArea((geom));
					tooltipCoord = geom.getInteriorPoint().getCoordinates();
				} else if (geom instanceof ol.geom.LineString) {
					output = formatLength((geom));
					tooltipCoord = geom.getLastCoordinate();
				}

				measureTooltipElement.innerHTML = output;
				measureTooltip.setPosition(tooltipCoord);
			});
		}, this);

		draw.on('drawend',
				function(e) {

					$(measureTooltipElement).css("display", "none");
					var layers = getSelectedLayers();
					var layer;
					if (layers.length === 1) {
						layer = layers[0];
					}
					if (layer === undefined) {
						console.log("choose only one layer");
						return;
					}
					var layerId = layer.get("id");
					// var featureCount =
					// (layer.getSource().getFeatures().length)+1;
					var feature = e.feature;
					var attrObj = layer.get("attribute");
					if (attrObj) {
						var keys = Object.keys(attrObj);
						for (var i = 0; i < keys.length; i++) {
							feature.set(keys[i], "");
						}
					}
					feature = createFeatureID(layer, feature);
					source.addFeature(feature);

					var selected = getSelectedLayers();

					if (selected.length === 1) {

						// 선택한 레이어가 벡터라면
						if (selected[0].get("type") === "point" || selected[0].get("type") === "linestring"
								|| selected[0].get("type") === "polygon" || selected[0].get("type") === "multipoint"
								|| selected[0].get("type") === "multilinestring"
								|| selected[0].get("type") === "multipolygon") {

							var str = '<li class="ui-widget-content" id="' + feature.getId()
									+ '" style="padding:3px;">' + feature.getId() + '</li>';
							$("#featureList").append(str);

							$("#featureList").selectable("refresh");

						}
					}
				});
	}
}

/**
 * Snap 인터랙션을 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function addSnapInteraction(map) {
	source = getAllFeatures(getAllVectorLayers(map));
	snap = new ol.interaction.Snap({
		source : source
	});
	map.addInteraction(snap);
}

/**
 * Snap 인터랙션을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function updateSnapInteraction(map) {
	map.removeInteraction(snap);
	source = getAllFeatures(getAllVectorLayers(map));
	snap = new ol.interaction.Snap({
		source : source
	});
	map.addInteraction(snap);
}

// 클릭선택
var select;
var selectedFeatures;
var dragBox;

/**
 * 이름을 통해 인터랙션을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param ol.Map
 * @return ol.interaction
 */
function getInteractionByName(name, map) {
	var intactns = map.getInteractions().getArray();
	for (var i = 0; i < intactns.length; i++) {
		if (intactns[i].get("name") === name) {
			// console.log(intactns[i].get("name"));
			return intactns[i];
		}
	}
	return;
}

/**
 * Select 인터랙션을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function updateSelectInteraction(map) {
	map.removeInteraction(select);
	selectLayers = getSelectedLayers();
	select = new ol.interaction.Select({
		layers : selectLayers,
		wrapX : false
	});
	map.addInteraction(select);
}

/**
 * Select 인터랙션을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <ol.layer.Layer>
 * @param ol.Collection
 *            <ol.Feature>
 * @param ol.Map
 */
function updateSelectInteraction2(layers, features, map) {
	map.removeInteraction(select);

	select = new ol.interaction.Select({
		layers : layers,
		features : features,
		wrapX : false
	});

	selectedFeatures = select.getFeatures();
	map.addInteraction(select);
}

/**
 * Select 인터랙션을 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function addSelectInteraction() {
	var selectLayers = getSelectedLayers();

	select = new ol.interaction.Select({
		layers : selectLayers,
		wrapX : false
	});
	select.set("name", "select");
	selectedFeatures = select.getFeatures();

	select.on("select", function() {
		if (selectedFeatures.getLength() > 0) {

			var layers = getSelectedLayers();
			if (layers.length === 1) {
				if (layers[0].get("cat") === 2) {
					$("#cpy").button("disable");
					$("#attr").button("disable");
				} else {
					$("#cpy").button("enable");
					$("#attr").button("enable");
				}
			}

			var atPosition = "left+" + crsrPosition[0] + "px " + "top+" + crsrPosition[1] + "px";
			popFeatureDialog(selectedFeatures.getArray());
			$("#selectPopUp").dialog("option", "position", {
				my : "left top",
				at : atPosition,
				of : document
			});

			if (selectedFeatures.getLength() === 1) {

				// //////////////////////////////
				var flag = true;
				if (selectLayers.length === 1) {
					if (selectLayers[0].get("cat") === 2) {
						flag = false;
					}
				} else {

				}
				if (flag) {

					var featureId = selectedFeatures.item(0).getId();
					var layerId = featureId.substring(0, featureId.indexOf("."));
					// console.log(layerId);
					layerId = layerId.trim();
					var layer = getLayerById(layerId);
					var layers = [ layer ];
					var collFeatures = new ol.Collection();
					var theFeature = getFeatureById2(layerId, featureId);
					collFeatures.push(theFeature);
					updateSelectInteraction2(layers, collFeatures, map);

					$("#deleteConfirmFeature").dialog({
						autoOpen : false,
						modal : true,
						buttons : {
							"확인" : function() {
								removeSelectedFeature(layer, collFeatures);
								$(this).dialog("close");
							},
							"취소" : function() {
								$(this).dialog("close");
							}
						}
					});

				} else if (!flag) {
					var featureId = selectedFeatures.item(0).get("errfeatureID");
					// var featureId =
					// "layer1.1";
					var layerId = featureId.substring(0, featureId.indexOf("."));
					// console.log(layerId);
					layerId = layerId.trim();
					var layer = getLayerById(layerId);
					var layers = [ layer ];
					var collFeatures = new ol.Collection();
					var theFeature = getFeatureById2(layerId, featureId);
					collFeatures.push(theFeature);
					// updateSelectInteraction2(null, null, map);
					updateSelectInteraction2(layers, collFeatures, map);

					$("#deleteConfirmFeature").dialog({
						autoOpen : false,
						modal : true,
						buttons : {
							"확인" : function() {
								removeSelectedFeature(layer, collFeatures);
								$(this).dialog("close");
							},
							"취소" : function() {
								$(this).dialog("close");
							}
						}
					});

				}

				// /////////////////////////////
				$("#attr").button("enable");
			} else if (selectedFeatures.getLength() > 1) {

			}

			if (selectedFeatures.getLength() > 0 && selectLayers.length > 1) {
				$("#dlet").button("disable");
			}
			getGeojsonFromFeatures();

		}
	});

	// a DragBox interaction used to select features by drawing boxes
	dragBox = new ol.interaction.DragBox({
		condition : ol.events.condition.shiftKeyOnly,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : [ 0, 0, 255, 1 ]
			})
		})
	});
	dragBox.set("name", "dragBox");
	map.addInteraction(select);
	map.addInteraction(dragBox);

	dragBox.on('boxend', function(e) {

		var extent = dragBox.getGeometry().getExtent();

		for (var i = 0; i < selectLayers.length; i++) {
			if (selectLayers[i] instanceof ol.layer.Vector) {
				selectLayers[i].getSource().forEachFeatureIntersectingExtent(extent, function(feature) {
					selectedFeatures.push(feature);
				});
			}
		}

		if (selectedFeatures.getLength() > 0) {

			var layers = getSelectedLayers();
			if (layers.length === 1) {
				if (layers[0].get("cat") === 2) {
					$("#cpy").button("disable");
					$("#attr").button("disable");
				} else {
					$("#cpy").button("enable");
					$("#attr").button("enable");
				}
			}

			var atPosition = "left+" + crsrPosition[0] + "px " + "top+" + crsrPosition[1] + "px";
			popFeatureDialog(selectedFeatures.getArray());
			$("#selectPopUp").dialog("option", "position", {
				my : "left top",
				at : atPosition,
				of : document
			});
			$("#attr").button("disable");
			if (selectedFeatures.getLength() === 1) {
				$("#attr").button("enable");

				// //////////////////////////////
				var flag = true;
				if (selectLayers.length === 1) {
					if (selectLayers[0].get("cat") === 2) {
						flag = false;
					}
				} else {

				}
				if (flag) {

					var featureId = selectedFeatures.item(0).getId();
					var layerId = featureId.substring(0, featureId.indexOf("."));
					// console.log(layerId);
					layerId = layerId.trim();
					var layer = getLayerById(layerId);
					var layers = [ layer ];
					var collFeatures = new ol.Collection();
					var theFeature = getFeatureById2(layerId, featureId);
					collFeatures.push(theFeature);
					updateSelectInteraction2(layers, collFeatures, map);

					$("#deleteConfirmFeature").dialog({
						autoOpen : false,
						modal : true,
						buttons : {
							"확인" : function() {
								removeSelectedFeature(layer, collFeatures);
								$(this).dialog("close");
							},
							"취소" : function() {
								$(this).dialog("close");
							}
						}
					});

				} else if (!flag) {
					var featureId = selectedFeatures.item(0).get("errfeatureID");
					// var featureId =
					// "layer1.1";
					var layerId = featureId.substring(0, featureId.indexOf("."));
					// console.log(layerId);
					layerId = layerId.trim();
					var layer = getLayerById(layerId);
					var layers = [ layer ];
					var collFeatures = new ol.Collection();
					var theFeature = getFeatureById2(layerId, featureId);
					collFeatures.push(theFeature);
					// updateSelectInteraction2(null, null, map);
					updateSelectInteraction2(layers, collFeatures, map);

					$("#deleteConfirmFeature").dialog({
						autoOpen : false,
						modal : true,
						buttons : {
							"확인" : function() {
								removeSelectedFeature(layer, collFeatures);
								$(this).dialog("close");
							},
							"취소" : function() {
								$(this).dialog("close");
							}
						}
					});

				}

				// /////////////////////////////
			} else if (selectedFeatures.getLength() > 1) {
				// //////////////////////////////
				var flag = true;
				if (selectLayers.length === 1) {
					if (selectLayers[0].get("cat") === 2) {
						flag = false;
					}
				} else {

				}
				if (flag) {

					var collFeatures = new ol.Collection();
					var layers;

					for (var i = 0; i < selectedFeatures.getLength(); i++) {
						var featureId = selectedFeatures.item(i).getId();
						var layerId = featureId.substring(0, featureId.indexOf("."));
						// console.log(layerId);
						layerId = layerId.trim();
						var layer = getLayerById(layerId);
						layers = [ layer ];
						var theFeature = getFeatureById2(layerId, featureId);
						collFeatures.push(theFeature);
					}

					updateSelectInteraction2(layers, collFeatures, map);

					$("#deleteConfirmFeature").dialog({
						autoOpen : false,
						modal : true,
						buttons : {
							"확인" : function() {
								removeSelectedFeature(layer, collFeatures);
								$(this).dialog("close");
							},
							"취소" : function() {
								$(this).dialog("close");
							}
						}
					});

				} else if (!flag) {

					var collFeatures = new ol.Collection();
					var layers;

					for (var i = 0; i < selectedFeatures.getLength(); i++) {
						var featureId = selectedFeatures.item(i).get("errfeatureID");
						var layerId = featureId.substring(0, featureId.indexOf("."));
						// console.log(layerId);
						layerId = layerId.trim();
						var layer = getLayerById(layerId);
						layers = [ layer ];
						var theFeature = getFeatureById2(layerId, featureId);
						collFeatures.push(theFeature);
					}

					updateSelectInteraction2(layers, collFeatures, map);

					$("#deleteConfirmFeature").dialog({
						autoOpen : false,
						modal : true,
						buttons : {
							"확인" : function() {
								removeSelectedFeature(layer, collFeatures);
								$(this).dialog("close");
							},
							"취소" : function() {
								$(this).dialog("close");
							}
						}
					});

				}

				// /////////////////////////////
			}
			if (selectedFeatures.getLength() > 0 && selectLayers.length > 1) {
				$("#dlet").button("disable");
			}
			getGeojsonFromFeatures();
		}

	});

	dragBox.on('boxstart', function(e) {
		selectedFeatures.clear();
		// infoBox.innerHTML = '&nbsp;';
	});

	map.on('click', function() {
		if (selectedFeatures.length > 0) {
			selectedFeatures.clear();
			removeMyInteraction(map);
			$("#selectPopUp").dialog("close");
		} else {
			$("#selectPopUp").dialog("close");
		}
	});
}

// 변경
var modify;

/**
 * Modify 인터랙션을 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Collection
 *            <ol.Feature>
 * @param ol.Map
 */
function addModifyInteraction(features, map) {
	modify = new ol.interaction.Modify({
		features : features
	});
	modify.set("name", "modify");
	map.addInteraction(modify);

	// var allSource = getAllFeatures(getAllVectorLayers(map));
	// snap = new ol.interaction.Snap({
	// source : allSource
	// });
	// map.addInteraction(snap);
}

/**
 * Modify 인터랙션을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function updateModifyInteraction(map) {
	map.removeInteraction(modify);
	addModifyInteraction(select.getFeatures(), map);
}

/**
 * Modify 인터랙션을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Collection
 *            <ol.Feature>
 * @param ol.Map
 */
function updateModifyInteraction2(features, map) {
	map.removeInteraction(modify);
	addModifyInteraction(features, map);
}

// 이동
var translate;
/**
 * Translate 인터랙션을 추가한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Collection
 *            <ol.Feature>
 * @param ol.Map
 */
function addTranslateInteraction(features, map) {
	translate = new ol.interaction.Translate({
		features : features
	});
	map.addInteraction(translate);
}

/**
 * Translate 인터랙션을 업데이트한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function updateTranslateInteraction(map) {
	map.removeInteraction(translate);
	translate = new ol.interaction.Translate({
		features : select.getFeatures()
	});
	map.addInteraction(translate);
}

/**
 * 추가한 인터랙션을 삭제한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Map
 */
function removeMyInteraction(map) {
	map.removeInteraction(draw);
	map.removeInteraction(dragBox);
	map.removeInteraction(select);
	map.removeInteraction(modify);
	map.removeInteraction(translate);
	map.removeInteraction(snap);
}

/**
 * 도구상자를 연다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function openToolBox(type) {
	if (type === "point") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "inline");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "inline");
	} else if (type === "linestring") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "inline");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "inline");
	} else if (type === "polygon") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "inline");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "inline");
	} else if (type === "multipoint") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "inline");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "inline");
	} else if (type === "multilinestring") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "inline");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "inline");
	} else if (type === "multipolygon") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "inline");
		$("#pste").css("display", "inline");
	} else if (type === "multiplex") {
		$("#slct").css("display", "inline");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "none");
	} else if (type === "error") {
		$("#slct").css("display", "none");
		$("#ptDraw").css("display", "none");
		$("#lsDraw").css("display", "none");
		$("#pgDraw").css("display", "none");
		$("#mtptDraw").css("display", "none");
		$("#mtlsDraw").css("display", "none");
		$("#mtpgDraw").css("display", "none");
		$("#pste").css("display", "none");
	}
	$("#drawTool").dialog("open");
}

/**
 * 선택한 피처를 삭제한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @param ol.Collection
 *            <ol.Feature>
 */
function removeSelectedFeature(layer, features) {
	// selectedFeatures = select.getFeatures();
	// var selected = getSelectedLayers();
	if (features.getLength() > 0) {
		var source = layer.getSource();
		// console.log(nowSelectedLayers[i].get("name"));
		for (var j = 0; j < features.getLength(); j++) {
			source.removeFeature(features.item(j));
		}

		removeMyInteraction(map);

		// 선택한 레이어 객체들 획득
		var selected = getSelectedLayers();

		if (selected.length === 1) {
			// 레이어 이름을 저장
			var layerNames = selected[0].get("name");

			// 선택한 레이어가 베이스맵이 아니라면
			if (selected[0].get("type") === "point" || selected[0].get("type") === "linestring"
					|| selected[0].get("type") === "polygon" || selected[0].get("type") === "multipoint"
					|| selected[0].get("type") === "multilinestring" || selected[0].get("type") === "multipolygon") {
				// 레이어 이름 출력

				var layers = getSelectedLayers();
				if (layers.length === 1 && layers[0] instanceof ol.layer.Vector) {
					$("#featureList").empty();
					var features = layers[0].getSource().getFeatures();
					for (var i = 0; i < features.length; i++) {
						var str = '<li class="ui-widget-content" id="' + features[i].getId()
								+ '" style="padding:3px;">' + features[i].getId() + '</li>';
						$("#featureList").append(str);
					}

				}
			}
		}
		$("#selectPopUp").dialog("close");

		// addSelectInteraction();
	} else {
		console.log("can not delete features of multiple layers");
		return;
	}

}

/**
 * 피처를 GeoJSON형태로 변환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function getGeojsonFromFeatures() {
	var prmt = {
		ptLayers : {},
		lnLayers : {},
		pgLayers : {},
		mtptLayers : {},
		mtlnLayers : {},
		mtpgLayers : {}
	}
	var featArr = selectedFeatures.getArray();
	var features = [];
	var lid;

	for (var i = 0; i < featArr.length; i++) {
		var fid = featArr[i].getId();
		if (!(fid === undefined || fid === null || fid === "")) {
			var dotPosition = fid.indexOf(".");
			if (dotPosition === -1) {

			} else {
				var lid = fid.substring(0, fid.indexOf("."));
				var layer = getLayerById(lid);
				var source = layer.getSource();
				var feature = source.getFeatureById(fid);
				if (!feature) {
					console.log("can not find feature");
					return;
				}
				var jsonObj;
				jsonObj = prmt.ptLayers[lid];
				if (jsonObj === undefined) {
					// prmt.ptLayers[lid] =
				} else {

				}
				prmt.ptLayers[lid] = features.push(source.getFeatureById(fid));
			}

		} else {

		}
	}
	var gjson = new ol.format.GeoJSON().writeFeatures(selectedFeatures.getArray());
	// console.log(gjson);
	return gjson;
}

/**
 * 선택한 피처에서 속성을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return String
 */
function getPropertiesFromSelected() {
	var layers = getSelectedLayers();
	var layer;
	if (layers.length === 1) {
		layer = layers[0];
	}
	var attr = layer.get("attribute");
	var properties = selectedFeatures.item(0).getProperties();
	var layerKeys = Object.keys(attr);
	var featureKeys = Object.keys(properties);

	var str = "";
	for (var i = 0; i < layerKeys.length; i++) {
		var key = layerKeys[i];
		var type = attr[layerKeys[i]];
		var value = properties[layerKeys[i]];
		if (value === undefined) {
			value = "";
		}
		str += "<tr><td><span class='attrKey'>" + key + "</span></td><td>" + type
				+ "</td><td><input type='text' value='" + value + "' id='" + layer.get("id") + "." + key
				+ "' class='attrVal'/></td></tr>";
	}

	return str;
	// samekey배열의 키를 프로퍼티스와 비교해 출력

}

/**
 * 선택한 피처에서 속성을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Feature
 * @return String
 */
function getSimpleProperties(feature) {
	var str = '';
	var layers = getSelectedLayers();
	var attr;
	if (layers.length === 1) {
		if (layers[0].get("cat") === 2) {
			var keys = feature.getKeys();
			var props = feature.getProperties();

			for (var i = 0; i < keys.length; i++) {
				if (keys[i] === "geometry") {
					continue;
				} else {
					str += '<tr><td style="border: 1px solid #e3e3e3;">' + keys[i]
							+ '</td><td style="border: 1px solid #e3e3e3; max-width:120px; word-wrap:break-word;">';
					if (props[keys[i]] === undefined || props[keys[i]] === null) {
						str += "";
					} else {
						str += props[keys[i]];
					}
					str += '</td></tr>';

				}
			}
		} else {
			var keys = feature.getKeys();
			var props = feature.getProperties();
			attr = layers[0].get("attribute");
			var lyrKeys = Object.keys(attr);

			for (var i = 0; i < lyrKeys.length; i++) {
				if (lyrKeys[i] === "geometry") {
					continue;
				} else {
					str += '<tr><td style="border: 1px solid #e3e3e3;">' + lyrKeys[i]
							+ '</td><td style="border: 1px solid #e3e3e3; max-width:120px; word-wrap:break-word;">';
					if (props[lyrKeys[i]] === undefined || props[lyrKeys[i]] === null) {
						str += "";
					} else {
						str += props[lyrKeys[i]];
					}
					str += '</td></tr>';

				}
			}
		}
	}

	return str;
}

/**
 * 피처의 속성을 입력 또는 조회한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function decideInsertOrRetrieve() {
	var layers = getSelectedLayers();
	var layer;
	if (layers.length === 1) {
		layer = layers[0];
	}

	var feature;
	if (selectedFeatures.getLength() === 1) {
		feature = selectedFeatures.item(0);
		$("#fidVal").text(feature.getId());
	}

	if (isHaveProperty(layer)) {
		// console.log("have feature");
		$("#addedAttr").empty();
		$("#addedAttr").append(getPropertiesFromSelected());
	} else {
		// console.log("dont have feature");
		$("#addedAttr").empty();
	}
}

/**
 * 속성정보를 피처에 저장한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.Feature
 * @param Array
 *            <Object>
 * @param Array
 *            <Object>
 */
function insertInfoToFeature(feature, keys, values) {

	var infoObj = new Object();
	if (keys.length === values.length && selectedFeatures.getLength() === 1) {
		for (var i = 0; i < keys.length; i++) {

			if ($(keys[i]).text() === "") {
				console.log("key name can not be empty ");
			} else {
				infoObj[$(keys[i]).text()] = values[i].value;
			}

		}

		var oriInfoObj = feature.getProperties();
		var key = Object.keys(oriInfoObj);

		for (var i = 0; i < key.length; i++) {
			if (key[i] === "geometry") {
				continue;
			} else {
				// console.log(keys[i].toString());
				feature.unset(key[i].toString());
			}
		}

		feature.setProperties(infoObj);
	} else {
		console.log("key number and value number don't match");
	}
}

/**
 * 레이어에 피처속성에 대한 정보가 있는지 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @return Boolean
 */
function isHaveProperty(layer) {
	var attr = layer.get("attribute");
	var flag = false;
	if (attr !== undefined && attr !== null) {
		if (typeof attr === "object") {
			flag = true;
		}
	}
	return flag;
}

/**
 * 이미지를 서버에 업로드한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function uploadRasterToServer(inputId) {
	var adrs = $("#" + inputId).val();
	// console.log(adrs);
	var imgAddr = "http://cfile24.uf.tistory.com/image/216C913953624B514580A7";

	removeMyInteraction(map);
	dragBox = new ol.interaction.DragBox({
		condition : ol.events.condition.always,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : [ 0, 0, 255, 1 ]
			})
		})
	});

	dragBox.set("name", "dragBox");
	map.addInteraction(dragBox);
	var extent;

	dragBox.on('boxend', function(e) {
		extent = dragBox.getGeometry().getExtent();

		var source = new ol.source.ImageStatic({
			imageExtent : extent,
			url : imgAddr
		});

		var id = createLayerId();

		var layer = createRasterLayer(extent, imgAddr);
		layer = setLayerProperties(layer, "raster.png", id, "raster", "new", 1, false, null);
		addLayerOnList(layer);
		removeMyInteraction(map);
	});

}

/**
 * 속성입력 부분을 활성화 또는 비활성화 시킨다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Number
 */
function switchInputAttr(status) {
	switch (status) {
	case 1:
		$(".attrKey").prop("readonly", false);
		$(".attrVal").prop("readonly", false);
		$(".keyType").prop("disabled", false);
		$(".attrDelBtn").css("display", "none");
		break;
	case 2:
		$(".attrKey").prop("readonly", true);
		$(".attrVal").prop("readonly", true);
		$(".keyType").prop("disabled", true);
		$(".attrDelBtn").css("display", "none");
		break;
	case 3:
		$(".attrKey").prop("readonly", true);
		$(".attrVal").prop("readonly", false);
		$(".keyType").prop("disabled", false);
		$(".attrDelBtn").css("display", "inline");
		break;
	}
}

var qaLayerName = "";

/**
 * 검수를 요청한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <ol.layer.Vector>
 */
function qaRequest(layers) {

	qaLayerName = layers[0].get("id");
	var prmt = {
		ptLayers : {},
		lnLayers : {},
		pgLayers : {},
		mtptLayers : {},
		mtlnLayers : {},
		mtpgLayers : {}
	}

	var url = CONTEXT + "/qualityAssurance/qa.ajax";

	for (var i = 0; i < layers.length; i++) {

		if (layers[i] instanceof ol.layer.Vector) {

			if (layers[i].get("qaOption") === undefined || layers[i].get("qaOption") === null) {
				$("<div title='Message'>검수 옵션이 미설정된 레이어가 있습니다.</div>").dialog({
					buttons : {
						"확인" : function() {
							$(this).dialog("close");
						}
					}
				});
				// return;
			}

			if (layers[i].get("type") === "point") {

				var flag1 = false;
				if (layers[i].get("cat") !== 0) {
					flag1 = true;
				}

				prmt.ptLayers[layers[i].get("id")] = {
					feature : new ol.format.GeoJSON().writeFeatures(layers[i].getSource().getFeatures()),
					attribute : layers[i].get("attribute"),
					qaFlag : flag1,
					qaOption : layers[i].get("qaOption")
				};

				var id = layers[i].get("id");
				var substr = id.substr(0, id.indexOf("_new"));
				var layer = getApprovalLayer(substr, "point");

				if (layer instanceof ol.layer.Vector && layer.get("type") === "point") {

					var flag2 = false;
					if (layer.get("cat") !== 0) {
						flag2 = true;
					}

					prmt.ptLayers[layer.get("id")] = {
						feature : new ol.format.GeoJSON().writeFeatures(layer.getSource().getFeatures()),
						attribute : layer.get("attribute"),
						qaFlag : flag2,
						qaOption : layer.get("qaOption")
					};
				}

			} else if (layers[i].get("type") === "linestring") {

				var flag1 = false;
				if (layers[i].get("cat") !== 0) {
					flag1 = true;
				}

				prmt.lnLayers[layers[i].get("id")] = {
					feature : new ol.format.GeoJSON().writeFeatures(layers[i].getSource().getFeatures()),
					attribute : layers[i].get("attribute"),
					qaFlag : flag1,
					qaOption : layers[i].get("qaOption")
				};

				var id = layers[i].get("id");
				var substr = id.substr(0, id.indexOf("_new"));
				var layer = getApprovalLayer(substr, "linestring");

				if (layer instanceof ol.layer.Vector && layer.get("type") === "linestring") {

					var flag2 = false;
					if (layer.get("cat") !== 0) {
						flag2 = true;
					}

					prmt.lnLayers[layer.get("id")] = {
						feature : new ol.format.GeoJSON().writeFeatures(layer.getSource().getFeatures()),
						attribute : layer.get("attribute"),
						qaFlag : flag2,
						qaOption : layer.get("qaOption")
					};
				}

			} else if (layers[i].get("type") === "polygon") {

				var flag1 = false;
				if (layers[i].get("cat") !== 0) {
					flag1 = true;
				}

				prmt.pgLayers[layers[i].get("id")] = {
					feature : new ol.format.GeoJSON().writeFeatures(layers[i].getSource().getFeatures()),
					attribute : layers[i].get("attribute"),
					qaFlag : flag1,
					qaOption : layers[i].get("qaOption")
				};

				var id = layers[i].get("id");
				var substr = id.substr(0, id.indexOf("_new"));
				var layer = getApprovalLayer(substr, "polygon");
				if (layer instanceof ol.layer.Vector && layer.get("type") === "polygon") {

					var flag2 = false;
					if (layer.get("cat") !== 0) {
						flag2 = true;
					}

					prmt.pgLayers[layer.get("id")] = {
						feature : new ol.format.GeoJSON().writeFeatures(layer.getSource().getFeatures()),
						attribute : layer.get("attribute"),
						qaFlag : flag2,
						qaOption : layer.get("qaOption")
					};
				}

			} else if (layers[i].get("type") === "multipoint") {

				var flag1 = false;
				if (layers[i].get("cat") !== 0) {
					flag1 = true;
				}

				prmt.mtptLayers[layers[i].get("id")] = {
					feature : new ol.format.GeoJSON().writeFeatures(layers[i].getSource().getFeatures()),
					attribute : layers[i].get("attribute"),
					qaFlag : flag1,
					qaOption : layers[i].get("qaOption")
				};

				var id = layers[i].get("id");
				var substr = id.substr(0, id.indexOf("_new"));
				var layer = getApprovalLayer(substr, "multipoint");
				if (layer instanceof ol.layer.Vector && layer.get("type") === "multipoint") {

					var flag2 = false;
					if (layer.get("cat") !== 0) {
						flag2 = true;
					}

					prmt.mtptLayers[layer.get("id")] = {
						feature : new ol.format.GeoJSON().writeFeatures(layer.getSource().getFeatures()),
						attribute : layer.get("attribute"),
						qaFlag : flag2,
						qaOption : layer.get("qaOption")
					};
				}

			} else if (layers[i].get("type") === "multilinestring") {

				var flag1 = false;
				if (layers[i].get("cat") !== 0) {
					flag1 = true;
				}

				prmt.mtlnLayers[layers[i].get("id")] = {
					feature : new ol.format.GeoJSON().writeFeatures(layers[i].getSource().getFeatures()),
					attribute : layers[i].get("attribute"),
					qaFlag : flag1,
					qaOption : layers[i].get("qaOption")
				}

				var id = layers[i].get("id");
				var substr = id.substr(0, id.indexOf("_new"));
				var layer = getApprovalLayer(substr, "multilinestring");
				if (layer instanceof ol.layer.Vector && layer.get("type") === "multilinestring") {

					var flag2 = false;
					if (layer.get("cat") !== 0) {
						flag2 = true;
					}

					prmt.mtlnLayers[layer.get("id")] = {
						feature : new ol.format.GeoJSON().writeFeatures(layer.getSource().getFeatures()),
						attribute : layer.get("attribute"),
						qaFlag : flag2,
						qaOption : layer.get("qaOption")
					};
				}

			} else if (layers[i].get("type") === "multipolygon") {

				var flag1 = false;
				if (layers[i].get("cat") !== 0) {
					flag1 = true;
				}

				prmt.mtpgLayers[layers[i].get("id")] = {
					feature : new ol.format.GeoJSON().writeFeatures(layers[i].getSource().getFeatures()),
					attribute : layers[i].get("attribute"),
					qaFlag : flag1,
					qaOption : layers[i].get("qaOption")
				}

				var id = layers[i].get("id");
				var substr = id.substr(0, id.indexOf("_new"));
				var layer = getApprovalLayer(substr, "multipolygon");
				if (layer instanceof ol.layer.Vector && layer.get("type") === "multipolygon") {

					var flag2 = false;
					if (layer.get("cat") !== 0) {
						flag2 = true;
					}

					prmt.mtpgLayers[layer.get("id")] = {
						feature : new ol.format.GeoJSON().writeFeatures(layer.getSource().getFeatures()),
						attribute : layer.get("attribute"),
						qaFlag : flag2,
						qaOption : layer.get("qaOption")
					};
				}

			}
		}
	}

	// console.log(JSON.stringify(prmt));
	// var str = JSON.stringify(prmt);
	// $("<div title='message'></div>").dialog().append(JSON.stringify(prmt));
	sendObjectRequest(
			url,
			prmt,
			function(data) {
				console.log("검수결과");
				console.log(JSON.stringify(data));
				if (data === undefined || data === null) {
					$("<div title='QA Result'>검수 설정값을 확인해주세요.</div>").dialog({
						buttons : {
							"확인" : function() {
								$(this).dialog("close");
							}
						}
					});
					return;
				}
				var name;
				var id;
				var fill = new ol.style.Fill({
					color : 'rgba(0, 0, 0, 0)'
				});
				var stroke = new ol.style.Stroke({
					color : 'rgba(255, 0, 0, 1)',
					width : 2
				});
				var style = [ new ol.style.Style({
					image : new ol.style.Circle({
						fill : fill,
						stroke : stroke,
						radius : 25
					}),
					fill : fill,
					stroke : stroke
				}) ];

				var keys = Object.keys(data);
				var errorLayer = keys.length - 1;
				var noError = 0;
				for (var i = 0; i < keys.length; i++) {
					if (keys[i] === "ptErrLayers") {
						if (data.ptErrLayers.features.length > 0) {
							var ptErrLayer = new ol.format.GeoJSON().readFeatures(data.ptErrLayers);
							var pointSource = new ol.source.Vector({
								wrapX : false
							});
							pointSource.addFeatures(ptErrLayer);

							var ptLayer = createVectorLayer(pointSource, style);
							name = "point_qa_result";
							id = createLayerId();
							ptLayer = setLayerProperties(ptLayer, name, id, "point", "new", 2, true, null);
							addLayerOnList(ptLayer);
							continue;
						} else {
							noError++;
						}
					} else if (keys[i] === "lnErrLayers") {
						if (data.lnErrLayers.features.length > 0) {
							var lnErrLayer = new ol.format.GeoJSON().readFeatures(data.lnErrLayers);
							var lineSource = new ol.source.Vector({
								wrapX : false
							});
							lineSource.addFeatures(lnErrLayer);

							var lnLayer = createVectorLayer(lineSource, style);
							name = "line_qa_result";
							id = createLayerId();
							lnLayer = setLayerProperties(lnLayer, name, id, "point", "new", 2, true, null);
							addLayerOnList(lnLayer);
							continue;
						} else {
							noError++;
						}
					} else if (keys[i] === "pgErrLayers") {
						if (data.pgErrLayers.features.length > 0) {
							var pgErrLayer = new ol.format.GeoJSON().readFeatures(data.pgErrLayers);
							var polygonSource = new ol.source.Vector({
								wrapX : false
							});
							polygonSource.addFeatures(pgErrLayer);

							var pgLayer = createVectorLayer(polygonSource, style);
							name = "polygon_qa_result";
							id = createLayerId();
							pgLayer = setLayerProperties(pgLayer, name, id, "point", "new", 2, true, null);
							addLayerOnList(pgLayer);
							continue;
						} else {
							noError++;
						}
					} else if (keys[i] === "mtptErrLayers") {
						if (data.mtptErrLayers.features.length > 0) {
							var mtptErrLayer = new ol.format.GeoJSON().readFeatures(data.mtptErrLayers);
							var mtpointSource = new ol.source.Vector({
								wrapX : false
							});
							mtpointSource.addFeatures(mtptErrLayer);

							var mtptLayer = createVectorLayer(mtpointSource, style);
							name = "mt_point_qa_result";
							id = createLayerId();
							mtptLayer = setLayerProperties(mtptLayer, name, id, "point", "new", 2, true, null);
							addLayerOnList(mtptLayer);
							continue;
						} else {
							noError++;
						}
					} else if (keys[i] === "mtlnErrLayers") {
						if (data.mtlnErrLayers.features.length > 0) {
							var mtlnErrLayer = new ol.format.GeoJSON().readFeatures(data.mtlnErrLayers);
							var mtlineSource = new ol.source.Vector({
								wrapX : false
							});
							mtlineSource.addFeatures(mtlnErrLayer);

							var mtlnLayer = createVectorLayer(mtlineSource, style);
							name = "mt_line_qa_result";
							id = createLayerId();
							mtlnLayer = setLayerProperties(mtlnLayer, name, id, "point", "new", 2, true, null);
							addLayerOnList(mtlnLayer);
							continue;
						} else {
							noError++;
						}
					} else if (keys[i] === "mtpgErrLayers") {
						if (data.mtpgErrLayers.features.length > 0) {
							var mtpgErrLayer = new ol.format.GeoJSON().readFeatures(data.mtpgErrLayers);
							var mtpolygonSource = new ol.source.Vector({
								wrapX : false
							});
							mtpolygonSource.addFeatures(mtpgErrLayer);

							var mtpgLayer = createVectorLayer(mtpolygonSource, style);
							name = "mt_polygon_qa_result";
							id = createLayerId();
							mtpgLayer = setLayerProperties(mtpgLayer, name, id, "point", "new", 2, true, null);
							addLayerOnList(mtpgLayer);
							continue;
						} else {
							noError++;
						}
					}
				}
				if (noError === errorLayer) {
					$("<div title='QA Result'>오류가 검출되지 않았습니다.</div>").dialog({
						buttons : {
							"확인" : function() {
								$(this).dialog("close");
							}
						}
					});
				}

				errReport = data.ErrReport;
				var allAccuracy = 0;
				$('#tableBody > tr').remove();
				for ( var obj in errReport) {
					$('#tableBody').append(
							"<tr>" + "<td>" + errReport[obj].type + "</td>" + "<td>" + errReport[obj].numOfItems
									+ "</td>" + "<td>" + errReport[obj].numOfErr + "</td>" + "<td>"
									+ errReport[obj].ratioOfErr + "</td>" + "<td>" + errReport[obj].accuracy + "</td>"
									+ "<td>" + errReport[obj].weights + "</td>" + "<td>" + errReport[obj].weightedValue
									+ "</td>" + "</tr>");

					allAccuracy = allAccuracy + errReport[obj].weightedValue;
				}
				$('#tableBody')
						.append(
								"<tr>"
										+ "<td colspan='7' style='vertical-align: top;'>(defined as the sum of weighted accuracy proportion * 100)&nbsp;"
										+ allAccuracy + "%</td>" + "</tr>");

				if (errReport != null) {
					// var ulApp = '<li id="chAR">ChairMan Approval
					// Request</li>';
					//			
					// $('#layerSettingMenu').append(ulApp);
					$('#addButton').empty();
					$('#addButton')
							.append(
									'<input name="excel" type="button" class="button" style="margin-right: 10px;width: 100px;height: 45px;"id="btnExcel" onclick="showDownLoadExcelPopup();" value="엑셀저장">'
											+ '<input name="approval" type="button" class="button" style="width: 100px; height: 45px;" id="btnApproval" onclick="ApprovalRequest();" value="승인요청">');
				}
			});
}

/**
 * 부의장에게 검수된 레이어의 승인을 요청한다.
 * 
 * @author seulgi.lee
 * @date 2016. 02
 */
function approvalRequest() {
	var rid = document.getElementById("rid").value;
	var tname = document.getElementById("tname").value;
	var layer = new ol.format.GeoJSON().writeFeatures(getLayerById(qaLayerName).getSource().getFeatures(), {
		dataProjection : "EPSG:4326",
		featureProjection : "EPSG:3857"
	});
	var attInfo = getAttInfo();
	var params = {
		rid : rid,
		errReport : errReport,
		tname : tname,
		layer : layer,
		attInfo : attInfo
	};
	$('chairmanRequestPopup').xHidePopup();
	sendObjectRequest(CONTEXT + "/receipt/approvalRequest.ajax", params, function(data) {
		if (data == true) {
			$('#requestCompletePopup').xShowPopup();
		} else if (data == false) {
			alertPopup("INFORM", "다시시도해주세요!");
		}
	});
}

/**
 * 선택된 레이어를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return Array<ol.layer.Base>
 */
function getSelectedLayers() {
	var selected = [];
	qaLayerNames = new Array();
	var allLayers = map.getLayers().getArray();
	for (var i = 0; i < allLayers.length; i++) {
		if (allLayers[i].get("selected") === 1) {
			selected.push(allLayers[i]);
			qaLayerNames.push(allLayers[i].get("id"));
		}
	}
	return selected;
}

/**
 * 파일을 업로드한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function fileUploadAjax(url) {
	// /upload/upShpFile.ajax
	// #shpFormat
	var cont = CONTEXT + url;
	var form = $("#shpFormat")[0];
	var fData = new FormData(form);

	$.ajax({
		url : cont,
		type : "post",
		dataType : "text",
		data : fData,
		// cache: false,
		processData : false,
		contentType : false,
		beforeSend : function() { // 호출전실행
			loadImageShow();
		},
		success : function(data, textStatus, jqXHR) {
			loadImageHide();
			// console.log("success");
			// console.log(data);
			var result = JSON.parse(data);
			// console.log(JSON.stringify(data));
			// var str = JSON.stringify(result);
			// $("<div title='message'></div>").append(str).dialog();

			var fileName = result.fileName;
			var fileId = fileName.substring(0, fileName.indexOf("."));
			// console.log(fileId);
			var id = createLayerId();
			// var format = new ol.format.GeoJSON().readFeatures(result.geoJSON,
			// {
			// featureProjection : 'EPSG:3857'
			// });

			var format = new ol.format.GeoJSON().readFeatures(result.geoJSON, {
				dataProjection : 'EPSG:4326',
				featureProjection : 'EPSG:3857'
			});

			var source = new ol.source.Vector({
				features : format
			});

			var style = new ol.style.Style({
				fill : new ol.style.Fill({
					color : 'rgba(0, 0, 255, 0.7)'
				}),
				stroke : new ol.style.Stroke({
					color : 'rgba(0, 0, 255, 0.7)',
					width : 2
				}),
				image : new ol.style.Circle({
					radius : 7,
					fill : new ol.style.Fill({
						color : 'rgba(0, 0, 255, 0.7)',
					})
				})
			});
			// $("#loadimage").hideProgress();qweqwe
			var layer = createVectorLayer(source, style);
			layer = setLayerProperties(layer, fileId, fileId, result.layerType.toLowerCase(), result.layerFrom, 1,
					true, null);
			var view = map.getView();
			view.fit(source.getExtent(), map.getSize());
			addLayerOnList(layer);

		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	});
}

/**
 * 프로젝트를 초기화한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function initProject() {
	projectGroup.pjt1 = createProject(null, null);
	projectGroup.pjt2 = createProject(null, null);
	projectGroup.pjt3 = createProject(null, null);

	$("#mapProject").val("project1");
	var selectedProject = $("#mapProject").val();
	map.set("nowProject", selectedProject);
	updateLayerList(map);
}

// 프로젝트 변경
/**
 * 프로젝트를 변경한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function changeProject(viewProject) {
	removeMyInteraction(map);
	var nowProject = map.get("nowProject");
	var layers = map.getLayers().getArray();

	switch (nowProject) {
	case "project1":
		projectGroup.pjt1 = createProject(nowProject, layers);
		break;
	case "project2":
		projectGroup.pjt2 = createProject(nowProject, layers);
		break;
	case "project3":
		projectGroup.pjt3 = createProject(nowProject, layers);
		break;
	default:
		console.log("invalid project selection");
		break;
	}

	switch (viewProject) {
	case "project1":
		while (layers.length !== 0) {
			map.removeLayer(layers[0]);
		}

		if (projectGroup.pjt1.layers instanceof ol.layer.Group) {
			map.setLayerGroup(projectGroup.pjt1.layers);
		}
		map.set("nowProject", viewProject);
		break;
	case "project2":
		while (layers.length !== 0) {
			map.removeLayer(layers[0]);
		}

		if (projectGroup.pjt2.layers instanceof ol.layer.Group) {
			map.setLayerGroup(projectGroup.pjt2.layers);
		}
		map.set("nowProject", viewProject);
		break;
	case "project3":
		while (layers.length !== 0) {
			map.removeLayer(layers[0]);
		}

		if (projectGroup.pjt3.layers instanceof ol.layer.Group) {
			map.setLayerGroup(projectGroup.pjt3.layers);
		}
		map.set("nowProject", viewProject);
		break;
	default:
		console.log("invalid project switch");
		break;
	}
	$("#drawTool").dialog("close");
	updateLayerList(map);
}

/**
 * 폴리곤의 면적을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.geom.Polygon
 * @return String
 */
function formatArea(polygon) {
	var area = polygon.getArea();

	var output;
	if (area > 10000) {
		output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
	} else {
		output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
	}
	return output;
}

/**
 * 라인의 길이를 구한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.geom.LineString
 * @return String
 */
function formatLength(line) {
	var length = Math.round(line.getLength() * 100) / 100;

	var output;
	if (length > 100) {
		output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
	} else {
		output = (Math.round(length * 100) / 100) + ' ' + 'm';
	}
	return output;
}

/**
 * 레이어의 스타일을 설정창에 반영한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param ol.style.Style
 */
function setStyleWindow(layerType, layerStyle) {
	var strokeStyle;

	// 포인트 타입일때
	if (layerType === "point" || layerType === "multipoint") {
		if (layerStyle.getImage().CLASS_TYPE === "ICON") {

		} else if (layerStyle.getImage().CLASS_TYPE === "CIRCLE") {
			// 이미지 스타일의 스트로크 스타일을 획득
			strokeStyle = layerStyle.getImage().getStroke();
		}
	} else if (layerType === "linestring" || layerType === "polygon" || layerType === "multilinestring"
			|| layerType === "multipolygon") {
		// 그 이외에는 스타일 내부의 스트로크 스타일을 획득
		strokeStyle = layerStyle.getStroke();
	}

	if (strokeStyle !== undefined) {
		// 너비 출력
		$("#lnspnr").spinner("value", strokeStyle.getWidth());

		// 선 색깔정보 획득
		var strokeColorString = strokeStyle.getColor().trim().replace(/\s/gi, '');

		// 컬러픽커 슬라이더에 획득한 값 부여
		$("#strk").spectrum("set", strokeColorString);
	}

	var fillStyle;

	// 포인트 타입일때
	if (layerType === "point" || layerType === "multipoint") {
		if (layerStyle.getImage().CLASS_TYPE === "ICON") {

		} else if (layerStyle.getImage().CLASS_TYPE === "CIRCLE") {
			// 이미지 스타일의 필 스타일을 획득
			fillStyle = layerStyle.getImage().getFill();
		}
	} else if (layerType === "polygon" || layerType === "multipolygon") {

		// 그 이외에는 스타일 내부의 필 스타일을 획득
		fillStyle = layerStyle.getFill();
	}

	if (fillStyle !== undefined) {

		// 면색 컬러코드 획득
		var fillColorString = fillStyle.getColor().trim().replace(/\s/gi, '');

		$("#fll").spectrum("set", fillColorString);

	}

	// 레이어 타입에 따른 스타일 양식 변경
	if (layerType === "point" || layerType === "multipoint") {
		// 포인트 양식으로 변경
		$("#pointStyle").css("display", "block");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "block");
		$("#typeRadio").css("display", "block");
		if (layerStyle.getImage().CLASS_TYPE === "ICON") {
			$("#pointType").val("marker");
			changePointType();
		} else if (layerStyle.getImage().CLASS_TYPE === "CIRCLE") {
			$("#pointType").val("dot");
			changePointType();
		}
	} else if (layerType === "linestring" || layerType === "multilinestring") {
		// 라인 스타일로 변경
		$("#pointStyle").css("display", "none");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "none");
	} else if (layerType === "polygon" || layerType === "multipolygon") {
		// 폴리곤 스타일로 변경
		$("#pointStyle").css("display", "none");
		$("#strokeStyle").css("display", "block");
		$("#fillStyle").css("display", "block");
		$(".circleTab").css("display", "none");
	} else if (layerType === "raster") {
		// 래스터 스타일로 변경
		$("#pointStyle").css("display", "none");
		$("#strokeStyle").css("display", "none");
		$("#fillStyle").css("display", "none");
	}
}

/**
 * 프로잭트를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param Array
 *            <ol.layer.Base>
 * @return Object
 */
function createProject(name, layers) {
	var projObj = new Object();
	projObj.name = name;
	projObj.layers = new ol.layer.Group({
		layers : layers
	});
	return projObj;
}

/**
 * 프로젝트 메뉴가 보여질 영역을 설정한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Object
 */
function setProjectMenu(div) {
	var project = $('<select name="mapProject" id="mapProject"><option>project1</option><option>project2</option><option>project3</option></select>');
	div.append(project);

	// 프로젝트 선택 실렉트
	$("#mapProject").selectmenu({
		change : function() {
			var viewProj = $("#mapProject").val();
			changeProject(viewProj);
		}
	});
}

/**
 * 현재 좌표가 표시될 영역을 설정한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Object
 */
function setCoordinateMenu(div) {
	var coord = $('<div id="coord"></div>');
	div.append(coord);
}

/**
 * 검수예정인 레이어를 보여준다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Object
 */
function getQALayers(layers) {
	var str = '<div>';
	var pt = '', ln = '', pg = '', mtpt = '', mtln = '', mtpg = '';

	for (var i = 0; i < layers.length; i++) {
		if (layers[i] instanceof ol.layer.Vector) {
			if (layers[i].get("type") === "point") {
				pt += "<p>" + layers[i].get("name");
				if (layers[i].get("qaOption") === null || layers[i].get("qaOption") === undefined) {
					pt += "<span> [검수 옵션 미설정] </span>";
				}
				pt += "<button id='qa_" + layers[i].get("id") + "' class='openQAOptBtn'>검수 옵션";
				pt += "</button>";
				pt += "</p>";
			} else if (layers[i].get("type") === "linestring") {
				ln += "<p>" + layers[i].get("name");
				if (layers[i].get("qaOption") === null || layers[i].get("qaOption") === undefined) {
					ln += "<span> [검수 옵션 미설정] </span>";
				}
				ln += "<button id='qa_" + layers[i].get("id") + "' class='openQAOptBtn'>검수 옵션";
				ln += "</button>";

				ln += "</p>";
			} else if (layers[i].get("type") === "polygon") {
				pg += "<p>" + layers[i].get("name");
				if (layers[i].get("qaOption") === null || layers[i].get("qaOption") === undefined) {
					pg += "<span> [검수 옵션 미설정] </span>";
				}
				pg += "<button id='qa_" + layers[i].get("id") + "' class='openQAOptBtn'>검수 옵션";
				pg += "</button>";

				pg += "</p>";
			} else if (layers[i].get("type") === "multipoint") {
				mtpt += "<p>" + layers[i].get("name");
				if (layers[i].get("qaOption") === null || layers[i].get("qaOption") === undefined) {
					mtpt += "<span> [검수 옵션 미설정] </span>";
				}
				mtpt += "<button id='qa_" + layers[i].get("id") + "' class='openQAOptBtn'>검수 옵션";
				mtpt += "</button>";

				mtpt += "</p>";
			} else if (layers[i].get("type") === "multilinestring") {
				mtln += "<p>" + layers[i].get("name");
				if (layers[i].get("qaOption") === null || layers[i].get("qaOption") === undefined) {
					mtln += "<span> [검수 옵션 미설정] </span>";
				}
				mtln += "<button id='qa_" + layers[i].get("id") + "' class='openQAOptBtn'>검수 옵션";
				mtln += "</button>";

				mtln += "</p>";
			} else if (layers[i].get("type") === "multipolygon") {
				mtpg += "<p>" + layers[i].get("name");
				if (layers[i].get("qaOption") === null || layers[i].get("qaOption") === undefined) {
					mtpg += "<span> [검수 옵션 미설정] </span>";
				}
				mtpg += "<button id='qa_" + layers[i].get("id") + "' class='openQAOptBtn'>검수 옵션";
				mtpg += "</button>";

				mtpg += "</p>";
			}
		}
	}

	if (pt !== '') {
		str += "<h3>Point</h3>";
		str += "<div class='LineBox'>";
		str += pt;

		str += "</div>";
		str += "<br/>";
	}

	if (ln !== '') {
		str += "<h3>Linestring</h3>";
		str += "<div class='LineBox'>";
		str += ln;

		str += "</div>";
		str += "<br/>";
	}

	if (pg !== '') {
		str += "<h3>Polygon</h3>";
		str += "<div class='LineBox'>";
		str += pg;

		str += "</div>";
	}

	if (mtpt !== '') {
		str += "<h3>Multi Point</h3>";
		str += "<div class='LineBox'>";
		str += mtpt;

		str += "</div>";
		str += "<br/>";
	}

	if (mtln !== '') {
		str += "<h3>Multi Linestring</h3>";
		str += "<div class='LineBox'>";
		str += mtln;

		str += "</div>";
		str += "<br/>";
	}

	if (mtpg !== '') {
		str += "<h3>Multi Polygon</h3>";
		str += "<div class='LineBox'>";
		str += mtpg;

		str += "</div>";
	}

	str += "</div>";

	return str;
}

/**
 * 레이어 메뉴 버튼이 표시될 영역을 설정한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Object
 */
function setLayerButton(div) {
	var buttons = '<div style="display:table;width:inherit;text-align:left;padding-top:5px;">';
	buttons += '<button id="addLayer" class="btnOnList">추가</button>';
	buttons += '<button id="deleteLayer" class="btnOnList">삭제</button>';
	buttons += '<button id="qaBtn" class="btnOnList">검수</button>';
	buttons += '</div>';
	div.append(buttons);

	// 레이어 추가 버튼 클릭시 이벤트
	$("#addLayer").button({
		icons : {
			primary : "ui-icon-document"
		}
	}).click(function() {
		// 새 레이어 만드는 창 띄우는 함수 실행
		newLayerWindow();
	});

	// 레이어 삭제 버튼 클릭시 이벤트
	$("#deleteLayer").button({
		icons : {
			primary : "ui-icon-trash"
		}
	}).click(function() {
		var selectedLayer = getSelectedLayers();
		// 선택된 레이어가 1개 이상이라면
		if (selectedLayer.length > 0) {
			// 삭제 확인창 출력
			$("#deleteConfirm").dialog("open");
		} else {
			console.log("choose layers to delete");
		}
	});

	// 검수 버튼 클릭시 이벤트
	$("#qaBtn").button({
		icons : {
			primary : "ui-icon-search"
		}
	}).click(function() {
		$("#qaConfirm").empty();
		var layers = getSelectedLayers();
		var list = getQALayers(layers);
		$("#qaConfirm").append(list);
		$("#qaConfirm").dialog("open");
	});

	var dialog = '<div id="deleteConfirm" title="레이어 삭제"><p>정말 삭제하시겠습니까?</p></div>';
	$("body").append($(dialog));

	// 레이어 삭제 확인 다이얼로그 초기화
	$("#deleteConfirm").dialog({
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				// 선택된 레이어 삭제 함수를 ok버튼에 연결
				removeLayerOnList(getSelectedLayers());
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	var qaDialog = '<div id="qaConfirm" title="QA">';
	qaDialog += '</div>';
	$("body").append($(qaDialog));

	// 검수 다이얼로그 초기화
	$("#qaConfirm").dialog({
		width : 470,
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				// 선택된 레이어 삭제 함수를 ok버튼에 연결
				var layers = getSelectedLayers();
				qaRequest(layers);
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

}

/**
 * 레이어 목록이 표시될 영역을 설정한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Object
 */
function setLayerList(div) {
	div.addClass("padd8");
	div.css("max-height", 800);
	div.css("overflow", "hidden");
	var list = $('<ul id="layerList"></ul>');
	div.append(list);

	var layer = '<div id="layerStyle" title="레이어 스타일">';
	layer += '<div id="tabs">';
	layer += '<ul>';
	layer += '<li><a href="#tabVector">벡터</a></li>';
	layer += '<li><a href="#tabTile">타일</a></li>';
	layer += '<li><a href="#tabShp">SHP 파일</a></li>';
	layer += '</ul>';

	layer += '<div id="tabVector" class="LayerTypeTabs">';
	layer += '<div class="styleAttribute" id="typeRadio">';
	layer += '<span class="typeRadio"><input id="ptType" type="radio" name="lType"value="point" checked="checked" /><label for="ptType">점</label></span>';
	layer += '<span class="typeRadio"><input id="lsType" type="radio" name="lType" value="linestring" /><label for="lsType">선</label></span>';
	layer += '<span class="typeRadio"><input id="pgType" type="radio" name="lType" value="polygon" /><label for="pgType">면</label></span>';
	layer += '</div>';
	layer += '<table>';
	layer += '<tr class="styleAttribute">';
	layer += '<td style="width:50px;">이름</td><td><input id="layerName" type="text" readonly="readonly" /><span class="onlyEdit"><button id="editNameBtn">편집</button></span></td>';
	layer += '</tr>';
	layer += '<tr class="styleAttribute">';
	layer += '<td><span class="onlyEdit"><label for="showOrHide">보임</label></span></td><td><span class="onlyEdit"><input id="showOrHide" type="checkbox" /></span></td>';
	layer += '</tr>';
	layer += '</table>';
	layer += '<div id="pointStyle">';
	layer += '<table>';
	layer += '<tr id="typeTab" class="styleAttribute">';
	layer += '<td style="width:50px;vertical-align:middle;">표시</td><td><select id="pointType" name="pointType"><option value="dot" selected="selected">점</option><option value="marker">마크</option></select></td>';
	layer += '</tr>';
	layer += '<tr>';
	layer += '<td colspan="2"><div id="iconTab"><span><input id="marker1" type="radio" name="markerType" value="map-marker.png" checked="checked" /><img class="markerImg" src="'
			+ getContextPath() + '/js/gitbuilder/image/marker/map-marker.png"></span></div></td>';
	layer += '</tr>';
	layer += '</table>';
	layer += '</div>';

	layer += '<div class="styleAttribute" id="strokeStyle">';
	layer += '<p>선</p>';
	layer += '<table>';
	layer += '<tr>';
	layer += '<td style="width:50px;"><div><label for="strk" >색깔</label></td><td style="width:100px;"><input type="text"	id="strk" /></div></td>';
	layer += '<td style="width:50px;"><div><label for="lnspnr" >너비</label></td><td style="width:100px;"><input id="lnspnr" class="lineStyle" value="1"></div></td>';
	layer += '</tr>';
	layer += '</table>';
	layer += '</div>';

	layer += '<div class="styleAttribute" id="fillStyle">';
	layer += '<p>면</p>';
	layer += '<table>';
	layer += '<tr>';
	layer += '<td style="width:50px;"><div id="fillColorTab"><label for="fll" >색깔</label></td><td style="width:100px;"><input type="text" id="fll" /></div></td>';
	layer += '<td style="width:50px;"><div class="circleTab"><label for="ptspnr" >반경</label></td><td style="width:100px;"><input id="ptspnr" value="5" class="circleTab"></div></td>';
	layer += '</tr>';
	layer += '</table>';
	layer += '</div>';
	layer += '</div>';

	layer += '<div id="tabTile" class="LayerTypeTabs">';
	layer += '<div class="onlyEdit"><input id="showOrHideBase" type="checkbox" /><label for="showOrHideBase">보임</label></div>';
	layer += '<br/>';
	layer += '<div><select id="baseType" name="baseType"><option value="osm">Open street map</option><option value="bing">Bing map</option><option value="arc">Arc map</option></select></div>';
	layer += '</div>';

	layer += '<div id="tabShp" class="LayerTypeTabs">';
	layer += '<div class="styleAttribute">';
	layer += '<form id="shpFormat" method="post" enctype="multipart/form-data" action="file/upShpFile.ajax">';
	layer += '<div><label for="shp">불러올 레이어의 SHP파일을 등록하세요.</label> <br/> <input type="file" name="shp" id="shp"></div>';
	layer += '<br>';
	layer += '<div><label for="shx">불러올 레이어의 SHX파일을 등록하세요.</label> <br/> <input type="file" name="shx" id="shx"></div>';
	layer += '<br>';
	layer += '<div><label for="dbf">불러올 레이어의 DBF파일을 등록하세요.</label> <br/> <input type="file" name="dbf" id="dbf"></div></form>';
	layer += '</div></div></div></div>';

	layer += '<div id="layerSettingPopup">';
	layer += '<ul id="layerSettingMenu">';
	layer += '<li id="lyrStyle">스타일</li>';
	layer += '<li id="lyrAttr">속성</li>';
	layer += '<li id="qaOpt">검수설정</li>';
	layer += '</ul>';
	layer += '</div>';
	layer += '<div id="attrSetting" title="속성 설정">';
	layer += '<div class="cntSection">';
	layer += '<div class="tbList">';
	// layer += '<table class="boardList">';
	// layer += '<tr><td><input type="text" id="lyrAttrKey" class="text"
	// /></td>';
	// layer += '<td><select id="lyrAttrType"><option
	// value="String">String</option><option
	// value="Integer">Integer</option><option
	// value="Double">Double</option></select></td>';
	// layer += '<td><button id="addFieldBtn">Add</button></td></tr>';
	// layer += '</table>';
	layer += '<table id="lyrAttrList" class="boardList">';
	layer += '<thead><tr><th>이름</th><th>데이터 타입</th></tr></thead>';

	layer += '</table>';
	layer += '</div>';
	layer += '</div>';
	layer += '</div>';
	layer += '<div id="qaSetting" title="검수 옵션 설정">';
	layer += '</div>';

	$("body").append($(layer));

	$("#addFieldBtn").button().click(
			function() {
				var keyName = $("#lyrAttrKey").val();
				var keyType = $("#lyrAttrType").val();

				$("#lyrAttrList").append(
						"<tr class='LyrAttrRow'>" + "<td class='LyrKeyName' style='border: 1px solid #e3e3e3;'>"
								+ keyName + "</td><td class='LyrKeyType' style='border: 1px solid #e3e3e3;'>" + keyType
								+ "</td>" + "</tr>");
			});

	// 레이어 설정 메뉴
	$("#layerSettingMenu").menu().menu("widget").find(".ui-menu").css("margin", 0);

	$("#layerSettingPopup").dialog({
		width : 1,
		height : 1,
		autoOpen : false,
		modal : false,
		resizable : false,
		draggable : false
	}).dialog("widget").find(".ui-dialog-titlebar").hide();

	// 레이어 스타일 다이얼로그 초기화
	$("#layerStyle").dialog({
		width : 515,
		height : 380,
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	// 애트리뷰트 다이얼로그 초기화
	$("#attrSetting").dialog({
		width : 515,
		height : 380,
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	// 검수옵션 다이얼로그 초기화
	$("#qaSetting").dialog({
		width : 515,
		height : 380,
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	// 레이어 탭
	$("#tabs").tabs({});

	$("#pointType").selectmenu({
		change : function(event, ui) {
			changePointType();
		}
	}).addClass("dotOrMarker");

	$("#baseType").selectmenu();

	// 선 두께 스피너 초기화
	$("#lnspnr").spinner({
		min : 0
	});

	// 점 크기 스피너 초기화
	$("#ptspnr").spinner({
		min : 0
	});

	// 컬러픽커 슬라이더 초기화(래스터 투명도)
	$("#alphaR").slider({
		orientation : "horizontal",
		range : "min",
		value : 0.6,
		min : 0,
		max : 1,
		step : 0.01
	});

	$("#fll").spectrum(
			{
				showAlpha : true,
				showInput : true,
				preferredFormat : "rgb",
				showPalette : true,
				palette : [
						[ "rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)",
								"rgb(183, 183, 183)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)",
								"rgb(243, 243, 243)", "rgb(255, 255, 255)" ],
						[ "rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
								"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)",
								"rgb(255, 0, 255)" ],
						[ "rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)",
								"rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)",
								"rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)",
								"rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)",
								"rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
								"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)",
								"rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)",
								"rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)",
								"rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)",
								"rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
								"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)",
								"rgb(56, 118, 29)", "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)",
								"rgb(53, 28, 117)", "rgb(116, 27, 71)", "rgb(91, 15, 0)", "rgb(102, 0, 0)",
								"rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)",
								"rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)" ] ]
			});

	$("#strk").spectrum(
			{
				showAlpha : true,
				showInput : true,
				preferredFormat : "rgb",
				showPalette : true,
				palette : [
						[ "rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(153, 153, 153)",
								"rgb(183, 183, 183)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(239, 239, 239)",
								"rgb(243, 243, 243)", "rgb(255, 255, 255)" ],
						[ "rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
								"rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)",
								"rgb(255, 0, 255)" ],
						[ "rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)",
								"rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)",
								"rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)",
								"rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)",
								"rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
								"rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)",
								"rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)",
								"rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)",
								"rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)",
								"rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
								"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)",
								"rgb(56, 118, 29)", "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)",
								"rgb(53, 28, 117)", "rgb(116, 27, 71)", "rgb(91, 15, 0)", "rgb(102, 0, 0)",
								"rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)",
								"rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)" ] ]
			});

	// 레이어 타입을 바꾸면 스타일창의 양식이 변경
	$('input[type=radio][name=lType]').change(function() {
		if (this.value === 'point') {
			changePointType();
		} else if (this.value === 'linestring') {
			$("#pointStyle").css("display", "none");
			$("#strokeStyle").css("display", "block");
			$("#fillStyle").css("display", "none");
		} else if (this.value === 'polygon') {
			$("#pointStyle").css("display", "none");
			$("#strokeStyle").css("display", "block");
			$("#fillStyle").css("display", "block");
			$(".circleTab").css("display", "none");

		}
	});

}

/**
 * 지도가 표시될 영역을 설정한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Object
 */
function setMapArea(div) {

	var id = div.prop("id");

	var view = new ol.View({
		center : ol.proj.transform([ 71.433333, 51.166667 ], 'EPSG:4326', 'EPSG:3857'),
		zoom : 4,
		minZoom : 2,
		maxZoom : 19,
		projection : 'EPSG:3857'
	});

	var scaleLineControl = new ol.control.ScaleLine({
		minWidth : 100,
		className : 'ol-scale-line'
	});

	var zoomSlider = new ol.control.ZoomSlider();

	var msPstn = new ol.control.MousePosition({
		coordinateFormat : ol.coordinate.createStringXY(8),
		projection : 'EPSG:4326',
		className : 'custom-mouse-position',
		target : document.getElementById('coord'),
		undefinedHTML : '&nbsp;'
	});

	var overView = new ol.control.OverviewMap();

	var rotate = new ol.control.Rotate({
		className : "ol-rotate"
	});

	var CustomControl = function(opt_options) {

		var options = opt_options || {};

		var button = '<img src="' + getContextPath() + '/js/gitbuilder/image/up.png" id="openReport" />';

		var element = document.createElement('div');
		element.innerHTML = button;
		element.className = 'rptOpen ol-unselectable ol-control';

		var this_ = this;

		ol.control.Control.call(this, {
			element : element,
			target : options.target
		});

	};
	ol.inherits(CustomControl, ol.control.Control);

	var map = new ol.Map({
		controls : ol.control.defaults({
			attributionOptions : /** @type {olx.control.AttributionOptions} */
			({
				collapsible : false
			})
		}).extend([ scaleLineControl, zoomSlider, msPstn, overView, rotate, new CustomControl() ]),
		target : id,
		layers : [],
		view : view
	});

	map.on("moveend", function() {
		if ((apprvlLyr !== undefined && apprvlLyr !== null) && apprvlLyr instanceof ol.layer.Vector) {
			checkZoomGetFeature(apprvlLyr, apprvlLyr.get("name"));
		}
	});

	return map;
}

/**
 * 도구상자를 사용한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function setToolBox() {
	var box = '<div id="drawTool" title="도구">';
	box += '<div class="editTool">';
	box += '<button id="slct">select</button>';
	box += '<button id="ptDraw">point</button>';
	box += '<button id="lsDraw">line</button>';
	box += '<button id="pgDraw">polygon</button>';
	box += '<button id="mtptDraw">multipoint</button>';
	box += '<button id="mtlsDraw">multiline</button>';
	box += '<button id="mtpgDraw">multipolygon</button>';
	box += '<button id="pste">paste</button>';
	box += '</div>';
	box += '<br/>';
	box += '<ol id="featureList">';
	box += '</ol>';

	box += '</div>';

	$("body").append(box);

	$("#featureList").selectable().css("font-size", 14);

	// 선택 버튼
	$("#slct").button({
		icons : {
			primary : "ui-icon-arrowthick-1-nw"
		},
		text : false
	});

	// 점 그리기 버튼
	$("#ptDraw").button({
		icons : {
			primary : "ui-icon-bullet"
		},
		text : false
	});

	// 선 그리기 버튼
	$("#lsDraw").button({
		icons : {
			primary : "ui-icon-minus"
		},
		text : false
	});

	// 면 그리기 버튼
	$("#pgDraw").button({
		icons : {
			primary : "ui-icon-stop"
		},
		text : false
	});

	// 점 그리기 버튼
	$("#mtptDraw").button({
		icons : {
			primary : "ui-icon-bullet"
		},
		text : false
	});

	// 선 그리기 버튼
	$("#mtlsDraw").button({
		icons : {
			primary : "ui-icon-minus"
		},
		text : false
	});

	// 면 그리기 버튼
	$("#mtpgDraw").button({
		icons : {
			primary : "ui-icon-stop"
		},
		text : false
	});
	// paste 버튼
	$("#pste").button({
		icons : {
			primary : "ui-icon-clipboard"
		},
		text : false
	}).click(function() {
		var layers = getSelectedLayers();
		if (layers.length === 1) {
			pasteFeature(layers[0]);
		}
	});

	// 그리기 도구모음창
	$("#drawTool").dialog({
		maxHeight : 800,
		autoOpen : false,
		position : {
			my : "right top",
			at : "right top",
			of : $("#map")
		}
	});

	var deleteBox = '<div id="deleteConfirmFeature" title="피처 삭제"><p>정말 삭제하시겠습니까?</p></div>';
	$("body").append(deleteBox);

	$("#deleteConfirmFeature").dialog({
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				var layers = getSelectedLayers();

				if (layers.length === 1) {
					if (layers[0].get("cat") === 2) {
						var source = layers[0].getSource();
						var features = source.getFeatures();
						if (features.length === 0) {
							return;
						} else {
							var feature = features[0];
							var fid = feature.get("errfeatureID");
							var lid = fid.substring(0, fid.indexOf("."));
							var layer = getLayerById(lid);
							removeSelectedFeature(layer, selectedFeatures);
						}
					} else {
						// 선택한 피쳐를 삭제하는 함수를 ok버튼에 연결
						removeSelectedFeature(layers[0], selectedFeatures);
					}

				} else {
					console.log("choose only one layer");
				}
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	var popup = '<div id="selectPopUp" title="메뉴">';

	popup += '<div class="editTool">';

	popup += '<div class="marg5" style="text-align: center;">';
	popup += '<button id="move">move</button>';
	popup += '<button id="mdfy">modify</button>';
	popup += '<button id="dlet">delete</button>';
	popup += '<button id="attr">attribute</button>';
	popup += '<button id="cpy">copy</button>';
	popup += '</div>';

	popup += '</div>';

	popup += '<table id="viewAttr" class="marg5" style="width:205px;">';
	popup += '</table>';
	popup += '</div>';

	$("body").append(popup);

	// 편집 도구모음창
	$("#selectPopUp").dialog({
		dialogClass : "popupTool",
		autoOpen : false,
		width : 230,
		maxHeight : 600
	});

	// 이동 버튼
	$("#move").button({
		icons : {
			primary : "ui-icon-arrow-4"
		},
		text : false
	});

	// 수정 버튼
	$("#mdfy").button({
		icons : {
			primary : "ui-icon-wrench"
		},
		text : false
	});

	// 삭제 버튼
	$("#dlet").button({
		icons : {
			primary : "ui-icon-trash"
		},
		text : false
	});

	// 속성 버튼
	$("#attr").button({
		icons : {
			primary : "ui-icon-info"
		},
		text : false
	});

	// copy 버튼
	$("#cpy").button({
		icons : {
			primary : "ui-icon-copy"
		},
		text : false
	}).click(function() {
		copyFeature(selectedFeatures.getArray());

	});

	var attr = '<div id="insrtAttr" title="속성">';
	attr += '<div class="AttrCol">';
	attr += '<div>';
	attr += '<span>ID</span>:<span id="fidVal"></span>';
	// attr += '<button id="addAttr">add</button>';
	attr += '<button id="editAttr">edit</button>';
	attr += '</div>';
	attr += '</div>';
	attr += '<div class="cntSection">';
	attr += '<div class="tbList">';
	attr += '<table class="boardList">';
	attr += '<thead>';
	attr += '<tr><th>속성명</th><th>데이터 타입</th><th>값</th></tr>';
	attr += '</thead>';
	attr += '<tbody id="addedAttr">';
	attr += '</tbody>';
	attr += '</table>';
	attr += '</div>';
	attr += '</div>';
	attr += '</div>';

	$("body").append(attr);

	// 속성입력 다이얼로그 초기화
	$("#insrtAttr").dialog({
		width : 500,
		maxHeight : 600,
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				var feature = selectedFeatures.getArray();
				if (feature.length === 1) {
					feature = feature[0];
				} else {
					console.log("choose only one feature");
				}
				// qweqwe
				var keys = $(".attrKey");
				var values = $(".attrVal");

				// var types = $('select[name="keyType"]');

				var layers = getSelectedLayers();
				var layer;
				if (layers.length === 1) {
					layer = layers[0];
				} else {
					console.log("choose only one layer");
				}
				// 입력한 속성을 피쳐에 저장하는 함수를 연결
				insertInfoToFeature(feature, keys, values);
				$(this).dialog("close");
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	// 포인트 그리기 버튼을 클릭했을때
	$("#ptDraw").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 포인트 드로우 인터랙션을 추가
		addDrawInteraction("Point", map);
		addSnapInteraction(map);
	});

	// 라인 그리기 버튼을 클릭했을때
	$("#lsDraw").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 라인 드로우 인터랙션을 추가
		addDrawInteraction("LineString", map);
		addSnapInteraction(map);
	});

	// 폴리곤 드로우 버튼을 클릭했을때
	$("#pgDraw").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 폴리곤 드로우 인터랙션을 추가
		addDrawInteraction("Polygon", map);
		addSnapInteraction(map);
	});

	// 포인트 그리기 버튼을 클릭했을때
	$("#mtptDraw").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 포인트 드로우 인터랙션을 추가
		addDrawInteraction("MultiPoint", map);
		addSnapInteraction(map);
	});

	// 라인 그리기 버튼을 클릭했을때
	$("#mtlsDraw").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 라인 드로우 인터랙션을 추가
		addDrawInteraction("MultiLineString", map);
		addSnapInteraction(map);
	});

	// 폴리곤 드로우 버튼을 클릭했을때
	$("#mtpgDraw").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 폴리곤 드로우 인터랙션을 추가
		addDrawInteraction("MultiPolygon", map);
		addSnapInteraction(map);
	});

	// 실렉트 버튼을 클릭했을때
	$("#slct").click(function() {
		// 기존 인터랙션을 삭제
		removeMyInteraction(map);
		// 실렉트 인터랙션을 추가
		addSelectInteraction();
	});

	// 모디파이 버튼을 클릭했을때
	$("#mdfy").click(function() {
		// 드로우 인터랙션을 삭제
		map.removeInteraction(draw);
		// 드래그 인터랙션을 삭제
		map.removeInteraction(dragBox);
		// 모디파이 인터랙션을 삭제
		map.removeInteraction(modify);
		// 트랜슬레잇 인터랙션을 삭제
		map.removeInteraction(translate);
		// 모디파이 인터랙션을 추가
		addModifyInteraction(select.getFeatures(), map);
		addSnapInteraction(map);
	});

	// 삭제 버튼을 클릭했을때
	$("#dlet").click(function() {
		// 선택한 피쳐들을 저장한 변수가 undefined 이 아니고 1개 이상이라면
		if (selectedFeatures !== undefined) {
			if (selectedFeatures.getLength() > 0) {
				// 삭제 확인창을 띄움
				$("#deleteConfirmFeature").dialog("open");
			}
		}
	});

	// 무브 버튼을 클릭했을때
	$("#move").click(function() {
		// 드로우 인터랙션 삭제
		map.removeInteraction(draw);
		// 드래그 인터랙션 삭제
		map.removeInteraction(dragBox);
		// 모디파이 인터랙션을 삭제
		map.removeInteraction(modify);
		// 스랜슬레잇 인터랙션을 삭제
		map.removeInteraction(translate);
		// 트랜슬레잇 인터랙션을 추가
		addTranslateInteraction(select.getFeatures(), map);
	});

	// 속성 버튼을 클릭했을때
	$("#attr").click(function() {
		// 속성이 있는지 없는지 조회
		decideInsertOrRetrieve();
		// 속성창을 출력
		$("#insrtAttr").dialog("open");
	});

	// 속성항목 삭제버튼을 클릭했을때
	$(document).on("click", ".attrDelBtn", function() {
		// console.log($(this).parent().attr("id"));
		// 현재 버튼의 부모 엘리먼트(div)의 id를 저장
		var parentId = $(this).parent().attr("id");
		// 부모를 삭제(input과 button을 포함한 div)
		$("#" + parentId).remove();
	});

	$(document).on("click", ".openQAOptBtn", function() {
		var did = $(this).attr("id");
		var lid = did.substring(3);
		console.log(lid);
		showQAOptionWindow(lid);
	});

	$(document).on("change", ".qaOptItem", function() {
		if ($(this).is(":checked")) {
			var wid = this.id + "Weight";
			$("#" + wid).prop("disabled", false);
			if (this.id === "smlnth") {
				$("#lengthValue").prop("disabled", false);
			} else if (this.id === "cnvrdgr") {
				$("#degreeValue").prop("disabled", false);
			} else if (this.id === "smarea") {
				$("#areaValue").prop("disabled", false);
			}
		} else {
			var wid = this.id + "Weight";
			$("#" + wid).val("").prop("disabled", true);
			if (this.id === "smlnth") {
				$("#lengthValue").val("3").prop("disabled", true);
			} else if (this.id === "cnvrdgr") {
				$("#degreeValue").val("90").prop("disabled", true);
			} else if (this.id === "smarea") {
				$("#areaValue").val("3").prop("disabled", true);
			}
		}
	});

	$(document).on("input", ".Weight", function() {
		if (parseInt($(this).val()) === 0) {
			console.log("please insert value over 0");
		}
		setTotalWeight();
	});

	$(document).on(
			"mouseenter",
			".layerPropBtn",
			function() {
				var layer = getLayerById($(this).parent().attr("id"));

				if (layer instanceof ol.layer.Vector || layer instanceof ol.layer.Tile) {
					$("#layerSettingPopup").dialog("widget").find(".ui-dialog-content").css("padding", 0).css("margin",
							0).css("overflow", "visible");
					$("#layerSettingPopup").dialog("widget").css("background-color", "rgba(0,0,0,0)")
							.css("border", "0").css("overflow", "visible");
					$("#layerSettingPopup ul").css("border", "1");
				} else {
					$("#layerSettingPopup").dialog("widget").find(".ui-dialog-content").css("padding", 0).css("margin",
							0).css("overflow", "visible");
					$("#layerSettingPopup").dialog("widget").css("background-color", "rgba(0,0,0,0)")
							.css("border", "0").css("overflow", "visible");
					$("#layerSettingPopup ul").css("border", "0");
				}

				$("#layerSettingPopup").dialog({
					position : {
						my : "left top",
						at : "left top",
						of : this
					}
				}).dialog("open");
				lid = $(this).parent().attr("id");
				var layer = getLayerById(lid);
				if (layer instanceof ol.layer.Vector || layer instanceof ol.layer.Tile) {
					$("#lyrStyle").show();
				} else {
					$("#lyrStyle").hide();
				}
				if (layer instanceof ol.layer.Vector && layer.get("cat") !== "0") {
					$("#lyrAttr").show();
					$("#qaOpt").show();
				} else if (layer instanceof ol.layer.Vector) {
					$("#lyrAttr").show();
				} else {
					$("#lyrAttr").hide();
					$("#qaOpt").hide();
				}

			});

	// 레이어 속성 버튼 클릭시 이벤트
	$(document).on("click", "#lyrStyle", function() {
		// 레이어 스타일창의 ok버튼에 연결된 함수를 변경
		changeBtnFntn("1");
		// 레이어 아이디를 통해 레이어의 스타일을 조회후 출력하는 함수 실행
		loadLayerStyle(lid);
	});

	$(document).on("click", "#lyrAttr", function() {
		var layer = getLayerById(lid);
		if (!(layer instanceof ol.layer.Vector)) {
			console.log("not vector");
			return;
		}
		// 창 출력
		$("#attrSetting").dialog("open");

		$("#lyrAttrList").empty();
		$("#lyrAttrList").append(getAttributeFromLayer(layer));

		$("#attrSetting").dialog({
			width : 515,
			height : 380,
			autoOpen : false,
			modal : true,
			buttons : {
				"확인" : function() {
					setAttributeOnLayer(layer);
					// console.log(JSON.stringify(layer.get("attribute")));
					$(this).dialog("close");
				},
				"취소" : function() {
					$(this).dialog("close");
				}
			}
		});

	});

	$(document).on("click", "#qaOpt", function() {
		showQAOptionWindow(lid);
	});

	// 이슬기
	$(document).on("click", "#chAR", function() {

	});

	$(document).on("mouseleave", "#layerSettingPopup", function() {
		$("#layerSettingPopup").dialog("close");
	});

	// 레이어 이름 수정버튼 클릭시
	$("#editNameBtn").button({
		icons : {
			primary : "ui-icon-locked"
		},
		text : false
	}).click(function() {
		// 레이어 이름의 readonly속성을 false로 바꿈
		$("#layerName").prop("readonly", false).css("border", "1px solid #e3e3e3");
	});

	// 피쳐속성 수정버튼 클릭시
	$("#editAttr").button({
		icons : {
			primary : "ui-icon-scissors"
		}
	}).click(function() {
		switchInputAttr(3);
	});

};

/**
 * 피처의 정보를 보여준다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <ol.Feature>
 */
function popFeatureDialog(features) {

	if (features.length === 1) {
		var feature = features[0];
		var str = getSimpleProperties(feature);
		$("#viewAttr").empty();
		$("#viewAttr").append(str);
	}
	$("#selectPopUp").dialog("open");
}

/**
 * 레이어 ID를 통해 레이어를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @return ol.layer.Base
 */
function getLayerById(id) {
	var layers = map.getLayers().getArray();
	for (var i = 0; i < layers.length; i++) {
		if (layers[i].get("id") === id) {
			return layers[i];
		}
	}
}

/**
 * 화면의 크기를 측정해 적정한 지도영역의 크기를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return Array[width, height]
 */
function setMapDivSize() {
	var height = $(window).height();
	var width = $(window).width();
	$("#content").css("width", width);
	var mapWSize = width - 266;
	var mapHSize = height - 104;
	$("#map").css("width", mapWSize);
	$("#map").css("height", mapHSize);
	map.updateSize();
	return [ mapWSize, mapHSize ];
}

/**
 * 유일한 피처의 ID를 생성한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @param ol.Feature
 * @return ol.Feature
 */
function createFeatureID(layer, feature) {
	var lid = layer.get("id");
	var source = layer.getSource();
	var features = source.getFeatures();

	if (features.length > 0) {
		var max = 1;
		for (var i = 0; i < features.length; i++) {
			var fid = features[i].getId();
			var num = parseInt(fid.substring(fid.indexOf(".") + 1));
			if (num > max) {
				max = num;
			} else {
				continue;
			}
		}
		max++;
		var feat = features[0].getId();
		var lid = feat.substring(0, feat.indexOf("."));
		var fid = lid + "." + max;
		feature.setId(fid);
		return feature;
	} else if (features.length === 0) {
		var fid = layer.get("id") + ".1";
		feature.setId(fid);
		return feature;
	}
}

/**
 * 레이어에 저장된 검수 설정 값을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @return String
 */
function getQASetting(_layer) {
	var qaOpt = "";
	if (_layer instanceof ol.layer.Vector) {
		var qaObj = _layer.get("qaOption");
		var type = _layer.get("type");

		if (qaObj !== undefined && qaObj !== null) {
			switch (type) {
			case "point":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="50%" /><col width="40%" /><col width="0%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>가중치</th></tr></thead>';

				if (qaObj.SelfEntity) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity' checked='checked'></td><td><label for='sfntt'>Self entity</label></td><td><input type='number' id='sfnttWeight' value='"
							+ qaObj.SelfEntity.weight
							+ "' class='Weight' style='width:50px;' min='1' max='100'>%</td><td></td></tr>";
				} else if (!(qaObj.SelfEntity)) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				if (qaObj.EntityDuplicated) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated' checked='checked'></td><td><label for='nttdp'>Entity duplicated</label></td><td><input type='number' value='"
							+ qaObj.EntityDuplicated.weight
							+ "' id='nttdpWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
				} else if (!(qaObj.EntityDuplicated)) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				if (qaObj.AttributeFix) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' value='"
							+ qaObj.AttributeFix.weight
							+ "' id='attrfxWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
					qaOpt += getAttributeForFix(_layer);
				} else if (!(qaObj.AttributeFix)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				if (qaObj.DuplicatedPoint) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='DuplicatedPoint' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' value='"
							+ qaObj.DuplicatedPoint.weight
							+ "' id='attrfxWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
				} else if (!(qaObj.DuplicatedPoint)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				qaOpt += "<tr><td></td><td></td><td>total:<span id='wTotal'>0</span>%</td><td></td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';

				break;
			case "linestring":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';

				if (qaObj.SmallLength) {
					qaOpt += "<tr><td><input type='checkbox' id='smlnth' class='qaOptItem' value='SmallLength' checked='checked'></td><td><label for='smlnth'>Small length</label></td><td><input type='number' id='lengthValue' class='QaLength' value='"
							+ qaObj.SmallLength.value
							+ "' style='width:50px;' />m</td><td><input type='number' value='"
							+ qaObj.SmallLength.weight
							+ "' id='smlnthWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.SmallLength)) {
					qaOpt += "<tr><td><input type='checkbox' id='smlnth' class='qaOptItem' value='SmallLength'></td><td><label for='smlnth'>Small length</label></td><td><input type='number' id='lengthValue' class='QaLength' style='width:50px;' disabled/>m</td><td><input type='number' id='smlnthWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.SelfEntity) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity' checked='checked'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' value='"
							+ qaObj.SelfEntity.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.SelfEntity)) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.EntityDuplicated) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated' checked='checked'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' value='"
							+ qaObj.EntityDuplicated.weight
							+ "' id='nttdpWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.EntityDuplicated)) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.AttributeFix) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' value='"
							+ qaObj.AttributeFix.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
					qaOpt += getAttributeForFix(_layer);
				} else if (!(qaObj.AttributeFix)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.ConBreak) {
					qaOpt += "<tr><td><input type='checkbox' id='cnbrk' class='qaOptItem'  value='ConBreak' checked='checked'></td><td><label for='cnbrk'>Con break</label></td><td></td><td><input type='number' value='"
							+ qaObj.ConBreak.weight
							+ "' id='cnbrkWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.ConBreak)) {
					qaOpt += "<tr><td><input type='checkbox' id='cnbrk' class='qaOptItem'  value='ConBreak'></td><td><label for='cnbrk'>Con break</label></td><td></td><td><input type='number' id='cnbrkWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.ConOverDegree) {
					qaOpt += "<tr><td><input type='checkbox' id='cnvrdgr' class='qaOptItem'  value='ConOverDegree' checked='checked'></td><td><label for='cnvrdgr'>Con over degree</label></td><td><input type='number' id='degreeValue' value='"
							+ qaObj.ConOverDegree.value
							+ "' class='QaDegree' value='90' style='width:50px;' />degree</td><td><input type='number' id='cnvrdgrWeight' class='Weight' style='width:50px;'  min='1' max='100' value='"
							+ qaObj.ConOverDegree.weight + "'>%</td></tr>";
				} else if (!(qaObj.ConOverDegree)) {
					qaOpt += "<tr><td><input type='checkbox' id='cnvrdgr' class='qaOptItem'  value='ConOverDegree'></td><td><label for='cnvrdgr'>Con over degree</label></td><td><input type='number' id='degreeValue' class='QaDegree' value='90' style='width:50px;' disabled/>degree</td><td><input type='number' id='cnvrdgrWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.ConIntersected) {
					qaOpt += "<tr><td><input type='checkbox' id='cntsct' class='qaOptItem'  value='ConIntersected' checked='checked'></td><td><label for='cntsct'>Con intersected</label></td><td></td><td><input type='number' value='"
							+ qaObj.ConIntersected.weight
							+ "' id='cntsctWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.ConIntersected)) {
					qaOpt += "<tr><td><input type='checkbox' id='cntsct' class='qaOptItem'  value='ConIntersected'></td><td><label for='cntsct'>Con intersected</label></td><td></td><td><input type='number' id='cntsctWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.DuplicatedPoint) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint' checked='checked'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' value='"
							+ qaObj.DuplicatedPoint.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.DuplicatedPoint)) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				qaOpt += "<tr><td></td><td></td><td></td><td>total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "polygon":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';

				if (qaObj.SmallArea) {
					qaOpt += "<tr><td><input type='checkbox' id='smarea' class='qaOptItem'  value='SmallArea' checked='checked'></td><td><label for='smarea'>Small area</label></td><td><input type='number' id='areaValue' value='"
							+ qaObj.SmallArea.value
							+ "' class='QaArea' style='width:50px;' disabled/>m2</td><td><input type='number' id='smareaWeight' value='"
							+ qaObj.SmallArea.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.SmallArea)) {
					qaOpt += "<tr><td><input type='checkbox' id='smarea' class='qaOptItem'  value='SmallArea'></td><td><label for='smarea'>Small area</label></td><td><input type='number' id='areaValue' class='QaArea' value='3' style='width:50px;' disabled/>m2</td><td><input type='number' id='smareaWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.SelfEntity) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity' checked='checked'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' value='"
							+ qaObj.SelfEntity.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</div>";
				} else if (!(qaObj.SelfEntity)) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</div>";
				}

				if (qaObj.EntityDuplicated) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated' checked='checked'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' value='"
							+ qaObj.EntityDuplicated.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.EntityDuplicated)) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.AttributeFix) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' value='"
							+ qaObj.AttributeFix.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
					qaOpt += getAttributeForFix(_layer);
				} else if (!(qaObj.AttributeFix)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.DuplicatedPoint) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint' checked='checked'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' value='"
							+ qaObj.DuplicatedPoint.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.DuplicatedPoint)) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				qaOpt += "<tr><td></td><td></td><td></td><td>total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "multipoint":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>가중치</th></tr></thead>';
				if (qaObj.SelfEntity) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity' checked='checked'></td><td><label for='sfntt'>Self entity</label></td><td><input type='number' id='sfnttWeight' value='"
							+ qaObj.SelfEntity.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
				} else if (!(qaObj.SelfEntity)) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				if (qaObj.EntityDuplicated) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated' checked='checked'></td><td><label for='nttdp'>Entity duplicated</label></td><td><input type='number' value='"
							+ qaObj.EntityDuplicated.weight
							+ "' id='nttdpWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
				} else if (!(qaObj.EntityDuplicated)) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				if (qaObj.AttributeFix) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' value='"
							+ qaObj.AttributeFix.weight
							+ "' id='attrfxWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
					qaOpt += getAttributeForFix(_layer);
				} else if (!(qaObj.AttributeFix)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				if (qaObj.DuplicatedPoint) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='DuplicatedPoint' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' value='"
							+ qaObj.DuplicatedPoint.weight
							+ "' id='attrfxWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td><td></td></tr>";
				} else if (!(qaObj.DuplicatedPoint)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td><td></td></tr>";
				}

				qaOpt += "<tr><td></td><td></td><td></td><td>total:<span id='wTotal'>0</span>%</td><td></td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "multilinestring":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';
				console.log(qaObj);
				if (qaObj.SmallLength) {
					console.log("있음");
					qaOpt += "<tr><td><input type='checkbox' id='smlnth' class='qaOptItem' value='SmallLength' checked='checked'></td><td><label for='smlnth'>Small length</label></td><td><input type='number' id='lengthValue' class='QaLength' value='"
							+ qaObj.SmallLength.value
							+ "' style='width:50px;' />m</td><td><input type='number' value='"
							+ qaObj.SmallLength.weight
							+ "' id='smlnthWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.SmallLength)) {
					console.log("없음");
					qaOpt += "<tr><td><input type='checkbox' id='smlnth' class='qaOptItem' value='SmallLength'></td><td><label for='smlnth'>Small length</label></td><td><input type='number' id='lengthValue' class='QaLength' style='width:50px;' disabled/>m</td><td><input type='number' id='smlnthWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.SelfEntity) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity' checked='checked'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' value='"
							+ qaObj.SelfEntity.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.SelfEntity)) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.EntityDuplicated) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated' checked='checked'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' value='"
							+ qaObj.EntityDuplicated.weight
							+ "' id='nttdpWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.EntityDuplicated)) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.AttributeFix) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' value='"
							+ qaObj.AttributeFix.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
					qaOpt += getAttributeForFix(_layer);
				} else if (!(qaObj.AttributeFix)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.ConBreak) {
					qaOpt += "<tr><td><input type='checkbox' id='cnbrk' class='qaOptItem'  value='ConBreak' checked='checked'></td><td><label for='cnbrk'>Con break</label></td><td></td><td><input type='number' value='"
							+ qaObj.ConBreak.weight
							+ "' id='cnbrkWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.ConBreak)) {
					qaOpt += "<tr><td><input type='checkbox' id='cnbrk' class='qaOptItem'  value='ConBreak'></td><td><label for='cnbrk'>Con break</label></td><td></td><td><input type='number' id='cnbrkWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.ConOverDegree) {
					qaOpt += "<tr><td><input type='checkbox' id='cnvrdgr' class='qaOptItem'  value='ConOverDegree' checked='checked'></td><td><label for='cnvrdgr'>Con over degree</label></td><td><input type='number' id='degreeValue' value='"
							+ qaObj.ConOverDegree.value
							+ "' class='QaDegree' value='90' style='width:50px;' />degree</td><td><input type='number' id='cnvrdgrWeight' class='Weight' style='width:50px;'  min='1' max='100' value='"
							+ qaObj.ConOverDegree.weight + "'>%</td></tr>";
				} else if (!(qaObj.ConOverDegree)) {
					qaOpt += "<tr><td><input type='checkbox' id='cnvrdgr' class='qaOptItem'  value='ConOverDegree'></td><td><label for='cnvrdgr'>Con over degree</label></td><td><input type='number' id='degreeValue' class='QaDegree' value='90' style='width:50px;' disabled/>degree</td><td><input type='number' id='cnvrdgrWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.ConIntersected) {
					qaOpt += "<tr><td><input type='checkbox' id='cntsct' class='qaOptItem'  value='ConIntersected' checked='checked'></td><td><label for='cntsct'>Con intersected</label></td><td></td><td><input type='number' value='"
							+ qaObj.ConIntersected.weight
							+ "' id='cntsctWeight' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.ConIntersected)) {
					qaOpt += "<tr><td><input type='checkbox' id='cntsct' class='qaOptItem'  value='ConIntersected'></td><td><label for='cntsct'>Con intersected</label></td><td></td><td><input type='number' id='cntsctWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.DuplicatedPoint) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint' checked='checked'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' value='"
							+ qaObj.DuplicatedPoint.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.DuplicatedPoint)) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				qaOpt += "<tr><td></td><td></td><td></td><td>total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "multipolygon":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';
				if (qaObj.SmallArea) {
					qaOpt += "<tr><td><input type='checkbox' id='smarea' class='qaOptItem'  value='SmallArea' checked='checked'></td><td><label for='smarea'>Small area</label></td><td><input type='number' id='areaValue' value='"
							+ qaObj.SmallArea.value
							+ "' class='QaArea' style='width:50px;' />m2</td><td><input type='number' id='smareaWeight' value='"
							+ qaObj.SmallArea.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.SmallArea)) {
					qaOpt += "<tr><td><input type='checkbox' id='smarea' class='qaOptItem'  value='SmallArea'></td><td><label for='smarea'>Small area</label></td><td><input type='number' id='areaValue' class='QaArea' value='3' style='width:50px;' disabled/>m2</td><td><input type='number' id='smareaWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.SelfEntity) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity' checked='checked'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' value='"
							+ qaObj.SelfEntity.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</div>";
				} else if (!(qaObj.SelfEntity)) {
					qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</div>";
				}

				if (qaObj.EntityDuplicated) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated' checked='checked'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' value='"
							+ qaObj.EntityDuplicated.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.EntityDuplicated)) {
					qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.AttributeFix) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix' checked='checked'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' value='"
							+ qaObj.AttributeFix.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
					qaOpt += getAttributeForFix(_layer);
				} else if (!(qaObj.AttributeFix)) {
					qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				if (qaObj.DuplicatedPoint) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint' checked='checked'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' value='"
							+ qaObj.DuplicatedPoint.weight
							+ "' class='Weight' style='width:50px;'  min='1' max='100'>%</td></tr>";
				} else if (!(qaObj.DuplicatedPoint)) {
					qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				}

				qaOpt += "<tr><td></td><td></td><td></td><td>total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			default:
				break;
			}
		} else {
			switch (type) {
			case "point":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>가중치</th></tr></thead>';
				qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem' value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td></td><td></td><td>Total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "linestring":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';
				qaOpt += "<tr><td><input type='checkbox' id='smlnth' class='qaOptItem' value='SmallLength'></td><td><label for='smlnth'>Small length</label></td><td><input type='number' id='lengthValue' class='QaLength' value='3' style='width:50px;' disabled/>m</td><td><input type='number' id='smlnthWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='cnbrk' class='qaOptItem'  value='ConBreak'></td><td><label for='cnbrk'>Con break</label></td><td></td><td><input type='number' id='cnbrkWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='cnvrdgr' class='qaOptItem'  value='ConOverDegree'></td><td><label for='cnvrdgr'>Con over degree</label></td><td><input type='number' id='degreeValue' class='QaDegree' value='90' style='width:50px;' disabled/>degree</td><td><input type='number' id='cnvrdgrWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='cntsct' class='qaOptItem'  value='ConIntersected'></td><td><label for='cntsct'>Con intersected</label></td><td></td><td><input type='number' id='cntsctWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";

				qaOpt += "<tr><td></td><td></td><td></td><td>Total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "polygon":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';
				qaOpt += "<tr><td><input type='checkbox' id='smarea' class='qaOptItem'  value='SmallArea'></td><td><label for='smarea'>Small area</label></td><td><input type='number' id='areaValue' class='QaArea' value='3' style='width:50px;' disabled/>m2</td><td><input type='number' id='smareaWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</div>";
				qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";

				qaOpt += "<tr><td></td><td></td><td></td><td>Total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "multipoint":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>가중치</th></tr></thead>';
				qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='ptdp' class='qaOptItem' value='PointDuplicated'></td><td><label for='ptdp'>Point duplicated</label></td><td><input type='number' id='ptdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td></td><td></td><td></td><td>Total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "multilinestring":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';
				qaOpt += "<tr><td><input type='checkbox' id='smlnth' class='qaOptItem' value='SmallLength'></td><td><label for='smlnth'>Small length</label></td><td><input type='number' id='lengthValue' class='QaLength' value='3' style='width:50px;' disabled/>m</td><td><input type='number' id='smlnthWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='cnbrk' class='qaOptItem'  value='ConBreak'></td><td><label for='cnbrk'>Con break</label></td><td></td><td><input type='number' id='cnbrkWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='cnvrdgr' class='qaOptItem'  value='ConOverDegree'></td><td><label for='cnvrdgr'>Con over degree</label></td><td><input type='number' id='degreeValue' class='QaDegree' value='90' style='width:50px;' disabled/>degree</td><td><input type='number' id='cnvrdgrWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='cntsct' class='qaOptItem'  value='ConIntersected'></td><td><label for='cntsct'>Con intersected</label></td><td></td><td><input type='number' id='cntsctWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";

				qaOpt += "<tr><td></td><td></td><td></td><td>Total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			case "multipolygon":
				qaOpt += '<div class="cntSection">';
				qaOpt += '<div class="tbList">';
				qaOpt += "<table class='boardList'>";
				qaOpt += '<colgroup><col width="10%" /><col width="40%" /><col width="20%" /><col width="30%" /></colgroup>';
				qaOpt += '<thead><tr><th>선택</th><th>오류명</th><th>기준값</th><th>가중치</th></tr></thead>';
				qaOpt += "<tr><td><input type='checkbox' id='smarea' class='qaOptItem'  value='SmallArea'></td><td><label for='smarea'>Small area</label></td><td><input type='number' id='areaValue' class='QaArea' value='3' style='width:50px;' disabled/>m<sup>2</sup></td><td><input type='number' id='smareaWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='sfntt' class='qaOptItem' value='SelfEntity'></td><td><label for='sfntt'>Self entity</label></td><td></td><td><input type='number' id='sfnttWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</div>";
				qaOpt += "<tr><td><input type='checkbox' id='nttdp' class='qaOptItem' value='EntityDuplicated'></td><td><label for='nttdp'>Entity duplicated</label></td><td></td><td><input type='number' id='nttdpWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='attrfx' class='qaOptItem'  value='AttributeFix'></td><td><label for='attrfx'>Attribute fix</label></td><td></td><td><input type='number' id='attrfxWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";
				qaOpt += "<tr><td><input type='checkbox' id='dppt' class='qaOptItem'  value='DuplicatedPoint'></td><td><label for='dppt'>Duplicated point</label></td><td></td><td><input type='number' id='dpptWeight' class='Weight' style='width:50px;' disabled min='1' max='100'>%</td></tr>";

				qaOpt += "<tr><td></td><td></td><td></td><td>Total:<span id='wTotal'>0</span>%</td></tr>";
				qaOpt += "</table>";
				qaOpt += '</div>';
				qaOpt += '</div>';
				break;
			default:
				break;
			}
		}

	} else {
		console.log("not a vector layer");
	}
	return qaOpt;
}

/**
 * 레이어에 검수 설정 값을 저장한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 */
function setQAOptionOnLayer(_layer) {
	var qa = $("input:checkbox:checked.qaOptItem");
	var qaObj = {};
	if (qa.length > 0) {
		for (var i = 0; i < qa.length; i++) {
			if ($(qa[i]).val() === "SmallLength") {
				var val = $("#lengthValue").val();
				var weight = $("#smlnthWeight").val();
				qaObj[$(qa[i]).val()] = {
					value : val,
					weight : weight
				};
			} else if ($(qa[i]).val() === "SmallArea") {
				var val = $("#areaValue").val();
				var weight = $("#smareaWeight").val();
				qaObj[$(qa[i]).val()] = {
					value : val,
					weight : weight
				};
			} else if ($(qa[i]).val() === "ConOverDegree") {
				var val = $("#degreeValue").val();
				var weight = $("#cnvrdgrWeight").val();
				qaObj[$(qa[i]).val()] = {
					value : val,
					weight : weight
				};
			} else if ($(qa[i]).val() === "AttributeFix") {
				var weight = $("#attrfxWeight").val();
				qaObj[$(qa[i]).val()] = {
					value : getNotNullAttribute(),
					weight : weight
				};
			} else {
				var id = $(qa[i]).attr("id") + "Weight";
				var weight = $("#" + id).val();
				qaObj[$(qa[i]).val()] = {
					weight : weight
				};
			}
		}
		// console.log(JSON.stringify(qaObj));
		_layer.set("qaOption", qaObj);
	} else {
		console.log("not selected qa option");
	}
}

/**
 * 레이어에서 피처 속성명 값을 가져온다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @return String
 */
function getAttributeFromLayer(_layer) {
	var attrObj = _layer.get("attribute");
	if (attrObj !== undefined) {
		var keys = Object.keys(attrObj);
		var str = "";
		str += '<thead><tr><th>이름</th><th>데이터 타입</th></tr></thead>';
		for (var i = 0; i < keys.length; i++) {
			str += "<tr class='LyrAttrRow'><td class='LyrKeyName' style='border: 1px solid #e3e3e3;'>" + keys[i]
					+ "</td><td class='LyrKeyType' style='border: 1px solid #e3e3e3;'>" + attrObj[keys[i]]
					+ "</td></tr>";
		}
		return str;
	}
}

/**
 * 피처 속성명 값을 레이어에 저장한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 */
function setAttributeOnLayer(_layer) {
	var row = $(".LyrAttrRow");
	// var name = $(".LyrAttrRow .LyrKeyName");
	// var type = $(".LyrAttrRow .LyrKeyType");
	var attrObj = {};
	if (row.length > 0) {
		for (var i = 0; i < row.length; i++) {
			var name = $(row[i]).children(".LyrKeyName");
			var type = $(row[i]).children(".LyrKeyType");
			attrObj[$(name).text()] = $(type).text();
		}
		// console.log(JSON.stringify(attrObj));
		_layer.set("attribute", attrObj);
	}
}

/**
 * 도구상자의 버튼을 숨긴다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function disabledTool() {
	$(".editTool").css("display", "none");
}

/**
 * 도구상자의 버튼을 보여준다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function enabledTool() {
	$(".editTool").css("display", "block");
}

var apprvlLyr;

/**
 * 승인된 레이어를 설정한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Group
 */
function setApprovalLayer(layer) {
	if (layer.get("cat") === 0 && layer instanceof ol.layer.Group) {
		var arr = layer.getLayers().getArray();
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] instanceof ol.layer.Vector) {
				apprvlLyr = arr[i];
			}
		}
	}
}

/**
 * 지도 확대 수준에 따른 벡터 피처 불러오기
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @param String
 */
function checkZoomGetFeature(apprvlLyr, lName) {
	var zoomLevel = map.getView().getZoom();
	// console.log(zoomLevel);
	if (zoomLevel >= 18) {
		// console.log(apprvlLyr instanceof ol.layer.Vector);
		if (apprvlLyr instanceof ol.layer.Vector) {
			// console.log("getin");
			var xtnt = map.getView().calculateExtent(map.getSize());
			var trnsXtnt = ol.proj.transformExtent(xtnt, "EPSG:3857", "EPSG:4326");
			var prmt = {
				service : "WFS",
				version : "1.0.0",
				request : "GetFeature",
				typename : lName,
				outputFormat : "application/json",
				srsname : "EPSG:4326",
				bbox : trnsXtnt.join(",")
			};

			var str = $.param(prmt);
			var loc = "http://175.116.181.39:9990/geoserver/wfs?";

			loc += str;

			var obj = {
				url : loc
			};

			str = $.param(obj);

			var cntr = getContextPath() + '/geoserver/proxy.ajax';

			// var vectorSource = new ol.source.Vector();

			var features;

			$.ajax({
				async : false,
				url : cntr,
				type : "post",
				dataType : "json",
				data : obj,
				beforeSend : function() { // 호출전실행
					loadImageShow();
				},
				success : function(data, textStatus, jqXHR) {
					loadImageHide();
					// var result = JSON.parse(data);
					// console.log(JSON.stringify(data));
					// var str = JSON.stringify(result);

					// var id = createLayerId();

					var features = new ol.format.GeoJSON().readFeatures(data, {
						dataProjection : 'EPSG:4326',
						featureProjection : 'EPSG:3857'
					});

					apprvlLyr.getSource().addFeatures(features);

				},
				error : function(jqXHR, textStatus, errorThrown) {

				}
			});

		}
	}
}

/**
 * 승인된 레이어 내부의 벡터 레이어를 불러온다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 * @param String
 * @return ol.layer.Vector
 */
function getApprovalLayer(name, type) {

	var prmt = {
		service : "WFS",
		version : "1.0.0",
		request : "GetFeature",
		typename : name,
		outputFormat : "application/json",
		srsname : "EPSG:4326"
	};

	var str = $.param(prmt);
	var loc = "http://175.116.181.39:9990/geoserver/wfs?";

	loc += str;

	var obj = {
		url : loc
	};

	str = $.param(obj);

	var cntr = getContextPath() + '/geoserver/proxy.ajax';

	var features;
	var vectorSource;
	var layer;
	$.ajax({
		async : false,
		url : cntr,
		type : "post",
		dataType : "json",
		data : obj,
		beforeSend : function() { // 호출전실행
			loadImageShow();
		},
		success : function(data, textStatus, jqXHR) {
			loadImageHide();
			// var result = JSON.parse(data);
			// console.log(JSON.stringify(data));
			// var str = JSON.stringify(result);

			// var id = createLayerId();

			var features = new ol.format.GeoJSON().readFeatures(data, {
				dataProjection : 'EPSG:4326',
				featureProjection : 'EPSG:3857'
			});

			vectorSource = new ol.source.Vector({
				wrapX : false
			});

			vectorSource.addFeatures(features);

			layer = new ol.layer.Vector({
				source : vectorSource
			});
			layer = setLayerProperties(layer, name, name, type, "new", 0, false, null);

		},
		error : function(jqXHR, textStatus, errorThrown) {

		}
	});
	// console.log(layer.get("cat"));
	return layer;
}

/**
 * 가중치의 합을 표시한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 */
function setTotalWeight() {
	var ttl = $("input.Weight:enabled");
	var total = 0;
	for (var i = 0; i < ttl.length; i++) {
		if ($(ttl[i]).val() !== "") {
			total += parseInt($(ttl[i]).val());
		}
	}
	$("#wTotal").text(total);
}

/**
 * AttributeFix 검수를 위한 피처속성을 표시한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @return String
 */
function showAttributeForFix(layer) {
	var attr = layer.get("attribute");
	if (attr === null || attr === undefined) {
		console.log("Layer doesn't have attribute");
		return;
	}
	var keys = Object.keys(attr);
	var str = "";
	str += "<tr id='fixInfo'>";
	str += "<td colspan='4'>";
	str += "<div>";
	str += "<table>";
	str += '<thead><tr><th>번호</th><th>필수입력</th><th>속성명</th></tr></thead>';
	for (var i = 0; i < keys.length; i++) {
		str += "<tr>";
		str += "<td>" + (i + 1) + "</td>";
		str += "<td><input type='checkbox' class='RequiredAttribute' value='" + keys[i] + "'/></td>";
		str += "<td>" + keys[i] + "</td>";
		str += "</tr>";
	}
	str += "</table>";
	str += "</div>";
	str += "</td>";
	str += "</tr>";
	return str;
}

/**
 * NULL을 허용하지 않는 속성명을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return Array<String>
 */
function getNotNullAttribute() {
	var attrObj = [];
	$("input:checkbox:checked.RequiredAttribute").each(function() {
		attrObj.push($(this).val());
	});
	return attrObj;
}

/**
 * AttributeFix 검수 설정 값을 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param ol.layer.Vector
 * @return String
 */
function getAttributeForFix(layer) {
	var attr = layer.get("attribute");

	if (attr === null || attr === undefined) {
		console.log("Layer doesn't have attribute");
		return;
	}

	var keys = Object.keys(attr);
	var qaOption = layer.get("qaOption");
	var qaKeys = qaOption.AttributeFix.value;
	var str = "";
	str += "<tr id='fixInfo'>";
	str += "<td colspan='4'>";
	str += "<div>";
	str += "<table>";
	str += '<thead><tr><th>번호</th><th>필수입력</th><th>속성명</th></tr></thead>';
	for (var i = 0; i < keys.length; i++) {

		str += "<tr>";
		str += "<td>" + (i + 1) + "</td>";
		str += "<td><input type='checkbox' class='RequiredAttribute' value='" + keys[i] + "'/></td>";
		str += "<td>" + keys[i] + "</td>";
		str += "</tr>";

	}
	str += "</table>";
	str += "</div>";
	str += "</td>";
	str += "</tr>";
	return str;
}

/**
 * 검수 설정에 따라 AttributeFix 검수 항목에 지정된 속성을 체크한 상태로 변환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param Array
 *            <String>
 */
function checkAttributeFixCheckbox(attr) {
	for (var i = 0; i < attr.length; i++) {
		$(".RequiredAttribute").each(function() {
			if ($(this).val() === attr[i]) {
				$(this).prop("checked", true);
				return false;
			}
		});
	}
}

/**
 * 가중치의 비율 값을 검사한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return Boolean
 */
function checkWeightRatio() {
	var flag = true;
	var lcValue = $("input.qalength:enabled");
	lcValue.each(function() {
		console.log(parseInt($(this).val()));
		if (isNaN($(this).val()) === true) {

			$("<div title='Message'>1 이상의 숫자만 입력 가능합니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		} else if ((parseInt($(this).val()) < 1)) {
			$("<div title='Message'>1 이상의 숫자만 입력 가능합니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		} else if ($(this).val() === "") {
			$("<div title='Message'>기준값을 입력해주세요.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		}
	});
	var dcValue = $("input.qadegree:enabled");
	dcValue.each(function() {
		if (isNaN($(this).val()) === true) {

			$("<div title='Message'>1 이상의 숫자만 입력 가능합니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		} else if ((parseInt($(this).val()) < 1)) {
			$("<div title='Message'>1 이상의 숫자만 입력 가능합니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		} else if ($(this).val() === "") {
			$("<div title='Message'>기준값을 입력해주세요.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		}
	});
	var acValue = $("input.qaarea:enabled");
	acValue.each(function() {
		if (isNaN($(this).val()) === true) {

			$("<div title='Message'>1 이상의 숫자만 입력 가능합니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		} else if ((parseInt($(this).val()) < 1)) {
			$("<div title='Message'>1 이상의 숫자만 입력 가능합니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		} else if ($(this).val() === "") {
			$("<div title='Message'>기준값을 입력해주세요.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			flag = false;
		}
	});

	var ttl = $("input.Weight:enabled");
	var total = 0;
	for (var i = 0; i < ttl.length; i++) {
		if ($(ttl[i]).val() !== "") {
			if (parseInt($(ttl[i]).val()) > 0) {
				total += parseInt($(ttl[i]).val());
			} else {
				$("<div title='Message'>가중치의 값은 1~100까지 입니다.</div>").dialog({
					buttons : {
						"확인" : function() {
							$(this).dialog("close");
						}
					}
				});
				console.log("0 value is not allowed");
				flag = false;
			}
		} else {
			$("<div title='Message'>가중치의 값은 1~100까지 입니다.</div>").dialog({
				buttons : {
					"확인" : function() {
						$(this).dialog("close");
					}
				}
			});
			console.log("0 value is not allowed");
			flag = false;
		}
	}
	if (total !== 100) {
		$("<div title='Message'>가중치의 합은 100%가 되어야 합니다.</div>").dialog({
			buttons : {
				"확인" : function() {
					$(this).dialog("close");
				}
			}
		});
		console.log("Total weight must be 100%");
		flag = false;
	}
	return flag;
}

/**
 * Contextpath를 구한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return String
 */
function getContextPath() {
	var offset = location.href.indexOf(location.host) + location.host.length;
	var ctxPath = location.href.substring(offset, location.href.indexOf('/', offset + 1));
	return ctxPath;
}

/**
 * 검수 설정 창을 보여준다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @param String
 */
function showQAOptionWindow(lid) {
	var layer = getLayerById(lid);
	if (!(layer instanceof ol.layer.Vector)) {
		console.log("not vector");
		return;
	}
	// 창 출력
	$("#qaSetting").dialog("open");
	var layer = getLayerById(lid);

	$("#qaSetting").empty();
	$("#qaSetting").append(getQASetting(layer));
	setTotalWeight();
	var qaOpt = layer.get("qaOption");
	if (qaOpt !== undefined) {
		if (qaOpt.AttributeFix !== undefined && qaOpt.AttributeFix !== null) {
			var attrObj = qaOpt.AttributeFix;
			checkAttributeFixCheckbox(attrObj.value);
		}
	}

	$("#qaSetting").dialog({
		width : 545,
		height : 450,
		autoOpen : false,
		modal : true,
		buttons : {
			"확인" : function() {
				if (checkWeightRatio()) {
					setQAOptionOnLayer(layer);
					$(this).dialog("close");
				}
				// console.log(JSON.stringify(layer.get("qaOption")));
			},
			"취소" : function() {
				$(this).dialog("close");
			}
		}
	});

	if (layer.get("qaOption") !== null && layer.get("qaOption") !== undefined) {
		// console.log(JSON.stringify(layer.get("qaOption")));
		var qaObj = layer.get("qaOption");
		var key = Object.keys(qaObj);
		for (var i = 0; i < key.length; i++) {
			$("#" + key[i]).prop("checked", true);
		}
	} else {
		// console.log("empty");
	}
}

/**
 * 오류 보고서 객체를 반환한다.
 * 
 * @author yijun.so
 * @date 2016. 02
 * @return Object
 */
function getErrReport() {
	return errReport;
}
