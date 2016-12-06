package opennomics.geosolutions.geoserver.rest.encoder.datastore;
/*
 *  GeoServer-Manager - Simple Manager Library for GeoServer
 *  
 *  Copyright (C) 2007,2012 GeoSolutions S.A.S.
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


import java.net.URL;

import opennomics.geosolutions.geoserver.rest.decoder.RESTDataStore;

/**
 * Encoder for a {@value #TYPE} datastore.
 * 
 * @author Oscar Fonts
 */
public class GSDirectoryOfShapefilesDatastoreEncoder extends GSShapefileDatastoreEncoder {

    static final String TYPE = "Directory of spatial files (shapefiles)";

    /**
     * Create a {@value #TYPE} datastore with default connection parameters, given a store name and a url (the store location).
     * 
     * @param name New datastore name
     * @param url The shapefile location in the server, relative to $GEOSERVER_DATA_DIR.
     */
    public GSDirectoryOfShapefilesDatastoreEncoder(String name, URL url) {
        super(name, url);
        setType(TYPE);
    }

    /**
     * Create a {@value #TYPE} datastore encoder from an existing store read from server.
     * 
     * @param store The existing store.
     * @throws IllegalArgumentException if store type or mandatory parameters are not valid
     */
    public GSDirectoryOfShapefilesDatastoreEncoder(RESTDataStore store) {
        super(store);
    }

    /**
     * @return {@value #TYPE}
     */
    protected String getValidType() {
        return TYPE;
    }
}
