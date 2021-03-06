/*eslint-env jest*/

import OlFormatGeoJSON from 'ol/format/geojson';
import OlFeature from 'ol/feature';
import OlGeomGeometry from 'ol/geom/geometry';
import OlGeomPolygon from 'ol/geom/polygon';
import OlGeomMultiPolygon from 'ol/geom/multipolygon';
import OlGeomPoint from 'ol/geom/point';
import OlGeomMultiPoint from 'ol/geom/multipoint';
import OlGeomLineString from 'ol/geom/linestring';
import OlGeomMultiLineString from 'ol/geom/multilinestring';

import {
  GeometryUtil,
} from '../../index';

import {
  pointCoords,
  bufferedPointCoords,
  boxCoords,
  splitBoxCoords1,
  splitBoxCoords2,
  lineStringLFormedCoords,
  splitBoxLFormedCoords1,
  splitBoxLFormedCoords2,
  uFormedPolygonCoords,
  lineStringCoords2,
  splitUFormerdCoords1,
  splitUFormerdCoords2,
  splitUFormerdCoords3,
  lineStringCoords,
  bufferedBoxCoords,
  bufferedLineStringCoords,
  holeCoords,
  bufferedHoleCoords,
  pointCoords2,
  mergedPointCoordinates,
  boxCoords3,
  mergedBoxCoords,
  mergedLineStringCoordinates,
  boxCoords2,
  unionedBoxCoordinates,
  differenceBoxCoords,
  intersectionCoords,
  boxCoords4
} from '../../../assets/TestCoords';

