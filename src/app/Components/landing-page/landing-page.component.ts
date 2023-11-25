import { Component, ElementRef, HostListener, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../Utils/dialog/dialog.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnDestroy {
  accordionItems = [
    { title: 'Consultation', content: 'How are the conversations going?',answer:'We start by defining the service provided. If it is construction or design, we ask if there is any logo or business card of the company. Then we will ask about the content that should be included on the website. Based on this, we only create the structure and price the project. Then we start designing.' },
    { title: 'Presentation', content: 'What does the project presentation look like?',answer:' After completing the website design, we present it to you for evaluation. Then we accept all comments regarding the selection of colors, construction of sections, etc. We also explain why certain elements must contain certain features. Then we make any changes.' },
    { title: 'Approval', content: 'What is the approval stage?',answer:'This is the step where you decide to accept or reject our services. If you commission us to create a website, we will tell you how much time it will probably take us. Additionally, we will need the exact content that will ultimately appear on your business card.' },
    { title: 'Execution', content: 'Project execution!',answer:'This is the step where you decide to accept or reject our services. If you commission us to create a website, we will tell you how much time it will probably take us. Additionally, we will need the exact content that will ultimately appear on your business card.' }
  ];
  public expression: string = '';
  public listeners: any = {};
  private currentIndex: number = 0;
  public clicked: boolean = false
  public faqItems:Array<any> = [
    {
      question: 'What is hosting?',
      header: 'Hosting is a server, a place on the Internet for your website',
      answer: 'It allows you to reserve space for your website on someone else\'s server and submit your work to the network. This can be compared to paying for a plot of land that someone rents for you.'
    },
    {
      question: 'Is hosting included in the price of the service?',
      header: 'The price of hosting is not included in our quote.',
      answer:'Purchasing hosting will be your task and we can help you with that. After uploading the website to hosting, we will be able to implement any changes remotely, from our own computer, and we will not need your login details.'
    },
    {
      question: 'Are changes to the website subject to a fee?',
      header: 'We offer free minor changes one year after the end of the service contract.',
      answer:'It would look different if the changes were large, e.g., a new unique section or a complete change of the current ones. Then it takes much more time. However, all changes such as replacing text, photos, small structure changes - they will be free for a year.'
    }
  ];
  public links: Array<any> = [{
    link: 'Home',
    section: '#'
  }, {
    link: 'About us',
    section: '#about-us'
  }, {
    link: 'Service',
    section: '#services'
  }, {
    link: 'FAQ',
    section: '#faq'
  }, {
    link: 'Contact',
    section: '#contact'
  },]
  public processesInfo: Array<any> = [
    {
      heading: 'How do the consultations go?',
      text: 'We start by determining the service you require. If its construction or design, we inquire about any existing logos or business cards. Next, we ask about the content that should be on the website. Based on this, we create the structure and provide a project estimate. Then, we begin the design process.',
      button: 'Consultation'
    },
    {
      heading: 'What does the project presentation look like?',
      text: 'After completing the website project, we present it to you for evaluation. At that point, we welcome any feedback regarding color choices, section structure, etc. We also explain why certain elements must include specific features. Afterward, we make any necessary changes.',
      button: 'Presentation',
    },
    {
      heading: 'What is the approval stage?',
      text: 'This is the step where you decide to proceed with or decline our services. If you entrust us with creating a website, we will inform you of the estimated time required. Additionally, we will need precise content that will be featured on your site.',
      button: 'Approval',
    },
    {
      heading: 'Project Execution!',
      text: 'Leave this step to us! We will immediately start creating your dream website. During this time, you can provide us with any additional information, and we will take it into account. Once the work is finished, all that remains is to host it.',
      button: 'Execution',
    },
  ];
  public accordionContents: any;
  public accordionHeadings: any;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private zone: NgZone,
    private dialog: MatDialog
  ) { }



  @HostListener('window:resize', ['$event'])
  checkWindow() {
    switch (true) {
      case window.innerWidth <= 425:
        this.expression = 'mobile';
        break;
      case window.innerWidth > 425 && window.innerWidth <= 768:
        this.expression = 'tablet';
        break;
      default:
        this.expression = 'laptop';
        this.listeners.load = this.renderer.listen('window', 'DOMContentLoaded', () => {
          this.listeners.scroll = this.renderer.listen('window', 'scroll', () => {
            this.handleScroll();
            this.headerParallaxHandler();
            this.handleParalex()
            this.handleParallaxSection()
          });
        });
        window.addEventListener('resize', () => {
          const accordions = this.el.nativeElement.querySelectorAll('.accordion');
          accordions.forEach((oldAccordion: any, index: number) => {
            const accordion = oldAccordion.cloneNode(true)
            accordion.addEventListener('click', (e: any) => {
              this.handleAccordionContent(e.target, index)
            })
            oldAccordion.replaceWith(accordion)
          })
          this.accordionContents = document.querySelectorAll('.accordion-content');
          this.accordionHeadings = document.querySelectorAll('.accordion-heading');
          this.prepAccordions()
        });
        break;
    }
  }

  ngOnInit(): void {
    this.handleAboutUs()
    this.checkWindow()
    const element = this.el.nativeElement.querySelector('.mobileNavbar')
    if(element){
      this.renderer.setStyle(element,'height','0svh')
    }
  }

  prepAccordions = () => {
    this.accordionContents.forEach((content: any) => {
      content.style.maxHeight = '0px';
    });
  };

  ngOnDestroy(): void {
    localStorage.setItem('data', JSON.stringify(this.listeners))
  }

  @HostListener('mouseout', ['$event'])
  remove = () => {
    const parallaxTexts = this.el.nativeElement.querySelectorAll('.characteristics-item')
    parallaxTexts.forEach((text: any) => {
      text.classList.add('reset-pos');
      text.classList.remove('add-pos');
    });
  };

  @HostListener('mousemove', ['$event'])
  handleParallaxItems = (e: any) => {
    const parallaxTexts = this.el.nativeElement.querySelectorAll('.characteristics-item')
    if (e.target.classList.contains('reset-pos')) {
      e.target.classList.remove('reset-pos');
    }

    let x = e.clientX;
    let y = e.clientY;
    const middleX = e.target.offsetWidth / 2;
    const middleY = e.target.offsetHeight / 2;
    let finalX = (middleX - x) / 40;
    let finalY = (middleY - y) / 40;

    parallaxTexts.forEach((text: any) => {
      if (text.classList.contains('reset-pos')) {
        text.classList.remove('reset-pos');
      }
      text.classList.add('add-pos');

      text.style.setProperty('--transform-y', `${finalY}px`);
      text.style.setProperty('--transform-x', `${finalX}px`);
    });
  };


  handleScroll(): void {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 0.1;

    const boxElement = this.el.nativeElement.querySelector('.intro');
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

  handleAccordionContent = (heading: any, index: number) => {
    const accordionContent = this.accordionContents[index];
    if (accordionContent.style.maxHeight != '0px' && heading.classList.contains('accordion-heading')) {
      accordionContent.style.maxHeight = '0px';
      heading.setAttribute('aria-expanded', 'false')
    } else {
      this.closeAllAccordions();
      const accordionHeight = this.accordionContents[index].scrollHeight;
      accordionContent.style.maxHeight = `${accordionHeight}px`;
      heading.setAttribute('aria-expanded', 'true')
    }
  };

  closeAllAccordions = () => {
    this.accordionContents.forEach((el: { style: { maxHeight: string; }; }) => {
      el.style.maxHeight = '0';
    });
    this.accordionHeadings.forEach((el: { setAttribute: (arg0: string, arg1: string) => void; }) => {
      el.setAttribute('aria-expanded', 'false')
    })
  };

  handleParalex() {
    const nextSection: any = document.querySelector('.parallax-hero');
    const nav = this.el.nativeElement.querySelector('.toolbar');
    const prevSection = this.el.nativeElement.querySelector('.services');
    const sectionHeading = this.el.nativeElement.querySelector('.projects .section__heading');
    const projectsShowcase = this.el.nativeElement.querySelector('.projects-desktop-cnt .projects-showcase');
    const projects = this.el.nativeElement.querySelectorAll('.projects-desktop-cnt .project')
    let prevSectionOffset = prevSection.offsetTop;
    const scrollValue = window.scrollY
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

  changeProcess = (e: any) => {
    const btn = e.target;
    if (btn.classList.contains('active')) {
      return;
    } else {
      this.closeAllProcesses();
      btn.classList.toggle('active');
    }
    this.setContent();
  };

  closeAllProcesses = async () => {
    this.zone.run(() => {
      const processBtns = this.el.nativeElement.querySelectorAll('.processes-list-item');
      processBtns.forEach((btn: any) => {
        btn.classList.remove('active')
      });
    });
  };

  async openDrawer() {
    this.clicked = !this.clicked
    const element = this.el.nativeElement.querySelector('.mobileNavbar')
    if(this.clicked){
     this.renderer.setStyle(element,'height','100svh')
    }else{
      this.renderer.setStyle(element,'height','0svh')
    }
  }

  expand(index:number) {
    const accordionContent = this.el.nativeElement.querySelectorAll('.accordion-content');
    const accordion = this.el.nativeElement.querySelectorAll('.accordion');
    const currentAriaExpanded = accordion[index].getAttribute('aria-expanded') === 'true';
    if (currentAriaExpanded) {
      this.renderer.setStyle(accordionContent[index], 'max-height', '0px');
    } else {
      this.renderer.setStyle(accordionContent[index], 'max-height', '222px');
    }
    accordion[index].setAttribute('aria-expanded', String(!currentAriaExpanded));
  }

  expandFaq(index:number){
    const accordion = this.el.nativeElement.querySelectorAll('.accordionFaq');
    const accordionContent = this.el.nativeElement.querySelectorAll('.FaqContent');
    const currentAriaExpanded = accordion[index].getAttribute('aria-expanded') === 'true';
    if (currentAriaExpanded) {
      this.renderer.setStyle(accordionContent[index], 'max-height', '0px');
    } else {
      this.renderer.setStyle(accordionContent[index], 'max-height', '222px');
    }
    accordion[index].setAttribute('aria-expanded', String(!currentAriaExpanded));
  }

  setContent = () => {
    const processBtns = this.el.nativeElement.querySelectorAll('.processes-list-item')
    const processTitle = this.el.nativeElement.querySelector('.processes-content-title')
    const processText = this.el.nativeElement.querySelector('.processes-content-text')
    for (let i = 0; i < this.processesInfo.length; i++) {
      if (processBtns[i].classList.contains('active')) {
        processTitle.textContent = this.processesInfo[i].heading;
        processText.textContent = this.processesInfo[i].text;
        return;
      }
    }
  };

  async openModel() {
    this.dialog.open(DialogComponent, {
      hasBackdrop: true,
      height: this.expression == 'laptop'?'80%':'45%',
      width: '90%'
    })
  }

}

