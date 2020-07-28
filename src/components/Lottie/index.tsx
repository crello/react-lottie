import React from 'react';
import lottiePlayer, { AnimationItem, AnimationConfig } from 'lottie-web';
import { ReactLottieOwnProps, ReactLottieEvent, ReactLottieConfig, ReactLottiePlayingState, ReactLottieState, ReactLottieConfigWithData, ReactLottieConfigWithPath  } from './interface'

const CONTAINER_ID_ATTRIBUTE = 'data-lottie-container-id';

export class Lottie extends React.PureComponent<ReactLottieOwnProps, ReactLottieState> {
  private config: ReactLottieConfig;
  private containerRef: Element;
  private animationItem: AnimationItem;
  private defaultLottieConfig: Partial<AnimationConfig> = {
    renderer: 'svg',
    loop: false,
    autoplay: true
  };

  private static generateUuid = () =>
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  private ensureContainerId = () => {
    if (!this.containerRef.getAttribute(CONTAINER_ID_ATTRIBUTE)) {
      this.containerRef.setAttribute(CONTAINER_ID_ATTRIBUTE, Lottie.generateUuid());
    }
  };

  private destroy = () => {
    const id = this.containerRef.getAttribute(CONTAINER_ID_ATTRIBUTE);
    this.animationItem.destroy(id);
    this.containerRef.removeAttribute(CONTAINER_ID_ATTRIBUTE);
  };

  public static defaultProps = {
    lottieEventListeners: [],
    playingState: 'playing',
    speed: 1,
    height: '100%',
    width: '100%',
  };

  componentDidMount() {
    const { config: configFromProps, animationRef, lottieEventListeners } = this.props;
    this.config = {
      ...this.defaultLottieConfig,
      ...configFromProps,
      container: this.containerRef,
    };
    this.animationItem = lottiePlayer.loadAnimation(this.config as AnimationConfig);
    if (animationRef) {
      animationRef.current = this.animationItem;
    }
    this.ensureContainerId();
    this.addEventListeners(lottieEventListeners);
    this.configureAnimationItem();
  }

  UNSAFE_componentWillUpdate(nextProps: ReactLottieOwnProps) {//TODO: to be refactored
    const animationDataChanged = ((this.config as ReactLottieConfigWithData).animationData !== (nextProps.config as ReactLottieConfigWithData).animationData);
    const animationPathChanged = ((this.config as ReactLottieConfigWithPath).path !== (nextProps.config as ReactLottieConfigWithPath).path);
    if (animationDataChanged || animationPathChanged) {
      this.removeEventListeners(this.props.lottieEventListeners);
      this.destroy();
      this.config = { ...this.config, ...nextProps.config };
      this.animationItem = lottiePlayer.loadAnimation(this.config as AnimationConfig);
      this.addEventListeners(nextProps.lottieEventListeners);
    }
  }

  componentDidUpdate() {
    this.configureAnimationItem();
  }

  componentWillUnmount() {
    this.removeEventListeners(this.props.lottieEventListeners);
    this.destroy();
    (this.config as ReactLottieConfigWithData).animationData = null;
    (this.config as ReactLottieConfigWithPath).path = null;
    this.animationItem = null;
  }

  private configureAnimationItem() {
    const {
      playingState,
      speed,
      direction,
    } = this.props;
    this.setAnimationPlayingState(playingState);
    this.animationItem.setSpeed(speed);
    this.animationItem.setDirection(direction);
  }

  private setAnimationPlayingState = (state: ReactLottiePlayingState) => {
    switch (state) {
      case 'playing': {
        this.triggerPlayBasedOnSegments();
        return;
      }
      case 'stopped': {
        this.animationItem.stop();
        return;
      }
      case 'paused': {
        this.animationItem.pause();
        return;
      }
      default: {
        throw new Error('Playing state not specified.');
      }
    }
  }

  private triggerPlayBasedOnSegments() {
    const { segments } = this.props;
    if (segments) {
      this.animationItem.playSegments(segments);
    } else {
      this.animationItem.play();
    }
  }

  private addEventListeners(reactLottieEvents: ReactLottieEvent[]) {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem.addEventListener(name, callback);
    });
  }

  private removeEventListeners(reactLottieEvents: ReactLottieEvent[]) {
    reactLottieEvents.forEach(({ name, callback }) => {
      this.animationItem.removeEventListener(name, callback);
    });
  }

  private setContainerRef = (element: HTMLElement) => {
    this.containerRef = element;
  }

  render() {
    const {
      width,
      height,
      style,
      className,
    } = this.props;

    const lottieStyle = {
      width: width,
      height: height,
      ...style,
    };

    return (
      <div
        className={className}
        ref={this.setContainerRef}
        style={lottieStyle}
      />
    );
  }
}
