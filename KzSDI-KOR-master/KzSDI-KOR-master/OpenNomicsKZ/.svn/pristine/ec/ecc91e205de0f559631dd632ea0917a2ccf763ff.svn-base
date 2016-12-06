package opennomics.com.common.qa;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

import org.geotools.data.DataStoreFinder;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureSource;
import org.opengis.filter.Filter;

public class DataIO {

	// Read SHP File
	public SimpleFeatureCollection readSHP(String filePath) {

		File file = new File(filePath);
		Map<String, Object> map = new HashMap<String, Object>();

		ShapefileDataStore dataStore;
		String typeName;
		SimpleFeatureCollection collection = null;

		try {
			map.put("url", file.toURI().toURL());
			dataStore = (ShapefileDataStore) DataStoreFinder.getDataStore(map);
			typeName = dataStore.getTypeNames()[0];

			SimpleFeatureSource source = dataStore.getFeatureSource(typeName);
			Filter filter = Filter.INCLUDE; // ECQL.toFilter("BBOX(THE_GEOM, 10,20,30,40)")
			collection = (SimpleFeatureCollection) source.getFeatures(filter);

		} catch (Exception e) {
			e.printStackTrace();
		}

		return collection;
	}
}
