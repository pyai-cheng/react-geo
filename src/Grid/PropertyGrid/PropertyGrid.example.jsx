import React from 'react';
import { render } from 'react-dom';

import OlFeature from 'ol/feature';
import OlGeomPoint from 'ol/geom/point';

import {
  PropertyGrid
} from '../../index.js';

//
// ***************************** SETUP *****************************************
//
const feature = new OlFeature({
  geometry: new OlGeomPoint([19.09, 1.09]),
});

const attributeObject = {
  foo: 'bar',
  foo2: 'bar2',
  foo3: 'bar3',
  foo9: 'bar9',
  name: 'Point'
};

feature.setProperties(attributeObject);
feature.setId(1909);

const attributeNames = {
  foo: 'A',
  foo2: 'nice',
  foo9: 'example'
};
//
// ***************************** SETUP END *************************************
//

render(
  <div className="example-block">
    <h2>PropertyGrid without a filter:</h2>
    <PropertyGrid
      feature={feature}
    />
    <br />
    <h2>PropertyGrid with filtered attributes (foo and foo9 only):</h2>
    <PropertyGrid
      feature={feature}
      attributeFilter={['foo', 'foo9']}
      style={{width: '50%'}}
    />
    <br />
    <h2>PropertyGrid with different column width (70 % width for column name / 30 % width for column value):</h2>
    <PropertyGrid
      feature={feature}
      attributeNameColumnWidthInPercent={70}
      style={{width: '50%'}}
    />
    <br />
    <h2>PropertyGrid with column name mapping:</h2>
    <PropertyGrid
      feature={feature}
      attributeFilter={['foo', 'foo2', 'foo9', 'name']}
      attributeNames={attributeNames}
      style={{width: '50%'}}
    />
  </div>,
  document.getElementById('exampleContainer')
);
