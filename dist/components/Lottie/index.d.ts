import React from 'react';
import { ReactLottieOwnProps, ReactLottieState } from './interface';
export declare class Lottie extends React.PureComponent<ReactLottieOwnProps, ReactLottieState> {
    private config;
    private containerRef;
    private animationItem;
    private defaultLottieConfig;
    private static generateUuid;
    private ensureContainerId;
    private destroy;
    static defaultProps: {
        lottieEventListeners: any[];
        playingState: string;
        speed: number;
        height: string;
        width: string;
    };
    componentDidMount(): void;
    UNSAFE_componentWillUpdate(nextProps: ReactLottieOwnProps): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    private configureAnimationItem;
    private setAnimationPlayingState;
    private triggerPlayBasedOnSegments;
    private addEventListeners;
    private removeEventListeners;
    private setContainerRef;
    render(): JSX.Element;
}
