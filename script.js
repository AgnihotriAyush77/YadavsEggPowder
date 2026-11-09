(() => {
  const $ = (s, scope=document) => scope.querySelector(s);
  const journey = $('.journey');
  const egg = $('#animated-egg');
  const pouch = $('#journey-pouch');
  const particlesRoot = $('#powder-particles');
  const title = $('#journey-title');
  const caption = $('#journey-caption');
  const step = $('#journey-step');
  const progressBar = $('#journey-progress');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Create a cloud of tiny golden powder grains. Their positions are animated from scroll progress.
  const particles = [];
  for (let i=0; i<105; i++) {
    const node = document.createElement('i');
    node.className = 'particle';
    const size = 3 + Math.random()*6;
    node.style.setProperty('--size', `${size}px`);
    node.style.setProperty('--grain', ['#d28a20','#e8a92f','#c77a19','#f2c45c'][i%4]);
    particlesRoot.appendChild(node);
    particles.push({node, x:(Math.random()-.5)*150, y:35+Math.random()*245, delay:Math.random()*.22, sway:(Math.random()-.5)*35});
  }

  let raf = 0;
  function clamp(v){ return Math.max(0,Math.min(1,v)); }
  function render(){
    raf=0;
    const rect=journey.getBoundingClientRect();
    const travel=journey.offsetHeight-window.innerHeight;
    const p=reduceMotion?0:clamp(-rect.top/travel);
    const dissolve=clamp((p-.18)/.39);
    const fall=clamp((p-.43)/.34);
    const pack=clamp((p-.72)/.28);

    // Egg spins several times, then fades into a shower of powder.
    egg.style.opacity=String(1-dissolve);
    egg.style.transform=`translateY(${-22*dissolve}px) rotate(${p*1080}deg) scale(${1-.24*dissolve})`;
    // Each particle begins at the egg and falls toward the pouch opening.
    for(const [i,item] of particles.entries()){
      const local=clamp((dissolve-item.delay)*4.8);
      const falling=clamp((fall-(i%9)*.018)*1.5);
      const x=item.x*local*(1-.72*falling)+item.sway*falling;
      const y=-65+item.y*local+falling*105;
      item.node.style.opacity=String(local*(1-.15*falling));
      item.node.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(${local})`;
    }
    pouch.style.bottom=`${-340+pack*365}px`;
    pouch.style.transform=`translateY(${(1-pack)*15}px) rotate(${-4+pack*4}deg) scale(${.86+.14*pack})`;
    progressBar.style.width=`${p*100}%`;

    if(p<.36){title.innerHTML='A LITTLE EGG.<br>A LOT OF GOODNESS.';caption.textContent='Freshly sourced goodness starts its journey.';step.textContent='01 / FRESH FROM THE FARM';}
    else if(p<.73){title.innerHTML='SPIN. TRANSFORM.<br>POWDER.';caption.textContent='Watch the egg turn into golden powder grains.';step.textContent='02 / THE TRANSFORMATION';}
    else{title.innerHTML='GOODNESS,<br>ALL PACKED UP.';caption.textContent="Meet the YADAV'S Egg Powder pouch.";step.textContent='03 / READY FOR YOUR KITCHEN';}
  }
  function onScroll(){if(!raf)raf=requestAnimationFrame(render);}
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  render();

  const dialog=$('#launch-dialog');
  $('#buy-button').addEventListener('click',()=>dialog.showModal());
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  $('.dialog-ok').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});

  const toggle=$('.menu-toggle'), nav=$('.site-header nav');
  toggle.addEventListener('click',()=>nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
  $('#year').textContent=new Date().getFullYear();
})();