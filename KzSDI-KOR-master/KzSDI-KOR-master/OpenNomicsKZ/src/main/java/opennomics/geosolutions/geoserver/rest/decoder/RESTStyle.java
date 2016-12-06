/*
 *  GeoServer-Manager - Simple Manager Library for GeoServer
 *
 *  Copyright (C) 2007,2013 GeoSolutions S.A.S.
 *  http://www.geo-solutions.it
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
package opennomics.geosolutions.geoserver.rest.decoder;

import opennomics.geosolutions.geoserver.rest.decoder.utils.JDOMBuilder;

import org.jdom.Element;

/**
 *
 * @author ETj (etj at geo-solutions.it)
 */
public class RESTStyle {

    private final Element elem;

    public static RESTStyle build(String xml) {
        if (xml == null) {
            return null;
        }

        Element e = JDOMBuilder.buildElement(xml);
        if (e != null) {
            return new RESTStyle(e);
        } else {
            return null;
        }
    }

    protected RESTStyle(Element elem) {
        this.elem = elem;
    }

    public String getName() {
        return elem.getChildText("name");
    }

    public String getFileName() {
        return elem.getChildText("filename");
    }

    public String getWorkspace() {
        if(elem.getChild("workspace") != null)
            return elem.getChild("workspace").getChildText("name");
        else
            return null;
    }

}
