"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.style = void 0;

var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _clsx = _interopRequireDefault(require("clsx"));

var _system = require("@mui/system");

var _utils = require("@mui/utils");

var _core = require("@mui/core");

var _styles = require("@mui/material/styles");

var _masonryClasses = require("./masonryClasses");

var _jsxRuntime = require("react/jsx-runtime");

const _excluded = ["children", "className", "component", "columns", "spacing"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const useUtilityClasses = ownerState => {
  const {
    classes
  } = ownerState;
  const slots = {
    root: ['root']
  };
  return (0, _core.unstable_composeClasses)(slots, _masonryClasses.getMasonryUtilityClass, classes);
};

const computeBreakpointsBase = (breakpoints, prop) => {
  const base = {};
  Object.keys(breakpoints.values).forEach(breakpoint => {
    if (prop[breakpoint] != null) {
      base[breakpoint] = true;
    }
  });
  return base;
};

const style = ({
  ownerState,
  theme
}) => {
  let styles = {
    display: 'flex',
    flexFlow: 'column wrap',
    alignContent: 'space-between',
    boxSizing: 'border-box',
    '& *': {
      boxSizing: 'border-box'
    }
  };
  const spacingValues = (0, _system.unstable_resolveBreakpointValues)({
    values: ownerState.spacing,
    base: computeBreakpointsBase(theme.breakpoints, ownerState.spacing)
  });
  const transformer = (0, _system.createUnarySpacing)(theme);

  const spacingStyleFromPropValue = propValue => {
    const spacing = Number((0, _system.getValue)(transformer, propValue).replace('px', ''));
    return (0, _extends2.default)({
      margin: -(spacing / 2),
      '& *': {
        margin: spacing / 2
      }
    }, ownerState.maxColumnHeight && ownerState.maxNumOfRows && {
      height: ownerState.maxColumnHeight + spacing * ownerState.maxNumOfRows
    });
  };

  styles = (0, _utils.deepmerge)(styles, (0, _system.handleBreakpoints)({
    theme
  }, spacingValues, spacingStyleFromPropValue));
  const columnValues = (0, _system.unstable_resolveBreakpointValues)({
    values: ownerState.columns,
    base: computeBreakpointsBase(theme.breakpoints, ownerState.columns)
  });

  const columnStyleFromPropValue = propValue => {
    return {
      '& *': {
        width: `${(100 / propValue).toFixed(2)}%`
      }
    };
  };

  styles = (0, _utils.deepmerge)(styles, (0, _system.handleBreakpoints)({
    theme
  }, columnValues, columnStyleFromPropValue));
  return styles;
};

exports.style = style;
const MasonryRoot = (0, _styles.styled)('div', {
  name: 'MuiMasonry',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    return [styles.root];
  }
})(style);
const Masonry = /*#__PURE__*/React.forwardRef(function Masonry(inProps, ref) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiMasonry'
  });
  const masonryRef = React.useRef();
  const [maxColumnHeight, setMaxColumnHeight] = React.useState();
  const [maxNumOfRows, setMaxNumOfRows] = React.useState();
  const [numberOfLineBreaks, setNumberOfLineBreaks] = React.useState(0);
  const {
    children,
    className,
    component = 'div',
    columns = 4,
    spacing = 1
  } = props,
        other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const ownerState = (0, _extends2.default)({}, props, {
    spacing,
    columns,
    maxColumnHeight,
    maxNumOfRows
  });
  const classes = useUtilityClasses(ownerState);
  React.useEffect(() => {
    const handleResize = () => {
      let columnHeights;
      let numOfRows;
      let curNumOfCols;
      let skip = false;
      masonryRef.current.childNodes.forEach(child => {
        if (child.nodeType !== Node.ELEMENT_NODE || child.dataset.class === 'line-break' || skip) {
          return;
        }

        const computedStyle = window.getComputedStyle(child);
        const parentWidth = Number(window.getComputedStyle(masonryRef.current).width.replace('px', ''));
        const width = Number(computedStyle.width.replace('px', ''));
        const height = Number(computedStyle.height.replace('px', '')); // if any one of children is not rendered yet, container's height shouldn't be set;
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


        const curMinColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
        columnHeights[curMinColumnIndex] += height;
        numOfRows[curMinColumnIndex] += 1;
        const order = curMinColumnIndex + 1;
        child.style.order = order;
      });

      if (!skip) {
        setMaxColumnHeight(Math.max(...columnHeights));
        setMaxNumOfRows(Math.max(...numOfRows));
        const numOfLineBreaks = curNumOfCols > 0 ? curNumOfCols - 1 : 0;
        setNumberOfLineBreaks(numOfLineBreaks);
      }
    };

    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    const resizeObserver = new ResizeObserver(handleResize);
    const container = masonryRef.current;
    resizeObserver.observe(container);
    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);
  const handleRef = (0, _utils.unstable_useForkRef)(ref, masonryRef);
  const lineBreakStyle = {
    flexBasis: '100%',
    width: 0,
    margin: 0,
    padding: 0
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(MasonryRoot, (0, _extends2.default)({
    as: component,
    className: (0, _clsx.default)(classes.root, className),
    ref: handleRef,
    ownerState: ownerState
  }, other, {
    children: [children, new Array(numberOfLineBreaks).fill('').map((_, index) => /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
      "data-class": "line-break",
      style: (0, _extends2.default)({}, lineBreakStyle, {
        order: index + 1
      })
    }, index))]
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
  children: _propTypes.default
  /* @typescript-to-proptypes-ignore */
  .node.isRequired,

  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,

  /**
   * @ignore
   */
  className: _propTypes.default.string,

  /**
   * Number of columns.
   * @default 4
   */
  columns: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.object, _propTypes.default.string]),

  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: _propTypes.default.elementType,

  /**
   * Defines the space between children. It is a factor of the theme's spacing.
   * @default 1
   */
  spacing: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])), _propTypes.default.number, _propTypes.default.object, _propTypes.default.string]),

  /**
   * Allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.object
} : void 0;
var _default = Masonry;
exports.default = _default;