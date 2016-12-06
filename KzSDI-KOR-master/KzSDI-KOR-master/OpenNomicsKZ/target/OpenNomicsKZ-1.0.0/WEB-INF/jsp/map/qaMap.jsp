<%@ page contentType="text/html; charset=UTF-8" %>
<html>
<head>
<%@ include file="/WEB-INF/jsp/common/common.jsp"%>
<script src="${ctx}/js/gitbuilder/gitbuilder.js"></script>
<link rel="stylesheet" href="${ctx}/js/gitbuilder/gitbuilder.css">
<script src="${ctx}/js/gserver/gserver.js"></script>
<script src="${ctx}/js/inspector/excel.js"></script>
<script src="${ctx}/js/spectrum/spectrum.js"></script>
<link rel="stylesheet" href="${ctx}/js/spectrum/spectrum.css">
<script src="${ctx}/js/ol3/ol.js"></script>
<link rel="stylesheet" href="${ctx}/js/ol3/ol.css">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>QA Report</title>
</head>
<body>
	<input type="hidden" id="manager" value="${gservervo}" />
	<input type="hidden" id="sid" value="${gservervo.id}" />
	<input type="hidden" id="surl" value="${gservervo.url}" />
	<input type="hidden" id="list" value="${layerlist}" />
	<input type="hidden" id="rid" value="${rid}" />
	<input type="hidden" id="tname" value="${tname}" />

	<div id="wrap">
		<div id="header">
			<jsp:include page="/WEB-INF/jsp/common/header.jsp" />
		</div>
		<div id="content">
			<div id="layer"></div>
			<div id="map"></div>
		</div>
		<div id="errContent">
			<img src="${pageContext.request.contextPath}/js/gitbuilder/image/down.png" id="closeReport" />

<!-- 						<div class="cntNaviWarp"> -->
<!-- 				<div class="cntSection"> -->
			<div id="rptTable">
				<div class="cntWarp">
					<h3>Error Report</h3>
					<div class="tbList" style="margin-top: 10px;">
					<table class="boardList">
						<colgroup>
							<col width="10%" />
							<col width="12%" />
							<col width="15%" />
							<col width="15%" />
							<col width="15%" />
							<col width="10%" />
							<col width="25%" />
						</colgroup>
						<thead>
							<tr>
								<th>Type</th>
								<th>Number of items</br>in lot</th>
								<th>Number of</br>non-conforming items</th>
								<th>Ratio of</br>non- conforming</th>
								<th>Accuracy Proportion</br>(defined as 1-ratio)</th>
								<th>Weights</th>
								<th>Weighted value</br>(accuracy proportion * weight)</th>
							</tr>
						</thead>
						<tbody id="tableBody">
						</tbody>
					</table>
				</div>
					<div align="right" id="addButton" style="margin-top: 10px;"></div>
				</div>
			</div>
		</div>

<!-- 			</div> -->
<!-- 		</div> -->
	</div>

	<div id="mask"></div>

	<script type="text/javascript">
		setCoordinateMenu($("#layer"));
		setLayerButton($("#layer"));
		setLayerList($("#layer"));
		setToolBox();

		var map = setMapArea($("#map"));
		initProject();
		addLayerOnList(setLayerProperties(createBaseTileLayer("osm"),
				"osm base layer", createLayerId(), "tile", "new", null, null));
	</script>

</body>
</html>