package opennomics.com.common.qa.center;

import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.feature.SchemaException;
import org.json.simple.JSONObject;

/**
 * SimpleFeatureCollection의 검수를 수행한다.
 * @author dayeon.oh
 * @data 2016.02
 */
public interface QACenter {
	
	/**
	 * Point 타입의 승인을 요청한 SimpleFeatureCollection과 승인된 SimpleFeatureCollection을 qaOption에 따라 검수한다.
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaOption
	 * 			검수 옵션
	 * @param newLayer
	 * 			승인을 요청한 SimpleFeatureCollection
	 * @param appLayer
	 * 			승인된 SimpleFeatureCollection
	 * @return JSONObject
	 * @throws SchemaException
	 */
	JSONObject pointLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException;
	
	/**
	 * LineString 타입의 승인을 요청한 SimpleFeatureCollection과 승인된 SimpleFeatureCollection을 qaOption에 따라 검수한다.
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaOption
	 * 			검수 옵션
	 * @param newLayer
	 * 			승인을 요청한 SimpleFeatureCollection
	 * @param appLayer
	 * 			승인된 SimpleFeatureCollection
	 * @return JSONObject
	 * @throws SchemaException
	 */
	JSONObject lineStringLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException;

	/**
	 * Polygon 타입의 승인을 요청한 SimpleFeatureCollection과 승인된 SimpleFeatureCollection을 qaOption에 따라 검수한다.
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaOption
	 * 			검수 옵션
	 * @param newLayer
	 * 			승인을 요청한 SimpleFeatureCollection
	 * @param appLayer
	 * 			승인된 SimpleFeatureCollection
	 * @return JSONObject
	 * @throws SchemaException
	 */
	JSONObject polygonLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException;

	/**
	 * MultiPoint 타입의 승인을 요청한 SimpleFeatureCollection과 승인된 SimpleFeatureCollection을 qaOption에 따라 검수한다.
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaOption
	 * 			검수 옵션
	 * @param newLayer
	 * 			승인을 요청한 SimpleFeatureCollection
	 * @param appLayer
	 * 			승인된 SimpleFeatureCollection
	 * @return JSONObject
	 * @throws SchemaException
	 */
	JSONObject mtPointLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException;

	/**
	 * MultiLineString 타입의 승인을 요청한 SimpleFeatureCollection과 승인된
	 * SimpleFeatureCollection을 qaOption에 따라 검수한다.
	 * 
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaOption
	 *            검수 옵션
	 * @param newLayer
	 *            승인을 요청한 SimpleFeatureCollection
	 * @param appLayer
	 *            승인된 SimpleFeatureCollection
	 * @return JSONObject
	 * @throws SchemaException
	 */
	JSONObject mtLineStringLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException;

	/**
	 * MultiPolygon 타입의 승인을 요청한 SimpleFeatureCollection과 승인된 SimpleFeatureCollection을 qaOption에 따라 검수한다.
	 * @author dayeon.oh
	 * @data 2016.02
	 * @param qaOption
	 * 			검수 옵션
	 * @param newLayer
	 * 			승인을 요청한 SimpleFeatureCollection
	 * @param appLayer
	 * 			승인된 SimpleFeatureCollection
	 * @return JSONObject
	 * @throws SchemaException
	 */
	JSONObject mtPolygonLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException;
}