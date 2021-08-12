import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  createUnarySpacing,
  getValue,
  handleBreakpoints,
  unstable_resolveBreakpointValues as resolveBreakpointValues,
} from '@material-ui/system';
import { unstable_useForkRef as useForkRef } from '@material-ui/utils';
import { unstable_composeClasses as composeClasses } from '@material-ui/unstyled';
import { styled, useThemeProps } from '@material-ui/core/styles';
import { getMasonryItemUtilityClass } from './masonryItemClasses';
import MasonryContext from '../Masonry/MasonryContext';

const useUtilityClasses = (styleProps) => {
  const { classes } = styleProps;

  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getMasonryItemUtilityClass, classes);
};

export const style = ({ styleProps, theme }) => {
  let styles = {
    width: '100%',
    '& > *': {
      // all contents should have a width of 100%
      width: '100%',
      boxSizing: 'inherit',
      ...(styleProps.isSSR && { height: '100%' }),
    },
    visibility: styleProps.height ? 'visible' : 'hidden',
    gridColumnEnd: `span ${styleProps.columnSpan}`,
    boxSizing: 'inherit',
  };

  const base = {};
  Object.keys(theme.breakpoints.values).forEach((breakpoint) => {
    if (styleProps.spacing[breakpoint] != null) {
      base[breakpoint] = true;
    }
  });
  const spacingValues = resolveBreakpointValues({ values: styleProps.spacing, base });
  const transformer = createUnarySpacing(theme);
  const styleFromPropValue = (propValue) => {
    const gap = styleProps.height ? Number(getValue(transformer, propValue).replace('px', '')) : 0;
    // For lazy-loaded images to load properly, masonry item should take up space greater than 1px.
    // Taking into account a row gap of 2px, rowSpan should at least be 2.
    const rowSpan = styleProps.height ? Math.ceil((styleProps.height + gap) / 2) : 2;
    return {
      gridRowEnd: `span ${rowSpan}`,
      paddingBottom: gap - 2,
    };
  };
  styles = { ...styles, ...handleBreakpoints({ theme }, spacingValues, styleFromPropValue) };

  return styles;
};

const MasonryItemRoot = styled('div', {
  name: 'MuiMasonryItem',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    return [styles.root];
  },
})(style);

const MasonryItem = React.forwardRef(function MasonryItem(inProps, ref) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiMasonryItem',
  });

  const masonryItemRef = React.useRef(null);

  const { spacing = 1 } = React.useContext(MasonryContext);
  const { children, className, component = 'div', columnSpan = 1, defaultHeight, ...other } = props;
  const isSSR = defaultHeight !== undefined;

  const [height, setHeight] = React.useState(defaultHeight);

  const styleProps = {
    ...props,
    isSSR,
    spacing,
    columnSpan,
    height: height < 0 ? 0 : height, // MasonryItems to which negative or zero height is passed will be hidden
  };

  const classes = useUtilityClasses(styleProps);

  React.useEffect(() => {
    // do not create a resize observer in case of SSR masonry
    if (isSSR) {
      return () => {};
    }
    const resizeObserver = new ResizeObserver(([item]) => {
      setHeight(item.contentRect.height);
    });
    const item = masonryItemRef.current.firstChild;
    resizeObserver.observe(item);
    return () => {
      resizeObserver.unobserve(item);
    };
  }, [isSSR]);

  const handleRef = useForkRef(ref, masonryItemRef);
  return (
    <MasonryItemRoot
      as={component}
      className={clsx(classes.root, className)}
      ref={handleRef}
      styleProps={styleProps}
      {...other}
    >
      {React.Children.only(children)}
    </MasonryItemRoot>
  );
});

MasonryItem.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit the d.ts file and run "yarn proptypes"     |
  // ----------------------------------------------------------------------
  /**
   * The content of the component, normally an `<img />` or a `<div />`. It should be only one element.
   */
  children: PropTypes.element.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * @ignore
   */
  className: PropTypes.string,
  /**
   * The number of columns taken up by the component
   * @default 1
   */
  columnSpan: PropTypes.number,
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * The initial height of the component in px. This is provided for server-side rendering.
   */
  defaultHeight: PropTypes.number,
  /**
   * Allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,
};

export default MasonryItem;
