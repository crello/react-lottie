/// <reference types="react" />
import { AnimationEventCallback, AnimationEventName, AnimationConfigWithPath, AnimationConfigWithData, AnimationDirection, AnimationSegment, AnimationItem } from 'lottie-web';
import CSS from 'csstype';
export interface ReactLottieEvent<T = any> {
    name: AnimationEventName;
    callback: AnimationEventCallback<T>;
}
export declare type ReactLottieConfigWithData = Partial<AnimationConfigWithData> & {
    animationData: any;
};
export declare type ReactLottieConfigWithPath = Partial<AnimationConfigWithPath> & {
    path: string;
};
export declare type ReactLottieConfig = ReactLottieConfigWithData | ReactLottieConfigWithPath;
export interface ReactLottieState {
    config?: ReactLottieConfig;
    lottieEventListeners?: ReactLottieEvent[];
    height?: string;
    width?: string;
    playingState?: ReactLottiePlayingState;
    segments?: AnimationSegment | AnimationSegment[];
    speed?: number;
    style?: CSS.Properties;
    className?: string;
    direction?: AnimationDirection;
}
export interface ReactLottieOwnProps extends ReactLottieState {
    animationRef?: React.MutableRefObject<AnimationItem>;
    config: ReactLottieConfig;
}
export declare type ReactLottiePlayingState = 'playing' | 'paused' | 'stopped';
