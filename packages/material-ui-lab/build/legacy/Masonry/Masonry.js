import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { createUnarySpacing, getValue, handleBreakpoints, unstable_resolveBreakpointValues as resolveBreakpointValues } from '@mui/system';
import { deepmerge, unstable_useForkRef as useForkRef } from '@mui/utils';
import { unstable_composeClasses as composeClasses } from '@mui/core';
import { styled, useThemeProps } from '@mui/material/styles';
import { getMasonryUtilityClass } from './masonryClasses';
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

var useUtilityClasses = function useUtilityClasses(ownerState) {
  var classes = ownerState.classes;
  var slots = {
    root: ['root']
  };
  return composeClasses(slots, getMasonryUtilityClass, classes);
};

var computeBreakpointsBase = function computeBreakpointsBase(breakpoints, prop) {
  var base = {};
  Object.keys(breakpoints.values).forEach(function (breakpoint) {
    if (prop[breakpoint] != null) {
      base[breakpoint] = true;
    }
  });
  return base;
};

export var style = function style(_ref) {
  var ownerState = _ref.ownerState,
      theme = _ref.theme;
  var styles = {
    display: 'flex',
    flexFlow: 'column wrap',
    alignContent: 'space-between',
    boxSizing: 'border-box',
    '& *': {
      boxSizing: 'border-box'
    }
  };
  var spacingValues = resolveBreakpointValues({
    values: ownerState.spacing,
    base: computeBreakpointsBase(theme.breakpoints, ownerState.spacing)
  });
  var transformer = createUnarySpacing(theme);

  var spacingStyleFromPropValue = function spacingStyleFromPropValue(propValue) {
    var spacing = Number(getValue(transformer, propValue).replace('px', ''));
    return _extends({
      margin: -(spacing / 2),
      '& *': {
        margin: spacing / 2
      }
    }, ownerState.maxColumnHeight && ownerState.maxNumOfRows && {
      height: ownerState.maxColumnHeight + spacing * ownerState.maxNumOfRows
    });
  };

  styles = deepmerge(styles, handleBreakpoints({
    theme: theme
  }, spacingValues, spacingStyleFromPropValue));
  var columnValues = resolveBreakpointValues({
    values: ownerState.columns,
    base: computeBreakpointsBase(theme.breakpoints, ownerState.columns)
  });

  var columnStyleFromPropValue = function columnStyleFromPropValue(propValue) {
    return {
      '& *': {
        width: "".concat((100 / propValue).toFixed(2), "%")
      }
    };
  };

  styles = deepmerge(styles, handleBreakpoints({
    theme: theme
  }, columnValues, columnStyleFromPropValue));
  return styles;
};
var MasonryRoot = styled('div', {
  name: 'MuiMasonry',
  slot: 'Root',
  overridesResolver: function overridesResolver(props, styles) {
    return [styles.root];
  }
})(style);
var Masonry = /*#__PURE__*/React.forwardRef(function Masonry(inProps, ref) {
  var props = useThemeProps({
    props: inProps,
    name: 'MuiMasonry'
  });
  var masonryRef = React.useRef();

  var _React$useState = React.useState(),
      maxColumnHeight = _React$useState[0],
      setMaxColumnHeight = _React$useState[1];

  var _React$useState2 = React.useState(),
      maxNumOfRows = _React$useState2[0],
      setMaxNumOfRows = _React$useState2[1];

  var _React$useState3 = React.useState(0),
      numberOfLineBreaks = _React$useState3[0],
      setNumberOfLineBreaks = _React$useState3[1];

  var children = props.children,
      className = props.className,
      _props$component = props.component,
      component = _props$component === void 0 ? 'div' : _props$component,
      _props$columns = props.columns,
      columns = _props$columns === void 0 ? 4 : _props$columns,
      _props$spacing = props.spacing,
      spacing = _props$spacing === void 0 ? 1 : _props$spacing,
      other = _objectWithoutProperties(props, ["children", "className", "component", "columns", "spacing"]);

  var ownerState = _extends({}, props, {
    spacing: spacing,
    columns: columns,
    maxColumnHeight: maxColumnHeight,
    maxNumOfRows: maxNumOfRows
  });

  var classes = useUtilityClasses(ownerState);
  React.useEffect(function () {
    var handleResize = function handleResize() {
      var columnHeights;
      var numOfRows;
      var curNumOfCols;
      var skip = false;
      masonryRef.current.childNodes.forEach(function (child) {
        if (child.nodeType !== Node.ELEMENT_NODE || child.dataset.class === 'line-break' || skip) {
          return;
        }

        var computedStyle = window.getComputedStyle(child);
        var parentWidth = Number(window.getComputedStyle(masonryRef.current).width.replace('px', ''));
        var width = Number(computedStyle.width.replace('px', ''));
        var height = Number(computedStyle.height.replace('px', '')); // if any one of children is not rendered yet, container's height shouldn't be set;
        // this is especially crucial for image masonry

        if (parentWidth === 0 || width === 0 || height === 0) {
          skip = true;
          return;
        }

        if (!curNumOfCols) {
          curNumOfCols = Math.floor(parentWidth / width);
        }

        if (!columnHeights) {
          columnHeights = new Array(curNumOfCols).fill(0);
        }

        if (!numOfRows) {
          numOfRows = new Array(curNumOfCols).fill(0);
        } // find the current shortest column (where the current item will be placed)


        var curMinColumnIndex = columnHeights.indexOf(Math.min.apply(Math, _toConsumableArray(columnHeights)));
        columnHeights[curMinColumnIndex] += height;
        numOfRows[curMinColumnIndex] += 1;
        var order = curMinColumnIndex + 1;
        child.style.order = order;
      });

      if (!skip) {
        setMaxColumnHeight(Math.max.apply(Math, _toConsumableArray(columnHeights)));
        setMaxNumOfRows(Math.max.apply(Math, _toConsumableArray(numOfRows)));
        var numOfLineBreaks = curNumOfCols > 0 ? curNumOfCols - 1 : 0;
        setNumberOfLineBreaks(numOfLineBreaks);
      }
    };

    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    var resizeObserver = new ResizeObserver(handleResize);
    var container = masonryRef.current;
    resizeObserver.observe(container);
    return function () {
      resizeObserver.unobserve(container);
    };
  }, []);
  var handleRef = useForkRef(ref, masonryRef);
  var lineBreakStyle = {
    flexBasis: '100%',
    width: 0,
    margin: 0,
    padding: 0
  };
  return /*#__PURE__*/_jsxs(MasonryRoot, _extends({
    as: component,
    className: clsx(classes.root, className),
    ref: handleRef,
    ownerState: ownerState
  }, other, {
    children: [children, new Array(numberOfLineBreaks).fill('').map(function (_, index) {
      return /*#__PURE__*/_jsx("span", {
        "data-class": "line-break",
        style: _extends({}, lineBreakStyle, {
          order: index + 1
        })
      }, index);
    })]
  }));
});
process.env.NODE_ENV !== "production" ? Masonry.propTypes
/* remove-proptypes */
= {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------

  /**
   * The content of the component.
   */
  children: PropTypes
  /* @typescript-to-proptypes-ignore */
  .node.isRequired,

  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,

  /**
   * @ignore
   */
  className: PropTypes.string,

  /**
   * Number of columns.
   * @default 4
   */
  columns: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), PropTypes.number, PropTypes.object, PropTypes.string]),

  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,

  /**
   * Defines the space between children. It is a factor of the theme's spacing.
   * @default 1
   */
  spacing: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])), PropTypes.number, PropTypes.object, PropTypes.string]),

  /**
   * Allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object
} : void 0;
export default Masonry;