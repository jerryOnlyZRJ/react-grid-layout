// @flow
import React from "react";
import PropTypes from "prop-types";
import ReactResizeDetector from "react-resize-detector";
import type { ComponentType as ReactComponentType } from "react";

type WPProps = {
  className?: string,
  measureBeforeMount: boolean,
  style?: Object
};

type WPState = {|
  width: number
|};

/*
 * A simple HOC that provides facility for listening to container resizes.
 */
export default function WidthProvider<
  Props,
  ComposedProps: { ...Props, ...WPProps }
>(
  ComposedComponent: ReactComponentType<Props>
): ReactComponentType<ComposedProps> {
  return class WidthProvider extends React.Component<ComposedProps, WPState> {
    static defaultProps = {
      measureBeforeMount: false
    };

    static propTypes = {
      // If true, will not render children until mounted. Useful for getting the exact width before
      // rendering, to prevent any unsightly resizing.
      measureBeforeMount: PropTypes.bool
    };

    state = {
      width: 1280
    };

    mounted: boolean = false;

    componentDidMount() {
      this.mounted = true;
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const { measureBeforeMount, ...rest } = this.props;
      if (measureBeforeMount && !this.mounted) {
        return (
          <div className={this.props.className} style={this.props.style} />
        );
      }

      return (
        <ReactResizeDetector
          handleWidth={true}
          handleHeight={true}
          onResize={width =>
            this.setState({
              width
            })
          }
        >
          <ComposedComponent {...rest} {...this.state} />
        </ReactResizeDetector>
      );
    }
  };
}
