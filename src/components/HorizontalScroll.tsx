import React, { Component, ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface Props {
  children: ReactNode[];
}

interface State {
  scrollProgress: number;
  isMobile: boolean; // Track screen size
}

export default class CinematicEclipse extends Component<Props, State> {
  private requestRef = 0;
  private targetScroll = 0;
  private currentScroll = 0;
  private lerpAmount = 0.06;

  // 📱 Mobile Touch Tracking
  private touchStartY = 0;
  private isTouching = false;

  state = {
    scrollProgress: 0,
    isMobile: false,
  };

  componentDidMount() {
    this.checkScreenSize();
    window.addEventListener("resize", this.checkScreenSize);
    
    // Only add custom scroll listeners if NOT on mobile
    this.addEventListeners();
    
    window.addEventListener("scrollToSection", this.handleExternalScroll as EventListener);
    this.startAnimation();
  }

  componentWillUnmount() {
    this.removeEventListeners();
    window.removeEventListener("resize", this.checkScreenSize);
    window.removeEventListener("scrollToSection", this.handleExternalScroll as EventListener);
    cancelAnimationFrame(this.requestRef);
  }

  checkScreenSize = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile !== this.state.isMobile) {
      this.setState({ isMobile }, () => {
        if (isMobile) {
          this.removeEventListeners();
          document.body.style.overflow = "auto"; // Re-enable normal scroll
        } else {
          this.addEventListeners();
          document.body.style.overflow = "hidden"; // Lock for cinematic effect
        }
      });
    }
  };

  addEventListeners = () => {
    window.addEventListener("wheel", this.onWheel, { passive: false });
    window.addEventListener("touchstart", this.onTouchStart, { passive: false });
    window.addEventListener("touchmove", this.onTouchMove, { passive: false });
    window.addEventListener("touchend", this.onTouchEnd);
  };

  removeEventListeners = () => {
    window.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
  };

  onTouchStart = (e: TouchEvent) => {
    this.touchStartY = e.touches[0].clientY;
    this.isTouching = true;
  };

  onTouchMove = (e: TouchEvent) => {
    if (!this.isTouching || this.state.isMobile) return;
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const deltaY = this.touchStartY - touchY;
    const totalSlides = React.Children.count(this.props.children);
    const maxScroll = (totalSlides - 1) * 100;
    this.targetScroll = Math.min(Math.max(this.targetScroll + deltaY * 0.2, 0), maxScroll);
    this.touchStartY = touchY;
  };

  onTouchEnd = () => (this.isTouching = false);

  onWheel = (e: WheelEvent) => {
    if (this.state.isMobile) return;
    e.preventDefault();
    const totalSlides = React.Children.count(this.props.children);
    const maxScroll = (totalSlides - 1) * 100;
    this.targetScroll += e.deltaY * 0.1;
    this.targetScroll = Math.min(Math.max(this.targetScroll, 0), maxScroll);
  };

  handleExternalScroll = (e: CustomEvent) => {
    if (this.state.isMobile) return;
    const sectionIndex = e.detail;
    const totalSlides = React.Children.count(this.props.children);
    this.targetScroll = Math.min(Math.max(sectionIndex * 100, 0), (totalSlides - 1) * 100);
  };

  handleExplore = () => {
    if (this.state.isMobile) return;
    const totalSlides = React.Children.count(this.props.children);
    const nextTarget = Math.ceil((this.targetScroll + 1) / 100) * 100;
    this.targetScroll = Math.min(nextTarget, (totalSlides - 1) * 100);
  };

  startAnimation = () => {
    if (!this.state.isMobile) {
      const diff = this.targetScroll - this.currentScroll;
      this.currentScroll += diff * this.lerpAmount;
      this.setState({ scrollProgress: this.currentScroll });
    }
    this.requestRef = requestAnimationFrame(this.startAnimation);
  };

  render() {
    const { children } = this.props;
    const { scrollProgress, isMobile } = this.state;
    const total = React.Children.count(children);

    // Dynamic Mobile/Desktop styles
    const containerStyle: React.CSSProperties = isMobile
      ? { display: "flex", flexDirection: "column", height: "auto", overflowY: "visible" }
      : { position: "fixed", inset: 0, overflow: "hidden", touchAction: "none" };

    return (
      <div className="EclipseContainer" style={containerStyle}>
        {React.Children.map(children, (child, i) => {
          const startThreshold = i * 100;
          const distance = startThreshold - scrollProgress;

          let xPos = 0;
          if (!isMobile) {
            // Desktop Logic
            if (i === 0) xPos = scrollProgress > 200 ? 200 - scrollProgress : 0;
            else if (i === 1) xPos = scrollProgress > 200 ? 200 - scrollProgress : Math.max(0, Math.min(90, (distance / 100) * 90));
            else if (i === 2) xPos = scrollProgress > 300 ? 300 - scrollProgress : Math.max(0, Math.min(90, (distance / 100) * 90));
            else xPos = distance;
          }

          const isVisible = isMobile || (scrollProgress >= (i - 1) * 100 && scrollProgress <= (i + 1) * 100);
          const isPeeking = !isMobile && i > 0 && scrollProgress < startThreshold && scrollProgress >= (i - 1) * 100;

          return (
            <div
              key={i}
              className="SlideWrapper"
              style={{
                position: isMobile ? "relative" : "absolute",
                width: "100%",
                height: isMobile ? "auto" : "100%",
                zIndex: isMobile ? 1 : i,
                transform: isMobile ? "none" : `translate3d(${xPos}%, 0, 0)`,
                visibility: isVisible ? "visible" : "hidden",
                transition: "none",
              }}
            >
              {isPeeking && (
                <div className="PeekingArrowTrigger" onClick={this.handleExplore}>
                  <div className="ArrowIconWrapper">
                    <ChevronRight size={32} strokeWidth={1} />
                    <div className="PulseEffect" />
                  </div>
                </div>
              )}

              <div className="ContentContainer">
                {React.isValidElement(child)
                  ? React.cloneElement(child as React.ReactElement<any>, { onExplore: this.handleExplore })
                  : child}
              </div>
            </div>
          );
        })}

        {!isMobile && (
          <div className="PremiumTrack">
            <div
              className="PremiumBar"
              style={{ width: `${(scrollProgress / ((total - 1) * 100)) * 100}%` }}
            />
          </div>
        )}
      </div>
    );
  }
}