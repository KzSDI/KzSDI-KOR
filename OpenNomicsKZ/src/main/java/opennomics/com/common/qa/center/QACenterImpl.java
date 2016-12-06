package opennomics.com.common.qa.center;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Vector;

import opennomics.com.common.enums.QA.EnLineStringQAList;
import opennomics.com.common.enums.QA.EnMultiLineStringQAList;
import opennomics.com.common.enums.QA.EnMultiPointQAList;
import opennomics.com.common.enums.QA.EnMultiPolygonQAList;
import opennomics.com.common.enums.QA.EnPointQAList;
import opennomics.com.common.enums.QA.EnPolygonQAList;
import opennomics.com.common.qa.QAErrReport;
import opennomics.com.common.qa.factory.QAFactory;
import opennomics.com.common.qa.factory.QAFactoryImpl;
import opennomics.com.main.qa.domain.QAErrReportVO;

import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.feature.DefaultFeatureCollection;
import org.geotools.feature.SchemaException;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.opengis.feature.simple.SimpleFeature;

public class QACenterImpl implements QACenter {

	QAFactory qaFactory;

	public JSONObject pointLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException {

		DefaultFeatureCollection returnFeatureCollection = new DefaultFeatureCollection();
		List<QAErrReportVO> qaErrReportList = new ArrayList<QAErrReportVO>();
		JSONObject returnObj = new JSONObject();

		try {
			if (qaOption == null) {
				return null;
			} else {
				Vector<SimpleFeature> simpleFeatureListNew = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorNew = newLayer.features();
				while (featureIteratorNew.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorNew.next();
					simpleFeatureListNew.add(simpleFeature);
				}

				Vector<SimpleFeature> simpleFeatureListApp = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorApp = appLayer.features();
				while (featureIteratorApp.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorApp.next();
					simpleFeatureListApp.add(simpleFeature);
				}

				JSONObject qaErrReport = new JSONObject();
				Iterator iterator = qaOption.keySet().iterator();
				while (iterator.hasNext()) {
					String qaType = iterator.next().toString();

					QAErrReportVO qaErrReportVO = new QAErrReportVO();
					qaErrReportVO.setType(qaType);
					qaErrReportVO.setChecked(false);

					qaErrReport.put(qaType, qaErrReportVO);
				}
				qaFactory = new QAFactoryImpl();
				for (int i = 0; i < simpleFeatureListNew.size(); i++) {
					Iterator tempIterator = qaOption.keySet().iterator();
					while (tempIterator.hasNext()) {
						String qaOptionType = tempIterator.next().toString();
						if (qaOptionType.equals(EnPointQAList.DUPLICATEDPOINT.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.pointDuplicated(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnPointQAList.ATTRIBUTEFIX.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject attributeFix = (JSONObject) qaOption.get("AttributeFix");
							JSONArray attributes = (JSONArray) attributeFix.get("value");
							if (attributeFix != null) {
								SimpleFeature simpleFeature = simpleFeatureListNew.get(i);
								SimpleFeature returnFeature = qaFactory.attributeFix(simpleFeature, attributes);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}
						if (qaOptionType.equals(EnPointQAList.SELFENTITY.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							boolean isError = false;

							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4Point(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								SimpleFeature simpleFeature = qaFactory.selfEntity4PointApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeature != null) {
									returnFeatureCollection.add(simpleFeature);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnPointQAList.ENTITYDUPLICATED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							boolean isError = false;

							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicated(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicatedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
					}
				}

				JSONObject returnErrReport = new JSONObject();
				Iterator qaErrKey = qaErrReport.keySet().iterator();
				while (qaErrKey.hasNext()) {
					String key = (String) qaErrKey.next();
					QAErrReportVO vo = (QAErrReportVO) qaErrReport.get(key);
					boolean checked = vo.isChecked();

					if (checked) {
						vo.setNumOfItems(simpleFeatureListNew.size());
						JSONObject inputOption = (JSONObject) qaOption.get(key);
						String weight = (String) inputOption.get("weight");
						if (weight != null) {
							double weigthToDouble = Double.parseDouble(weight);
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						} else {
							double weigthToDouble = Double.NaN;
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						}
					}
				}

				QAErrReport report = new QAErrReport();
				qaErrReportList = report.createQAErrReport(returnErrReport);

				returnObj.put("ErrLayer", returnFeatureCollection);
				returnObj.put("ErrReport", qaErrReportList);

				return returnObj;
			}
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	public JSONObject lineStringLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException {

		DefaultFeatureCollection returnFeatureCollection = new DefaultFeatureCollection();
		List<QAErrReportVO> qaErrReportList = new ArrayList<QAErrReportVO>();
		JSONObject returnObj = new JSONObject();

		try {

			if (qaOption == null) {
				return null;
			} else {
				Vector<SimpleFeature> simpleFeatureListNew = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorNew = newLayer.features();
				while (featureIteratorNew.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorNew.next();
					simpleFeatureListNew.add(simpleFeature);
				}

				Vector<SimpleFeature> simpleFeatureListApp = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorApp = appLayer.features();
				while (featureIteratorApp.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorApp.next();
					simpleFeatureListApp.add(simpleFeature);
				}

				JSONObject qaErrReport = new JSONObject();
				Iterator iterator = qaOption.keySet().iterator();
				while (iterator.hasNext()) {
					String qaType = iterator.next().toString();

					QAErrReportVO qaErrReportVO = new QAErrReportVO();
					qaErrReportVO.setType(qaType);
					qaErrReportVO.setChecked(false);

					qaErrReport.put(qaType, qaErrReportVO);
				}
				qaFactory = new QAFactoryImpl();
				for (int i = 0; i < simpleFeatureListNew.size(); i++) {
					Iterator tempIterator = qaOption.keySet().iterator();
					while (tempIterator.hasNext()) {
						String qaOptionType = tempIterator.next().toString();
						if (qaOptionType.equals(EnLineStringQAList.SMALLLENGTH.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject inputOption = (JSONObject) qaOption.get(qaOptionType);
							String stringdfLength = (String) inputOption.get("value");
							if (stringdfLength != null) {
								double doubledflength = Double.parseDouble(stringdfLength);
								SimpleFeature returnFeature = qaFactory.smallLength(simpleFeatureListNew.get(i), doubledflength);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}
						if (qaOptionType.equals(EnLineStringQAList.DUPLICATEDPOINT.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.pointDuplicated(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnLineStringQAList.ATTRIBUTEFIX.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject attributeFix = (JSONObject) qaOption.get("AttributeFix");
							JSONArray attributes = (JSONArray) attributeFix.get("value");

							if (attributeFix != null) {
								SimpleFeature simpleFeature = simpleFeatureListNew.get(i);
								SimpleFeature returnFeature = qaFactory.attributeFix(simpleFeature, attributes);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}
						if (qaOptionType.equals(EnLineStringQAList.CONBREAK.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.conBreak(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnLineStringQAList.CONOVERDEGREE.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject inputOption = (JSONObject) qaOption.get(qaOptionType);
							String stringdfdegree = (String) inputOption.get("value");
							double doubledfdegree = Double.parseDouble(stringdfdegree);

							Vector<SimpleFeature> simpleFeatures = qaFactory.conOverDegree(simpleFeatureListNew.get(i), doubledfdegree);
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}

						if (qaOptionType.equals(EnLineStringQAList.SELFENTITY.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							boolean isError = false;

							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4LineApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4LineApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnLineStringQAList.ENTITYDUPLICATED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							boolean isError = false;

							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicated(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicatedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnLineStringQAList.CONINTERSECTED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.conIntersected(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.conIntersectedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
					}
				}

				JSONObject returnErrReport = new JSONObject();
				Iterator qaErrKey = qaErrReport.keySet().iterator();
				while (qaErrKey.hasNext()) {
					String key = (String) qaErrKey.next();
					QAErrReportVO vo = (QAErrReportVO) qaErrReport.get(key);
					boolean checked = vo.isChecked();

					if (checked) {
						vo.setNumOfItems(simpleFeatureListNew.size());
						JSONObject inputOption = (JSONObject) qaOption.get(key);
						String weight = (String) inputOption.get("weight");
						if (weight != null) {
							double weigthToDouble = Double.parseDouble(weight);
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						} else {
							double weigthToDouble = Double.NaN;
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						}
					}
				}

				QAErrReport report = new QAErrReport();
				qaErrReportList = report.createQAErrReport(returnErrReport);

				returnObj.put("ErrLayer", returnFeatureCollection);
				returnObj.put("ErrReport", qaErrReportList);

				return returnObj;
			}
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public JSONObject polygonLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException {

		DefaultFeatureCollection returnFeatureCollection = new DefaultFeatureCollection();
		List<QAErrReportVO> qaErrReportList = new ArrayList<QAErrReportVO>();
		JSONObject returnObj = new JSONObject();

		try {
			if (qaOption == null) {
				return null;
			} else {
				Vector<SimpleFeature> simpleFeatureListNew = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorNew = newLayer.features();
				while (featureIteratorNew.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorNew.next();
					simpleFeatureListNew.add(simpleFeature);
				}

				Vector<SimpleFeature> simpleFeatureListApp = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorApp = appLayer.features();
				while (featureIteratorApp.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorApp.next();
					simpleFeatureListApp.add(simpleFeature);
				}

				JSONObject qaErrReport = new JSONObject();
				Iterator iterator = qaOption.keySet().iterator();
				while (iterator.hasNext()) {
					String qaType = iterator.next().toString();

					QAErrReportVO qaErrReportVO = new QAErrReportVO();
					qaErrReportVO.setType(qaType);
					qaErrReportVO.setChecked(false);

					qaErrReport.put(qaType, qaErrReportVO);
				}
				qaFactory = new QAFactoryImpl();
				for (int i = 0; i < simpleFeatureListNew.size(); i++) {
					Iterator tempIterator = qaOption.keySet().iterator();
					while (tempIterator.hasNext()) {
						String qaOptionType = tempIterator.next().toString();
						if (qaOptionType.equals(EnPolygonQAList.SMALLAREA.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject inputOption = (JSONObject) qaOption.get(qaOptionType);
							String stringdfArea = (String) inputOption.get("value");
							if (stringdfArea != null) {
								double doubledfArea = Double.parseDouble(stringdfArea);
								SimpleFeature returnFeature = qaFactory.smallArea(simpleFeatureListNew.get(i), doubledfArea);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}

						if (qaOptionType.equals(EnPolygonQAList.DUPLICATEDPOINT.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.pointDuplicated(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnPolygonQAList.ATTRIBUTEFIX.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject attributeFix = (JSONObject) qaOption.get("AttributeFix");
							JSONArray attributes = (JSONArray) attributeFix.get("value");

							if (attributeFix != null) {
								SimpleFeature simpleFeature = simpleFeatureListNew.get(i);
								SimpleFeature returnFeature = qaFactory.attributeFix(simpleFeature, attributes);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}

						if (qaOptionType.equals(EnPolygonQAList.SELFENTITY.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4Polygon(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4PolygonApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnPolygonQAList.ENTITYDUPLICATED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicated(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicatedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
					}
				}

				JSONObject returnErrReport = new JSONObject();
				Iterator qaErrKey = qaErrReport.keySet().iterator();
				while (qaErrKey.hasNext()) {
					String key = (String) qaErrKey.next();
					QAErrReportVO vo = (QAErrReportVO) qaErrReport.get(key);
					boolean checked = vo.isChecked();

					if (checked) {
						vo.setNumOfItems(simpleFeatureListNew.size());
						JSONObject inputOption = (JSONObject) qaOption.get(key);
						String weight = (String) inputOption.get("weight");
						if (weight != null) {
							double weigthToDouble = Double.parseDouble(weight);
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						} else {
							double weigthToDouble = Double.NaN;
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						}
					}
				}

				QAErrReport report = new QAErrReport();
				qaErrReportList = report.createQAErrReport(returnErrReport);

				returnObj.put("ErrLayer", returnFeatureCollection);
				returnObj.put("ErrReport", qaErrReportList);

				return returnObj;
			}
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public JSONObject mtPointLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException {

		DefaultFeatureCollection returnFeatureCollection = new DefaultFeatureCollection();
		List<QAErrReportVO> qaErrReportList = new ArrayList<QAErrReportVO>();
		JSONObject returnObj = new JSONObject();

		try {
			if (qaOption == null) {
				return null;
			} else {
				Vector<SimpleFeature> simpleFeatureListNew = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorNew = newLayer.features();
				while (featureIteratorNew.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorNew.next();
					simpleFeatureListNew.add(simpleFeature);
				}

				Vector<SimpleFeature> simpleFeatureListApp = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorApp = appLayer.features();
				while (featureIteratorApp.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorApp.next();
					simpleFeatureListApp.add(simpleFeature);
				}

				JSONObject qaErrReport = new JSONObject();
				Iterator iterator = qaOption.keySet().iterator();
				while (iterator.hasNext()) {
					String qaType = iterator.next().toString();

					QAErrReportVO qaErrReportVO = new QAErrReportVO();
					qaErrReportVO.setType(qaType);
					qaErrReportVO.setChecked(false);

					qaErrReport.put(qaType, qaErrReportVO);
				}
				qaFactory = new QAFactoryImpl();
				for (int i = 0; i < simpleFeatureListNew.size(); i++) {
					Iterator tempIterator = qaOption.keySet().iterator();
					while (tempIterator.hasNext()) {
						String qaOptionType = tempIterator.next().toString();
						if (qaOptionType.equals(EnMultiPointQAList.DUPLICATEDPOINT.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.pointDuplicated(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiPointQAList.ATTRIBUTEFIX.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject attributeFix = (JSONObject) qaOption.get("AttributeFix");
							JSONArray attributes = (JSONArray) attributeFix.get("value");

							if (attributeFix != null) {
								SimpleFeature simpleFeature = simpleFeatureListNew.get(i);
								SimpleFeature returnFeature = qaFactory.attributeFix(simpleFeature, attributes);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}
						if (qaOptionType.equals(EnMultiPointQAList.SELFENTITY.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4Point(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								SimpleFeature simpleFeature = qaFactory.selfEntity4PointApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeature != null) {
									returnFeatureCollection.add(simpleFeature);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiPointQAList.ENTITYDUPLICATED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicated(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicatedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
					}
				}

				JSONObject returnErrReport = new JSONObject();
				Iterator qaErrKey = qaErrReport.keySet().iterator();
				while (qaErrKey.hasNext()) {
					String key = (String) qaErrKey.next();
					QAErrReportVO vo = (QAErrReportVO) qaErrReport.get(key);
					boolean checked = vo.isChecked();

					if (checked) {
						vo.setNumOfItems(simpleFeatureListNew.size());
						JSONObject inputOption = (JSONObject) qaOption.get(key);
						String weight = (String) inputOption.get("weight");
						if (weight != null) {
							double weigthToDouble = Double.parseDouble(weight);
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						} else {
							double weigthToDouble = Double.NaN;
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						}
					}
				}

				QAErrReport report = new QAErrReport();
				qaErrReportList = report.createQAErrReport(returnErrReport);

				returnObj.put("ErrLayer", returnFeatureCollection);
				returnObj.put("ErrReport", qaErrReportList);
				return returnObj;
			}
		} catch (Exception e) {
			return null;
		}
	}

	@SuppressWarnings("unchecked")
	public JSONObject mtLineStringLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException {

		DefaultFeatureCollection returnFeatureCollection = new DefaultFeatureCollection();
		List<QAErrReportVO> qaErrReportList = new ArrayList<QAErrReportVO>();
		JSONObject returnObj = new JSONObject();

	//	try {
			if (qaOption == null) {
				return null;
			} else {
				Vector<SimpleFeature> simpleFeatureListNew = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorNew = newLayer.features();
				while (featureIteratorNew.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorNew.next();
					simpleFeatureListNew.add(simpleFeature);
				}

				Vector<SimpleFeature> simpleFeatureListApp = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorApp = appLayer.features();
				while (featureIteratorApp.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorApp.next();
					simpleFeatureListApp.add(simpleFeature);
				}

				JSONObject qaErrReport = new JSONObject();
				Iterator iterator = qaOption.keySet().iterator();
				while (iterator.hasNext()) {
					String qaType = iterator.next().toString();

					QAErrReportVO qaErrReportVO = new QAErrReportVO();
					qaErrReportVO.setType(qaType);
					qaErrReportVO.setChecked(false);

					qaErrReport.put(qaType, qaErrReportVO);
				}
				qaFactory = new QAFactoryImpl();
				for (int i = 0; i < simpleFeatureListNew.size(); i++) {
					Iterator tempIterator = qaOption.keySet().iterator();
					while (tempIterator.hasNext()) {
						String qaOptionType = tempIterator.next().toString();
						if (qaOptionType.equals(EnMultiLineStringQAList.SMALLLENGTH.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject inputOption = (JSONObject) qaOption.get(qaOptionType);
							String stringdfLength = (String) inputOption.get("value");

							if (stringdfLength != null) {
								double doubledflength = Double.parseDouble(stringdfLength);
								SimpleFeature returnFeature = qaFactory.smallLength(simpleFeatureListNew.get(i), doubledflength);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}

						}
						if (qaOptionType.equals(EnMultiLineStringQAList.DUPLICATEDPOINT.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.pointDuplicated(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiLineStringQAList.ATTRIBUTEFIX.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject attributeFix = (JSONObject) qaOption.get("AttributeFix");
							JSONArray attributes = (JSONArray) attributeFix.get("value");

							if (attributeFix != null) {
								SimpleFeature simpleFeature = simpleFeatureListNew.get(i);
								SimpleFeature returnFeature = qaFactory.attributeFix(simpleFeature, attributes);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}
						if (qaOptionType.equals(EnMultiLineStringQAList.CONBREAK.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.conBreak(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiLineStringQAList.CONOVERDEGREE.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject inputOption = (JSONObject) qaOption.get(qaOptionType);
							String stringdfdegree = (String) inputOption.get("value");
							double doubledfdegree = Double.parseDouble(stringdfdegree);

							Vector<SimpleFeature> simpleFeatures = qaFactory.conOverDegree(simpleFeatureListNew.get(i), doubledfdegree);
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiLineStringQAList.SELFENTITY.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4Line(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4LineApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiLineStringQAList.ENTITYDUPLICATED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicated(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicatedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiLineStringQAList.CONINTERSECTED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.conIntersected(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.conIntersectedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
					}
				}

				JSONObject returnErrReport = new JSONObject();
				Iterator qaErrKey = qaErrReport.keySet().iterator();
				while (qaErrKey.hasNext()) {
					String key = (String) qaErrKey.next();
					QAErrReportVO vo = (QAErrReportVO) qaErrReport.get(key);
					boolean checked = vo.isChecked();

					if (checked) {
						vo.setNumOfItems(simpleFeatureListNew.size());
						JSONObject inputOption = (JSONObject) qaOption.get(key);
						String weight = (String) inputOption.get("weight");
						if (weight != null) {
							double weigthToDouble = Double.parseDouble(weight);
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						} else {
							double weigthToDouble = Double.NaN;
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						}
					}
				}

				QAErrReport report = new QAErrReport();
				qaErrReportList = report.createQAErrReport(returnErrReport);

				returnObj.put("ErrLayer", returnFeatureCollection);
				returnObj.put("ErrReport", qaErrReportList);

				return returnObj;
			}
		//} catch (Exception e) {
		//	return null;
		//}
	}

	public JSONObject mtPolygonLayerReportQA(JSONObject qaOption, SimpleFeatureCollection newLayer, SimpleFeatureCollection appLayer) throws SchemaException {

		DefaultFeatureCollection returnFeatureCollection = new DefaultFeatureCollection();
		List<QAErrReportVO> qaErrReportList = new ArrayList<QAErrReportVO>();
		JSONObject returnObj = new JSONObject();

		try {

			if (qaOption == null) {
				return null;
			} else {
				Vector<SimpleFeature> simpleFeatureListNew = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorNew = newLayer.features();
				while (featureIteratorNew.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorNew.next();
					simpleFeatureListNew.add(simpleFeature);
				}

				Vector<SimpleFeature> simpleFeatureListApp = new Vector<SimpleFeature>();
				SimpleFeatureIterator featureIteratorApp = appLayer.features();
				while (featureIteratorApp.hasNext()) {
					SimpleFeature simpleFeature = featureIteratorApp.next();
					simpleFeatureListApp.add(simpleFeature);
				}

				JSONObject qaErrReport = new JSONObject();
				Iterator iterator = qaOption.keySet().iterator();
				while (iterator.hasNext()) {
					String qaType = iterator.next().toString();

					QAErrReportVO qaErrReportVO = new QAErrReportVO();
					qaErrReportVO.setType(qaType);
					qaErrReportVO.setChecked(false);

					qaErrReport.put(qaType, qaErrReportVO);
				}
				qaFactory = new QAFactoryImpl();
				for (int i = 0; i < simpleFeatureListNew.size(); i++) {
					Iterator tempIterator = qaOption.keySet().iterator();
					while (tempIterator.hasNext()) {
						String qaOptionType = tempIterator.next().toString();
						if (qaOptionType.equals(EnMultiPolygonQAList.SMALLAREA.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject inputOption = (JSONObject) qaOption.get(qaOptionType);
							String stringdfArea = (String) inputOption.get("value");
							if (stringdfArea != null) {
								double doubledfArea = Double.parseDouble(stringdfArea);
								SimpleFeature returnFeature = qaFactory.smallArea(simpleFeatureListNew.get(i), doubledfArea);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}
						if (qaOptionType.equals(EnMultiPolygonQAList.DUPLICATEDPOINT.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							Vector<SimpleFeature> simpleFeatures = qaFactory.pointDuplicated(simpleFeatureListNew.get(i));
							if (simpleFeatures != null) {
								returnFeatureCollection.addAll(simpleFeatures);

								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiPolygonQAList.ATTRIBUTEFIX.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);

							JSONObject attributeFix = (JSONObject) qaOption.get("AttributeFix");
							JSONArray attributes = (JSONArray) attributeFix.get("value");

							if (attributeFix != null) {
								SimpleFeature simpleFeature = simpleFeatureListNew.get(i);
								SimpleFeature returnFeature = qaFactory.attributeFix(simpleFeature, attributes);
								if (returnFeature != null) {
									returnFeatureCollection.add(returnFeature);

									qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
								}
							}
						}

						if (qaOptionType.equals(EnMultiPolygonQAList.SELFENTITY.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4Polygon(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.selfEntity4PolygonApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
						if (qaOptionType.equals(EnMultiPolygonQAList.ENTITYDUPLICATED.getTypeName())) {
							QAErrReportVO qaErrReportVO = (QAErrReportVO) qaErrReport.get(qaOptionType);
							qaErrReportVO.setChecked(true);
							boolean isError = false;
							for (int j = i + 1; j < simpleFeatureListNew.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListNew.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicated(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}

							for (int j = 0; j < simpleFeatureListApp.size(); j++) {
								SimpleFeature simpleFeatureI = simpleFeatureListNew.get(i);
								SimpleFeature simpleFeatureJ = simpleFeatureListApp.get(j);

								Vector<SimpleFeature> simpleFeatures = qaFactory.entityDuplicatedApp(simpleFeatureI, simpleFeatureJ);
								if (simpleFeatures != null) {
									returnFeatureCollection.addAll(simpleFeatures);
									isError = true;
								}
							}
							if (isError) {
								qaErrReportVO.setNumOfErr(qaErrReportVO.getNumOfErr() + 1);
							}
						}
					}
				}

				JSONObject returnErrReport = new JSONObject();
				Iterator qaErrKey = qaErrReport.keySet().iterator();
				while (qaErrKey.hasNext()) {
					String key = (String) qaErrKey.next();
					QAErrReportVO vo = (QAErrReportVO) qaErrReport.get(key);
					boolean checked = vo.isChecked();

					if (checked) {
						vo.setNumOfItems(simpleFeatureListNew.size());
						JSONObject inputOption = (JSONObject) qaOption.get(key);
						String weight = (String) inputOption.get("weight");
						if (weight != null) {
							double weigthToDouble = Double.parseDouble(weight);
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						} else {
							double weigthToDouble = Double.NaN;
							vo.setWeights(weigthToDouble);
							returnErrReport.put(key, vo);
						}
					}
				}

				QAErrReport report = new QAErrReport();
				qaErrReportList = report.createQAErrReport(returnErrReport);

				returnObj.put("ErrLayer", returnFeatureCollection);
				returnObj.put("ErrReport", qaErrReportList);

				return returnObj;
			}
		} catch (Exception e) {
			return null;
		}
	}

}