import { trigger, transition, style, animate } from '@angular/animations';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnDestroy {
  public expression: string = '';
  public listeners: any = {};
  private currentIndex: number = 0;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.handleAboutUs()
    this.listeners.load = this.renderer.listen('window', 'DOMContentLoaded', () => {
      this.listeners.scroll = this.renderer.listen('window', 'scroll', () => {
        this.handleScroll();
        this.headerParallaxHandler();
        this.handleParalex()
      });
    });

    // Additional initialization code if needed...

    // Switch statement for window width
    switch (true) {
      case window.innerWidth <= 425:
        this.expression = 'mobile';
        break;
      case window.innerWidth > 425 && window.innerWidth <= 768:
        this.expression = 'tablet';
        break;
      default:
        this.expression = 'laptop';
        break;
    }
  }

  ngOnDestroy(): void {
    localStorage.setItem('data', JSON.stringify(this.listeners))
  }

  handleScroll(): void {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 0.1;

    const boxElement = this.el.nativeElement.querySelector('.box');
    const introTextElements = this.el.nativeElement.querySelectorAll('.intro-text');
    const newHeight = scrolled === 0 ? 730 : 730 - winScroll;

    this.renderer.setStyle(boxElement, 'height', newHeight + 'px');

    introTextElements.forEach((text: any, index: number) => {
      const translateValue = scrolled * 14 * (index + 1);
      this.renderer.setStyle(text, 'transform', `translate(0, ${translateValue}px)`);
    });
  }

  headerParallaxHandler(): void {
    let viewportWidth = window.innerWidth;
    const intro: any = this.el.nativeElement.querySelector('.intro');
    const introBtn: any = this.el.nativeElement.querySelector('.intro-btn');
    const racoon: any = this.el.nativeElement.querySelector('.racoon');
    const introText: any = this.el.nativeElement.querySelectorAll('.intro-text');
    if (viewportWidth < 768) {
      intro.classList.remove('fixed');
      this.renderer.setStyle(introBtn, 'opacity', '1');
      this.renderer.setStyle(racoon, 'opacity', '1');
      introText.forEach((text: any) => {
        this.renderer.setStyle(text, 'transform', 'translate(0, 0)');
      });
      return;
    }

    const offsetY = window.scrollY;
    const rate = window.scrollY * 0.1;
    const opacityValue = 1 / (offsetY / 100 + 1);

    introText[0].style.transform = `translate(${rate * 14}px)`;
    introText[1].style.transform = `translate(${rate * -3}px)`;
    introText[2].style.transform = `translate(${rate * 16}px)`;
    introText[3].style.transform = `translate(${rate * 17}px)`;
    introText[4].style.transform = `translate(${rate * -9}px)`;
    introText[5].style.transform = `translate(${rate * 17.5}px)`;
    if (intro) {
      if (offsetY > window.innerHeight) {
        intro.style.pointerEvents = 'none';
        intro.style.opacity = '0';
      } else {
        this.renderer.setStyle(introBtn, 'opacity', `${opacityValue}`);
        this.renderer.setStyle(racoon, 'opacity', `${opacityValue}`);
        intro.style.pointerEvents = 'all';
        intro.style.opacity = '1';
      }
    }
  };

  handleRotate(): void {
    const rotatingBlockItems = Array.from(document.querySelectorAll('.rotating-block-item'));
    const blockItemIndicators = Array.from(document.querySelectorAll('.rotating-block-indicators .dot'));
    const fadingInfoBlocks = Array.from(document.querySelectorAll('.fading-info-item'));
    this.renderer.removeClass(rotatingBlockItems[this.currentIndex], 'rotateShow');
    this.renderer.addClass(rotatingBlockItems[this.currentIndex], 'rotateHide');
    this.renderer.removeClass(blockItemIndicators[this.currentIndex], 'active');
    this.renderer.addClass(fadingInfoBlocks[this.currentIndex], 'not-visible');

    let next = this.currentIndex + 1;
    if (next === rotatingBlockItems.length) {
      next = 0;
    }

    this.renderer.removeClass(rotatingBlockItems[next], 'standby');
    this.renderer.addClass(rotatingBlockItems[next], 'rotateShow');
    this.renderer.removeClass(rotatingBlockItems[next], 'rotateHide');

    setTimeout(() => {
      this.renderer.addClass(blockItemIndicators[next], 'active');
      this.renderer.removeClass(fadingInfoBlocks[next], 'not-visible');
    }, 500);

    this.currentIndex = next;
  }

  handleAboutUs(): void {
    setInterval(() => {
      this.handleRotate();
    }, 4000);
  }

  handleParalex() {
    const nextSection: any = document.querySelector('.processes');
    const nav = this.el.nativeElement.querySelector('.toolbar');
    const prevSection = this.el.nativeElement.querySelector('.services');
    const sectionHeading = this.el.nativeElement.querySelector('.projects .section__heading');
    const projectsShowcase = this.el.nativeElement.querySelector('.projects-desktop-cnt .projects-showcase');
    const projects = this.el.nativeElement.querySelectorAll('.projects-desktop-cnt .project')
    let prevSectionOffset = prevSection.offsetTop;
    const scrollValue = window.scrollY
    console.log(prevSection, sectionHeading, projectsShowcase, projects, prevSectionOffset, scrollValue);
    let firstAnchorPoint =
      prevSectionOffset +
      prevSection.offsetHeight +
      sectionHeading.offsetHeight +
      Math.floor(nav.offsetHeight / 2)
    let secondAnchorPoint = nextSection.offsetTop - window.innerHeight + Math.floor(nav.offsetHeight / 2)
    if (scrollValue < firstAnchorPoint) {
      projectsShowcase.style.transform = `translate(0, Calc(-100% + ${window.innerHeight}px))`
    }
    else if (scrollValue > secondAnchorPoint) {
      projectsShowcase.style.transform = `translate(0, ${(projects.length - 1) * window.innerHeight}px)`
    }
    else if (scrollValue > firstAnchorPoint) {
      projectsShowcase.style.transform = `translate(0, Calc(-100% + ${window.innerHeight + (scrollValue - firstAnchorPoint) * 2}px))`
    }
  }


  handleParallaxSection(): void {
    const viewportWidth = window.innerWidth;

    if (viewportWidth < 992) {
      // Handle logic for viewportWidth < 992
      return;
    }

    const firstSection = this.el.nativeElement.querySelector('.processes');
    const secondSection = this.el.nativeElement.querySelector('.characteristics');
    const parallaxHero = this.el.nativeElement.querySelector('.parallax-hero');

    const firstAnchor = parallaxHero.offsetTop - window.scrollY;
    const secondAnchor = firstAnchor + viewportWidth;

    this.renderer.setStyle(parallaxHero, 'height', `Calc(${window.innerHeight + viewportWidth}px - 5rem)`);

    if (secondAnchor <= 0) {
      this.renderer.setStyle(firstSection, 'transform', `translate(-${viewportWidth}px, 0)`);
      this.renderer.setStyle(secondSection, 'transform', `translate(0, ${secondAnchor}px)`);
    } else if (firstAnchor <= 0) {
      this.renderer.setStyle(firstSection, 'transform', `translate(${firstAnchor}px, 0)`);
      this.renderer.setStyle(secondSection, 'transform', `translate(Calc(100% + ${firstAnchor}px), 0)`);
    } else {
      this.renderer.setStyle(firstSection, 'transform', `translate(0, ${firstAnchor}px)`);
      this.renderer.setStyle(secondSection, 'transform', `translate(100%, ${firstAnchor}px)`);
    }
  }
}

