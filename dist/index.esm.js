import React from 'react';
import lottiePlayer from 'lottie-web';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var CONTAINER_ID_ATTRIBUTE = 'data-lottie-container-id';
var Lottie = /** @class */ (function (_super) {
    __extends(Lottie, _super);
    function Lottie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.defaultLottieConfig = {
            renderer: 'svg',
            loop: false,
            autoplay: true
        };
        _this.ensureContainerId = function () {
            if (!_this.containerRef.getAttribute(CONTAINER_ID_ATTRIBUTE)) {
                _this.containerRef.setAttribute(CONTAINER_ID_ATTRIBUTE, Lottie.generateUuid());
            }
        };
        _this.destroy = function () {
            var id = _this.containerRef.getAttribute(CONTAINER_ID_ATTRIBUTE);
            _this.animationItem.destroy(id);
            _this.containerRef.removeAttribute(CONTAINER_ID_ATTRIBUTE);
        };
        _this.setAnimationPlayingState = function (state) {
            switch (state) {
                case 'playing': {
                    _this.triggerPlayBasedOnSegments();
                    return;
                }
                case 'stopped': {
                    _this.animationItem.stop();
                    return;
                }
                case 'paused': {
                    _this.animationItem.pause();
                    return;
                }
                default: {
                    throw new Error('Playing state not specified.');
                }
            }
        };
        _this.setContainerRef = function (element) {
            _this.containerRef = element;
        };
        return _this;
    }
    Lottie.prototype.componentDidMount = function () {
        var _a = this.props, configFromProps = _a.config, animationRef = _a.animationRef, lottieEventListeners = _a.lottieEventListeners;
        this.config = __assign(__assign(__assign({}, this.defaultLottieConfig), configFromProps), { container: this.containerRef });
        this.animationItem = lottiePlayer.loadAnimation(this.config);
        if (animationRef) {
            animationRef.current = this.animationItem;
        }
        this.ensureContainerId();
        this.addEventListeners(lottieEventListeners);
        this.configureAnimationItem();
    };
    Lottie.prototype.UNSAFE_componentWillUpdate = function (nextProps) {
        var animationDataChanged = (this.config.animationData !== nextProps.config.animationData);
        var animationPathChanged = (this.config.path !== nextProps.config.path);
        if (animationDataChanged || animationPathChanged) {
            this.removeEventListeners(this.props.lottieEventListeners);
            this.destroy();
            this.config = __assign(__assign({}, this.config), nextProps.config);
            this.animationItem = lottiePlayer.loadAnimation(this.config);
            this.addEventListeners(nextProps.lottieEventListeners);
        }
    };
    Lottie.prototype.componentDidUpdate = function () {
        this.configureAnimationItem();
    };
    Lottie.prototype.componentWillUnmount = function () {
        this.removeEventListeners(this.props.lottieEventListeners);
        this.destroy();
        this.config.animationData = null;
        this.config.path = null;
        this.animationItem = null;
    };
    Lottie.prototype.configureAnimationItem = function () {
        var _a = this.props, playingState = _a.playingState, speed = _a.speed, direction = _a.direction;
        this.setAnimationPlayingState(playingState);
        this.animationItem.setSpeed(speed);
        this.animationItem.setDirection(direction);
    };
    Lottie.prototype.triggerPlayBasedOnSegments = function () {
        var segments = this.props.segments;
        if (segments) {
            this.animationItem.playSegments(segments);
        }
        else {
            this.animationItem.play();
        }
    };
    Lottie.prototype.addEventListeners = function (reactLottieEvents) {
        var _this = this;
        reactLottieEvents.forEach(function (_a) {
            var name = _a.name, callback = _a.callback;
            _this.animationItem.addEventListener(name, callback);
        });
    };
    Lottie.prototype.removeEventListeners = function (reactLottieEvents) {
        var _this = this;
        reactLottieEvents.forEach(function (_a) {
            var name = _a.name, callback = _a.callback;
            _this.animationItem.removeEventListener(name, callback);
        });
    };
    Lottie.prototype.render = function () {
        var _a = this.props, width = _a.width, height = _a.height, style = _a.style, className = _a.className;
        var lottieStyle = __assign({ width: width, height: height }, style);
        return (React.createElement("div", { className: className, ref: this.setContainerRef, style: lottieStyle }));
    };
    Lottie.generateUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    };
    Lottie.defaultProps = {
        lottieEventListeners: [],
        playingState: 'playing',
        speed: 1,
        height: '100%',
        width: '100%',
    };
    return Lottie;
}(React.PureComponent));

export { Lottie };
