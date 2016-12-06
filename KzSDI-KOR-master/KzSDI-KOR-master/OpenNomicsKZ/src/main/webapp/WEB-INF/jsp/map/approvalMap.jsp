<html>
<head>
<%@ include file="/WEB-INF/jsp/common/common.jsp"%>
<script src="${ctx}/js/gitbuilder/gitbuilder.js"></script>
<link rel="stylesheet" href="${ctx}/js/gitbuilder/gitbuilder.css">
<script src="${ctx}/js/gserver/approvalMap.js"></script>
<script src="${ctx}/js/spectrum/spectrum.js"></script>
<link rel="stylesheet" href="${ctx}/js/spectrum/spectrum.css">
<script src="${ctx}/js/ol3/ol.js"></script>
<link rel="stylesheet" href="${ctx}/js/ol3/ol.css">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>approval map</title>
</head>
<body>

	<div id="wrap">
		<div id="header">
			<jsp:include page="/WEB-INF/jsp/common/header.jsp" />
		</div>
		<div id="content">
			<div id="layer"></div>
			<div id="map"></div>
		</div>
	</div>

	<script type="text/javascript">
		setCoordinateMenu($("#layer"));
		setApprovalLayerList($("#layer"));
		var map = setApprovalMapArea($("#map"));
		initProject();
		addApprovalLayerOnList(setLayerProperties(createBaseTileLayer("osm"), "osm base layer", createLayerId(), "tile", "new",
				null, null));
	</script>
</body>
</html>