describe('GeometryUtil', () => {
  let poly;
  let format;

  beforeEach(() => {
    format = new OlFormatGeoJSON();

    poly = new OlFeature({
      geometry: new OlGeomPolygon(boxCoords)
    });
  });

  describe('Basics', () => {
    it('is defined', () => {
      expect(GeometryUtil).toBeDefined();
    });
  });

  describe('Static methods', () => {
    describe('#splitByLine', () => {
      describe('with ol.Feature as params', () => {
        /**
         *          +
         *          |
         *   +-------------+
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   +-------------+
         *          |
         *          +
         */
        it('splits the given convex polygon geometry with a straight line', () => {
          const line = new OlFeature({
            geometry: new OlGeomLineString(lineStringCoords)
          });
          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');
          const exp = [
            new OlFeature({
              geometry: new OlGeomPolygon(splitBoxCoords1)
            }),
            new OlFeature({
              geometry: new OlGeomPolygon(splitBoxCoords2)
            })
          ];
          expect(format.writeFeatures(got)).toEqual(format.writeFeatures(exp));
        });

        /**
         *          +
         *          |
         *   +-------------+
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      +---------+
         *   |             |
         *   |             |
         *   +-------------+
         */
        it('splits the given convex polygon geometry with a more complex line', () => {
          const line = new OlFeature({
            geometry: new OlGeomLineString(lineStringLFormedCoords)
          });
          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');
          const exp = [
            new OlFeature({
              geometry: new OlGeomPolygon(splitBoxLFormedCoords1)
            }),
            new OlFeature({
              geometry: new OlGeomPolygon(splitBoxLFormedCoords2)
            })
          ];
          expect(format.writeFeatures(got)).toEqual(format.writeFeatures(exp));
        });

        /**
         *       +----+         +----+
         *       |    |         |    |
         *       |    |         |    |
         * +--------------------------------+
         *       |    |         |    |
         *       |    +---------+    |
         *       |                   |
         *       |                   |
         *       |                   |
         *       |                   |
         *       +-------------------+
         *
         */
        it('splits the given concave polygon geometry with a straight line', () => {
          poly = new OlFeature({
            geometry: new OlGeomPolygon(uFormedPolygonCoords)
          });
          const line = new OlFeature({
            geometry: new OlGeomLineString(lineStringCoords2)
          });
          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');
          const exp = [
            new OlFeature({
              geometry: new OlGeomPolygon(splitUFormerdCoords1)
            }),
            new OlFeature({
              geometry: new OlGeomPolygon(splitUFormerdCoords2)
            }),
            new OlFeature({
              geometry: new OlGeomPolygon(splitUFormerdCoords3)
            })
          ];
          expect(format.writeFeatures(got)).toEqual(format.writeFeatures(exp));
        });
      });
      describe('with ol.geom.Geometry as params', () => {
        /**
         *          +
         *          |
         *   +-------------+
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   +-------------+
         *          |
         *          +
         */
        it('splits the given convex polygon geometry with a straight line', () => {
          poly = new OlGeomPolygon(boxCoords);
          const line = new OlGeomLineString(lineStringCoords);
          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');
          const exp = [
            new OlGeomPolygon(splitBoxCoords1),
            new OlGeomPolygon(splitBoxCoords2)
          ];
          got.forEach((polygon, i) => {
            expect(polygon.getCoordinates()).toEqual(exp[i].getCoordinates());
          });
        });

        /**
         *          +
         *          |
         *   +-------------+
         *   |      |      |
         *   |      |      |
         *   |      |      |
         *   |      +---------+
         *   |             |
         *   |             |
         *   +-------------+
         */
        it('splits the given convex polygon geometry with a more complex line', () => {
          poly = new OlGeomPolygon(boxCoords);
          const line = new OlGeomLineString(lineStringLFormedCoords);
          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');
          const exp = [
            new OlGeomPolygon(splitBoxLFormedCoords1),
            new OlGeomPolygon(splitBoxLFormedCoords2)
          ];
          got.forEach((polygon, i) => {
            expect(polygon.getCoordinates()).toEqual(exp[i].getCoordinates());
          });
        });

        /**
         *       +----+         +----+
         *       |    |         |    |
         *       |    |         |    |
         * +--------------------------------+
         *       |    |         |    |
         *       |    +---------+    |
         *       |                   |
         *       |                   |
         *       |                   |
         *       |                   |
         *       +-------------------+
         *
         */
        it('splits the given concave polygon geometry with a straight line', () => {
          poly = new OlGeomPolygon(uFormedPolygonCoords);
          const line = new OlGeomLineString(lineStringCoords2);
          const got = GeometryUtil.splitByLine(poly, line, 'EPSG:4326');
          const exp = [
            new OlGeomPolygon(splitUFormerdCoords1),
            new OlGeomPolygon(splitUFormerdCoords2),
            new OlGeomPolygon(splitUFormerdCoords3)
          ];
          got.forEach((polygon, i) => {
            expect(polygon.getCoordinates()).toEqual(exp[i].getCoordinates());
          });
        });
      });
    });

    describe('#addBuffer', () => {
      describe('with ol.Feature as params', () => {
        it('adds a buffer to an ol.geom.Point', () => {
          const testPoint = new OlFeature({
            geometry: new OlGeomPoint(pointCoords)
          });
          const bufferedPoint = GeometryUtil.addBuffer(testPoint, 200, 'EPSG:4326');
          expect(bufferedPoint instanceof OlFeature).toBe(true);
          expect(bufferedPoint.getGeometry().getCoordinates()).toEqual(bufferedPointCoords);
        });
        it('adds a buffer to an ol.geom.Polygon', () => {
          const testPolygon = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords)
          });
          const bufferedPolygon = GeometryUtil.addBuffer(testPolygon, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlFeature).toBe(true);
          expect(bufferedPolygon.getGeometry().getCoordinates()).toEqual(bufferedBoxCoords);
        });
        it('adds a buffer to an ol.geom.Linestring', () => {
          const testLineString = new OlFeature({
            geometry: new OlGeomLineString(lineStringCoords)
          });
          const bufferedLineString = GeometryUtil.addBuffer(testLineString, 200, 'EPSG:4326');
          expect(bufferedLineString instanceof OlFeature).toBe(true);
          expect(bufferedLineString.getGeometry().getCoordinates()).toEqual(bufferedLineStringCoords);
        });
        it('adds a buffer to an ol.geom.Polygon containing a hole', () => {
          const testPolygon = new OlFeature({
            geometry: new OlGeomPolygon(holeCoords)
          });
          const bufferedPolygon = GeometryUtil.addBuffer(testPolygon, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlFeature).toBe(true);
          expect(bufferedPolygon.getGeometry().getCoordinates()).toEqual(bufferedHoleCoords);
        });
      });
      describe('with ol.geom.Geomtry as params', () => {
        it('adds a buffer to an ol.geom.Point', () => {
          const testPoint = new OlGeomPoint(pointCoords);
          const bufferedPoint = GeometryUtil.addBuffer(testPoint, 200, 'EPSG:4326');
          expect(bufferedPoint instanceof OlGeomPolygon).toBe(true);
          expect(bufferedPoint.getCoordinates()).toEqual(bufferedPointCoords);
        });
        it('adds a buffer to an ol.geom.Polygon', () => {
          const testPolygon = new OlGeomPolygon(boxCoords);
          const bufferedPolygon = GeometryUtil.addBuffer(testPolygon, 200, 'EPSG:4326');
          expect(bufferedPolygon instanceof OlGeomPolygon).toBe(true);
          expect(bufferedPolygon.getCoordinates()).toEqual(bufferedBoxCoords);
        });
        it('adds a buffer to an ol.geom.Linestring', () => {
          const testLineString = new OlGeomLineString(lineStringCoords);
          const bufferedLineString = GeometryUtil.addBuffer(testLineString, 200, 'EPSG:4326');
          expect(bufferedLineString instanceof OlGeomPolygon).toBe(true);
          expect(bufferedLineString.getCoordinates()).toEqual(bufferedLineStringCoords);
        });
      });
    });

    describe('#mergeGeometries', () => {
      it('merges multiple instances of ol.geom.Point into ol.geom.MultiPoint', () => {
        const testPoint1 = new OlGeomPoint(pointCoords);
        const testPoint2 = new OlGeomPoint(pointCoords2);
        const mergedPoint = GeometryUtil.mergeGeometries([testPoint1, testPoint2]);
        expect(mergedPoint instanceof OlGeomMultiPoint).toBe(true);
        expect(mergedPoint.getCoordinates()).toEqual(mergedPointCoordinates);
      });
      it('merges multiple instances of ol.geom.Polygon into ol.geom.MultiPolygon', () => {
        const testPolygon1 = new OlGeomPolygon(boxCoords);
        const testPolygon2 = new OlGeomPolygon(boxCoords3);
        const mergedPolygon = GeometryUtil.mergeGeometries([testPolygon1, testPolygon2]);
        expect(mergedPolygon instanceof OlGeomMultiPolygon).toBe(true);
        expect(mergedPolygon.getCoordinates()).toEqual(mergedBoxCoords);
      });
      it('merges multiple instances of ol.geom.LineString into ol.geom.MultiLineString', () => {
        const testLineString1 = new OlGeomLineString(lineStringCoords);
        const testLineString2 = new OlGeomLineString(lineStringCoords2);
        const mergedLineString = GeometryUtil.mergeGeometries([testLineString1, testLineString2]);
        expect(mergedLineString instanceof OlGeomMultiLineString).toBe(true);
        expect(mergedLineString.getCoordinates()).toEqual(mergedLineStringCoordinates);
      });
    });

    describe('#union', () => {
      describe('with ol.Feature as params', () => {
        it('unions multiple instances of ol.geom.Polygon into one ol.geom.MultiPolygon', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords)
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords2)
          });
          const unionedFeature = GeometryUtil.union([poly1, poly2], 'EPSG:4326');
          expect(unionedFeature instanceof OlFeature).toBe(true);
          expect(unionedFeature.getGeometry().getCoordinates()).toEqual(unionedBoxCoordinates);
        });
      });
      describe('with ol.geom.Geometry as params', () => {
        it('unions multiple instances of ol.geom.Polygon into one ol.geom.MultiPolygon', () => {
          const poly1 = new OlGeomPolygon(boxCoords);
          const poly2 = new OlGeomPolygon(boxCoords2);
          const unionedGeometry = GeometryUtil.union([poly1, poly2], 'EPSG:4326');
          expect(unionedGeometry instanceof OlGeomGeometry).toBe(true);
          expect(unionedGeometry.getCoordinates()).toEqual(unionedBoxCoordinates);
        });
      });
    });

    describe('#difference', () => {
      describe('with ol.Feature as params', () => {
        it('returns the difference of two instances of ol.geom.Polygon', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords)
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords2)
          });
          const differenceFeature = GeometryUtil.difference(poly1, poly2, 'EPSG:4326');
          expect(differenceFeature instanceof OlFeature).toBe(true);
          expect(differenceFeature.getGeometry().getCoordinates()).toEqual(differenceBoxCoords);
        });
        it('returns poly1 if no difference is found', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords)
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords4)
          });
          const differenceFeature = GeometryUtil.difference(poly1, poly2, 'EPSG:4326');
          expect(differenceFeature instanceof OlFeature).toBe(true);
          expect(differenceFeature.getGeometry().getCoordinates()).toEqual(poly1.getGeometry().getCoordinates());
        });
      });
      describe('with ol.geom.Geometry as params', () => {
        it('returns the difference of two instances of ol.geom.Polygon', () => {
          const poly1 = new OlGeomPolygon(boxCoords);
          const poly2 = new OlGeomPolygon(boxCoords2);
          const differenceGeometry = GeometryUtil.difference(poly1, poly2, 'EPSG:4326');
          expect(differenceGeometry instanceof OlGeomGeometry).toBe(true);
          expect(differenceGeometry.getCoordinates()).toEqual(differenceBoxCoords);
        });
        it('returns poly1 if no difference is found', () => {
          const poly1 = new OlGeomPolygon(boxCoords);
          const poly2 = new OlGeomPolygon(boxCoords4);
          const differenceGeometry = GeometryUtil.difference(poly1, poly2, 'EPSG:4326');
          expect(differenceGeometry instanceof OlGeomGeometry).toBe(true);
          expect(differenceGeometry.getCoordinates()).toEqual(poly1.getCoordinates());
        });
      });
    });

    describe('#intersection', () => {
      describe('with ol.Feature as params', () => {
        it('returns the intersection of two instances of ol.geom.Polygon', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords)
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords3)
          });
          const intersectionFeature = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          expect(intersectionFeature instanceof OlFeature).toBe(true);
          expect(intersectionFeature.getGeometry().getCoordinates()).toEqual(intersectionCoords);
        });
        it('returns null if no intersection is found', () => {
          const poly1 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords)
          });
          const poly2 = new OlFeature({
            geometry: new OlGeomPolygon(boxCoords4)
          });
          const intersectionFeature = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          expect(intersectionFeature).toBe(null);
        });
      });
      describe('with ol.geom.Geometry as params', () => {
        it('returns the intersection of two instances of ol.geom.Polygon', () => {
          const poly1 = new OlGeomPolygon(boxCoords);
          const poly2 = new OlGeomPolygon(boxCoords3);
          const intersectionGeometry = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          expect(intersectionGeometry instanceof OlGeomGeometry).toBe(true);
          expect(intersectionGeometry.getCoordinates()).toEqual(intersectionCoords);
        });
        it('returns null if no intersection is found', () => {
          const poly1 = new OlGeomPolygon(boxCoords);
          const poly2 = new OlGeomPolygon(boxCoords4);
          const intersectionGeometry = GeometryUtil.intersection(poly1, poly2, 'EPSG:4326');
          expect(intersectionGeometry).toBe(null);
        });
      });
    });
  });
});
