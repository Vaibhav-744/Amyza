document.addEventListener('DOMContentLoaded', function () {

  /* =========================================
     REVEAL ANIMATION
  ========================================= */
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade'
  );

  if ('IntersectionObserver' in window && revealEls.length) {

    const rObs = new IntersectionObserver(function(entries){

      entries.forEach(function(entry){

        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          rObs.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(function(el){
      rObs.observe(el);
    });

  } else {

    revealEls.forEach(function(el){
      el.classList.add('visible');
    });

  }


  /* =========================================
     CAROUSEL
  ========================================= */
  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach(function(carousel){

    const track    = carousel.querySelector('.carousel-track');
    const viewport = carousel.querySelector('.carousel-viewport');
    const slides   = carousel.querySelectorAll('.carousel-slide');
    const prevBtn  = carousel.querySelector('.carousel-btn.prev');
    const nextBtn  = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');

    if (!track || !slides.length || !viewport) return;

    let index = 0;


    function getPerView(){

      const slideW = slides[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
      const vpW = viewport.offsetWidth;

      return Math.max(
        1,
        Math.round(vpW / (slideW + gap))
      );
    }


    function getMaxIndex(){
      return Math.max(0, slides.length - getPerView());
    }


    function updateCenterSlide(){
      if (carousel.dataset.carousel === 'testimonials'){
        const perView = getPerView();
        slides.forEach(function(s){
          s.classList.remove('featured');
        });

        let centerIdx = index;
        if (perView >= 3) {
          centerIdx = index + 1;
        }

        if (slides[centerIdx]) {
          slides[centerIdx].classList.add('featured');
        }
      }
    }


    function update(){

      const slideW = slides[0].offsetWidth;
      const gap = parseFloat(window.getComputedStyle(track).gap) || 0;

      track.style.transform =
        'translateX(-' + (index * (slideW + gap)) + 'px)';

      updateCenterSlide();
      renderDots();
    }


    function renderDots(){

      if (!dotsWrap) return;

      dotsWrap.innerHTML = '';

      const total = getMaxIndex() + 1;

      for(let i = 0; i < total; i++){

        const btn = document.createElement('button');

        btn.setAttribute(
          'aria-label',
          'Go to slide ' + (i + 1)
        );

        if(i === index){
          btn.classList.add('active');
        }

        btn.addEventListener('click', function(){
          index = i;
          update();
        });

        dotsWrap.appendChild(btn);
      }
    }


    function go(dir){

      const max = getMaxIndex();

      index = index + dir;

      if(index < 0){
        index = max;
      }

      if(index > max){
        index = 0;
      }

      update();
    }


    if(prevBtn){
      prevBtn.addEventListener('click', function(){
        go(-1);
      });
    }

    if(nextBtn){
      nextBtn.addEventListener('click', function(){
        go(1);
      });
    }


    /* =========================================
       TOUCH SWIPE
    ========================================= */
    let startX = 0;
    let isDragging = false;

    viewport.addEventListener('touchstart', function(e){

      startX = e.touches[0].clientX;
      isDragging = true;

    }, { passive: true });


    viewport.addEventListener('touchend', function(e){

      if(!isDragging) return;

      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if(Math.abs(diff) > 40){

        if(diff < 0){
          go(1);
        } else {
          go(-1);
        }

      }

      isDragging = false;

    });


    /* =========================================
       AUTO SLIDE TESTIMONIALS
    ========================================= */
    let autoTimer;

    if(carousel.dataset.carousel === 'testimonials'){

      function startAuto(){

        clearInterval(autoTimer);

        autoTimer = setInterval(function(){
          go(1);
        }, 6000);
      }

      function stopAuto(){
        clearInterval(autoTimer);
      }

      startAuto();

      carousel.addEventListener('mouseenter', stopAuto);
      carousel.addEventListener('mouseleave', startAuto);
    }


    /* =========================================
       RESIZE
    ========================================= */
    let resizeTimer;

    window.addEventListener('resize', function(){

      clearTimeout(resizeTimer);

      resizeTimer = setTimeout(function(){

        index = Math.min(index, getMaxIndex());

        update();

      }, 120);

    });


    update();

  });

});