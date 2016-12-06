package opennomics.com.main.file.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import opennomics.com.common.ConvertService;
import opennomics.com.common.qa.DataIO;

import org.geotools.data.simple.SimpleFeatureCollection;
import org.springframework.stereotype.Service;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;
import com.vividsolutions.jts.geom.Geometry;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * 파일관련 데이터 처리
 * 
 * @author SG.Lee
 * @Date 2015.12.22
 * */
@Service
public class UploadServiceImpl extends EgovAbstractServiceImpl implements UploadService {


	/**
	 * File(Shp) - GeoJSON 변환 
	 * 
	 * @author SG.Lee
	 * @Date 2015.12.22
	 * */
	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> getFileLayer(HttpServletRequest request, String folderName) {

		ServletContext scontext = request.getSession().getServletContext();
		// 저장되는 경로
		String savePath = scontext.getRealPath(folderName);
		// 사이즈 제한
		int sizeLimit = 2147483647; // 2기가
		MultipartRequest multi = null;
		// 저장
		try {
			multi = new MultipartRequest(request, savePath, sizeLimit, "utf-8", new DefaultFileRenamePolicy());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// 최종적으로 RegisterALL해줘야 업로드 완료
		//ogr.RegisterAll();

		// Shp File - Geometry
		String fileName = multi.getFilesystemName("shp");
		String fileRoute = savePath + "\\" + fileName;

		DataIO dataIO = new DataIO();
		SimpleFeatureCollection simpleFeatureCollection = dataIO.readSHP(fileRoute);
		List<String> layerTypeChain = new ArrayList<String>();
		List<String> layerKeyChain = new ArrayList<String>();
		Geometry tempGeom = (Geometry) simpleFeatureCollection.features().next().getDefaultGeometry();
		String geomType = tempGeom.getGeometryType();
		
		ConvertService convertService = new ConvertService();
		Map<String, Object> returnMap = new HashMap<String, Object>();
		returnMap.put("fileName", fileName);
		returnMap.put("layerType", geomType);
		returnMap.put("layerFrom", "file");
		returnMap.put("layerTypeChain", layerTypeChain);
		returnMap.put("layerKeyChain", layerKeyChain);
		returnMap.put("geoJSON", convertService.convertToGeoJSON(simpleFeatureCollection));

		

		/*
		 * uploadDAO.setSrcLayer(fileRoute);
		 * 
		 * //Shp File - Geometry String fileName =
		 * multi.getFilesystemName("shp"); GeoJSON featureCollection = new
		 * GeoJSON(); JSONArray featureList = new JSONArray(); GeoJSON geoJSON =
		 * new GeoJSON(); List<String> layerTypeChain = new ArrayList<String>();
		 * List<String> layerKeyChain = new ArrayList<String>(); String geomType
		 * = "";
		 * 
		 * String fileRoute = savePath+"\\"+fileName;
		 * 
		 * 
		 * //Gdal Format Layer getLayer = uploadDAO.getSourceLayer();
		 * 
		 * 
		 * for (int e = 0; e < getLayer.GetFeatureCount(); e++) { GeoJSON
		 * feature = new GeoJSON(); GeoJSON featureAtt = new GeoJSON(); Feature
		 * temp = getLayer.GetFeature(e);
		 * 
		 * for(int j=0; j< temp.GetFieldCount(); j++){
		 * 
		 * FieldDefn pTempDefn = temp.GetFieldDefnRef(j); String name =
		 * temp.GetFieldAsString(j); String typeName = pTempDefn.GetName();
		 * String type = pTempDefn.GetTypeName();
		 * if(layerTypeChain.size()<temp.GetFieldCount()){
		 * layerTypeChain.add(type); layerKeyChain.add(typeName); }
		 * featureAtt.put(typeName, name); } geomType =
		 * temp.GetGeometryRef().GetGeometryName(); Geometry geom = new
		 * Geometry(temp.GetGeometryRef().GetGeometryType()); geom =
		 * temp.GetGeometryRef(); GeoJSON geomJSON = new
		 * GeoJSON().StringToGeoJSON(geom.ExportToJson());
		 * 
		 * feature.put("type", "Feature"); feature.put("geometry", geomJSON);
		 * if(temp.GetFieldCount()!=0){ feature.put("properties", featureAtt); }
		 * featureList.add(feature); } Map<String, Object> returnMap = new
		 * HashMap<String, Object>();
		 * 
		 * returnMap.put("fileName", fileName); returnMap.put("layerType",
		 * geomType); returnMap.put("layerFrom", "file");
		 * returnMap.put("layerTypeChain", layerTypeChain);
		 * returnMap.put("layerKeyChain", layerKeyChain);
		 * 
		 * featureCollection.put("type", "FeatureCollection");
		 * featureCollection.put("features", featureList);
		 * 
		 * returnMap.put("geoJSON", featureCollection);
		 */

		return returnMap;
	}
}
